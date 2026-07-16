import { randomBytes, createHash } from "crypto";

const CODE_TTL_MS = 5 * 60 * 1000;

export function generateAuthCode() {
  return "dfc_" + randomBytes(24).toString("base64url");
}

export function codeExpiry() {
  return new Date(Date.now() + CODE_TTL_MS).toISOString();
}

export function verifyPkce(verifier: string, challenge: string) {
  const computed = createHash("sha256").update(verifier).digest("base64url");
  return computed === challenge;
}
