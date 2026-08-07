import { once } from "node:events";
import { createConnection, type Socket } from "node:net";

import { AppError } from "@/errors/app-error.js";
import {
  deleteObject,
  getObjectStream,
  readObjectPrefix,
  setObjectScanStatus,
} from "@/lib/s3.js";

const matches = (bytes: Buffer, signature: number[], offset = 0) =>
  signature.every((value, index) => bytes[offset + index] === value);

const hasExpectedSignature = (contentType: string, bytes: Buffer) => {
  switch (contentType) {
    case "image/jpeg":
      return matches(bytes, [0xff, 0xd8, 0xff]);
    case "image/png":
      return matches(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    case "image/gif":
      return bytes.subarray(0, 6).toString("ascii") === "GIF87a"
        || bytes.subarray(0, 6).toString("ascii") === "GIF89a";
    case "image/webp":
      return bytes.subarray(0, 4).toString("ascii") === "RIFF"
        && bytes.subarray(8, 12).toString("ascii") === "WEBP";
    case "video/mp4":
    case "video/quicktime":
      return bytes.subarray(4, 8).toString("ascii") === "ftyp";
    case "video/webm":
      return matches(bytes, [0x1a, 0x45, 0xdf, 0xa3]);
    default:
      return false;
  }
};

const writeToSocket = async (socket: Socket, data: Buffer) => {
  if (!socket.write(data)) await once(socket, "drain");
};

const scanWithClamAv = async (body: AsyncIterable<Uint8Array>) => {
  const host = process.env.CLAMAV_HOST;
  const required = process.env.NODE_ENV === "production"
    || process.env.CLAMAV_REQUIRED === "true";

  if (!host) {
    if (required) {
      throw new AppError(
        503,
        "MEDIA_SCANNER_NOT_CONFIGURED",
        "Media scanning is temporarily unavailable",
      );
    }
    return "development-unscanned" as const;
  }

  const configuredPort = Number(process.env.CLAMAV_PORT);
  const port = Number.isInteger(configuredPort) && configuredPort > 0
    ? configuredPort
    : 3310;
  const configuredTimeout = Number(process.env.CLAMAV_TIMEOUT_MS);
  const timeoutMs = Number.isInteger(configuredTimeout) && configuredTimeout > 0
    ? configuredTimeout
    : 120_000;

  const socket = createConnection({ host, port });
  socket.setTimeout(timeoutMs);

  try {
    await once(socket, "connect");
    const responsePromise = new Promise<string>((resolve, reject) => {
      let response = "";
      socket.on("data", (chunk: Buffer) => {
        response += chunk.toString("utf8");
        if (response.includes("\0")) resolve(response.replace(/\0/g, "").trim());
      });
      socket.once("error", reject);
      socket.once("timeout", () => reject(new Error("ClamAV scan timed out")));
      socket.once("close", () => {
        if (response) resolve(response.replace(/\0/g, "").trim());
        else reject(new Error("ClamAV closed the connection without a response"));
      });
    });

    await writeToSocket(socket, Buffer.from("zINSTREAM\0"));

    for await (const chunk of body) {
      const data = Buffer.from(chunk);
      const length = Buffer.allocUnsafe(4);
      length.writeUInt32BE(data.length);
      await writeToSocket(socket, length);
      await writeToSocket(socket, data);
    }

    await writeToSocket(socket, Buffer.alloc(4));
    const response = await responsePromise;
    socket.end();

    if (response.endsWith("OK")) return "clean" as const;
    if (response.includes("FOUND")) {
      throw new AppError(400, "MALWARE_DETECTED", "The uploaded file is not safe");
    }

    throw new Error(`Unexpected ClamAV response: ${response}`);
  } catch (error) {
    socket.destroy();
    if (error instanceof AppError) throw error;
    throw new AppError(503, "MEDIA_SCAN_FAILED", "Media scanning is temporarily unavailable");
  }
};

export const validateUploadedMedia = async (
  objectKey: string,
  contentType: string,
) => {
  const prefix = await readObjectPrefix(objectKey);

  if (!hasExpectedSignature(contentType, prefix)) {
    await deleteObject(objectKey);
    throw new AppError(
      400,
      "MEDIA_SIGNATURE_MISMATCH",
      "The uploaded file contents do not match its media type",
    );
  }

  try {
    const status = await scanWithClamAv(await getObjectStream(objectKey));
    await setObjectScanStatus(objectKey, status);
  } catch (error) {
    if (error instanceof AppError && error.code === "MALWARE_DETECTED") {
      await deleteObject(objectKey);
    }
    throw error;
  }
};
