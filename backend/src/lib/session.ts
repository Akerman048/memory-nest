import { createHash, randomBytes } from "node:crypto";

export const SESSION_COOKIE_NAME = "memory_nest_session";
export const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export const createSessionToken = () => randomBytes(32).toString("base64url");

export const hashSessionToken = (token: string) =>
  createHash("sha256").update(token).digest("hex");

export const readCookie = (cookieHeader: string | undefined, name: string) => {
  if (!cookieHeader) return undefined;

  for (const cookie of cookieHeader.split(";")) {
    const [rawName, ...rawValue] = cookie.trim().split("=");

    if (rawName === name) {
      return decodeURIComponent(rawValue.join("="));
    }
  }

  return undefined;
};
