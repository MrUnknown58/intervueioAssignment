import crypto from "crypto";

export function generateJoinCode() {
  return crypto
    .randomBytes(3)
    .toString("base64")
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 6)
    .toUpperCase();
}
