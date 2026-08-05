import {
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);

export const hashPassword = async (password: string) => {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;

  return `scrypt:${salt}:${derivedKey.toString("hex")}`;
};

export const verifyPassword = async (password: string, storedHash: string) => {
  const [algorithm, salt, encodedKey] = storedHash.split(":");

  if (algorithm !== "scrypt" || !salt || !encodedKey) {
    return false;
  }

  const storedKey = Buffer.from(encodedKey, "hex");
  const derivedKey = (await scrypt(password, salt, storedKey.length)) as Buffer;

  return storedKey.length === derivedKey.length && timingSafeEqual(storedKey, derivedKey);
};
