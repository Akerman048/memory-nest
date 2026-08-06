import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { AppError } from "@/errors/app-error.js";

const UPLOAD_URL_TTL_SECONDS = 10 * 60;
const DOWNLOAD_URL_TTL_SECONDS = 60 * 60;

let client: S3Client | undefined;

const getConfig = () => {
  const region = process.env.AWS_REGION;
  const bucket = process.env.AWS_S3_BUCKET ?? process.env.AWS_BUCKET_NAME;

  if (!region || !bucket) {
    throw new AppError(
      503,
      "MEDIA_STORAGE_NOT_CONFIGURED",
      "Media storage is not configured",
    );
  }

  return { region, bucket };
};

const getClient = () => {
  const { region } = getConfig();

  client ??= new S3Client({
    region,
    ...(process.env.AWS_S3_ENDPOINT
      ? { endpoint: process.env.AWS_S3_ENDPOINT }
      : {}),
    forcePathStyle: process.env.AWS_S3_FORCE_PATH_STYLE === "true",
  });

  return client;
};

export const createUploadUrl = async (
  objectKey: string,
  contentType: string,
  sizeBytes: number,
) => {
  const { bucket } = getConfig();
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: objectKey,
    ContentType: contentType,
    ContentLength: sizeBytes,
  });

  return getSignedUrl(getClient(), command, {
    expiresIn: UPLOAD_URL_TTL_SECONDS,
  });
};

export const createDownloadUrl = async (objectKey: string) => {
  const { bucket } = getConfig();
  return getSignedUrl(
    getClient(),
    new GetObjectCommand({ Bucket: bucket, Key: objectKey }),
    { expiresIn: DOWNLOAD_URL_TTL_SECONDS },
  );
};

export const inspectObject = async (objectKey: string) => {
  const { bucket } = getConfig();
  return getClient().send(
    new HeadObjectCommand({ Bucket: bucket, Key: objectKey }),
  );
};

export const deleteObject = async (objectKey: string) => {
  const { bucket } = getConfig();
  await getClient().send(
    new DeleteObjectCommand({ Bucket: bucket, Key: objectKey }),
  );
};
