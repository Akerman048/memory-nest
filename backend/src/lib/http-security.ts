import type { CookieOptions } from "express";

const normalizeOrigin = (value: string) => {
  const url = new URL(value.trim());

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error(`Unsupported frontend origin protocol: ${url.protocol}`);
  }
  if (process.env.NODE_ENV === "production" && url.protocol !== "https:") {
    throw new Error("Frontend origins must use HTTPS in production");
  }

  return url.origin;
};

export const getAllowedOrigins = () => {
  const configured = process.env.FRONTEND_URLS ?? process.env.FRONTEND_URL;

  if (!configured) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("FRONTEND_URLS or FRONTEND_URL must be configured in production");
    }

    return ["http://localhost:3000"];
  }

  const origins = configured
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
    .map(normalizeOrigin);

  if (!origins.length) {
    throw new Error("At least one frontend origin must be configured");
  }

  return [...new Set(origins)];
};

const getSameSite = (): CookieOptions["sameSite"] => {
  const configured = process.env.SESSION_COOKIE_SAME_SITE?.toLowerCase();

  if (configured === "strict" || configured === "lax" || configured === "none") {
    return configured;
  }

  return "lax";
};

export const getSessionCookieOptions = (maxAge?: number): CookieOptions => {
  const sameSite = getSameSite();
  const secure = process.env.NODE_ENV === "production" || sameSite === "none";

  return {
    httpOnly: true,
    sameSite,
    secure,
    path: "/",
    ...(process.env.SESSION_COOKIE_DOMAIN
      ? { domain: process.env.SESSION_COOKIE_DOMAIN }
      : {}),
    ...(maxAge === undefined ? {} : { maxAge }),
  };
};
