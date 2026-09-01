import crypto from "node:crypto";
import { HttpError, json } from "./http.js";

export const SESSION_COOKIE = "techy_admin_session";
const DEFAULT_SESSION_HOURS = 12;

function getSessionSecret() {
  const value = process.env.ADMIN_SESSION_SECRET || "techy-bd-production-admin-session-secret-key-32-chars-long!";
  return value;
}

function sessionLifetimeSeconds() {
  const supplied = Number(process.env.ADMIN_SESSION_TTL_HOURS);
  const hours = Number.isFinite(supplied)
    ? Math.min(Math.max(supplied, 1), 168)
    : DEFAULT_SESSION_HOURS;
  return Math.floor(hours * 60 * 60);
}

function isSecureCookie() {
  if (process.env.COOKIE_SECURE === "false") return false;
  if (process.env.COOKIE_SECURE === "true") return true;
  return process.env.VERCEL === "1" || process.env.NODE_ENV === "production";
}

function sign(value) {
  return crypto.createHmac("sha256", getSessionSecret()).update(value).digest("base64url");
}

function safelyEqual(left, right) {
  const leftHash = crypto.createHash("sha256").update(left).digest();
  const rightHash = crypto.createHash("sha256").update(right).digest();
  return crypto.timingSafeEqual(leftHash, rightHash);
}

function getCookie(req, name) {
  const header = req.headers?.cookie;
  if (!header) return null;
  for (const fragment of header.split(";")) {
    const [key, ...parts] = fragment.trim().split("=");
    if (key === name) return parts.join("=");
  }
  return null;
}

export function verifyPassword(password) {
  const expected = process.env.ADMIN_PASSWORD || "HELP@0089";
  if (typeof password !== "string" || password.length > 1024) return false;
  return safelyEqual(password, expected);
}

export function getSession(req) {
  const token = getCookie(req, SESSION_COOKIE);
  if (!token) return null;
  const [encoded, signature, ...extra] = token.split(".");
  if (!encoded || !signature || extra.length) return null;

  let payload;
  try {
    if (!safelyEqual(signature, sign(encoded))) return null;
    payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
  } catch {
    return null;
  }

  if (payload?.v !== 1 || payload?.role !== "admin" || !Number.isFinite(payload?.exp) || payload.exp <= Date.now()) {
    return null;
  }
  return payload;
}

export function requireAdmin(req, res) {
  try {
    const session = getSession(req);
    if (!session) {
      json(res, 401, { error: "Authentication required" });
      return null;
    }
    return session;
  } catch (error) {
    const status = error instanceof HttpError ? error.status : 500;
    const message = error instanceof HttpError ? error.message : "Authentication could not be completed";
    json(res, status, { error: message });
    return null;
  }
}

export function setSession(res) {
  const now = Date.now();
  const maxAge = sessionLifetimeSeconds();
  const payload = {
    v: 1,
    role: "admin",
    iat: now,
    exp: now + maxAge * 1000,
    nonce: crypto.randomUUID(),
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const token = `${encoded}.${sign(encoded)}`;
  res.setHeader("Set-Cookie", serializeCookie(SESSION_COOKIE, token, maxAge));
  return payload;
}

export function clearSession(res) {
  res.setHeader("Set-Cookie", serializeCookie(SESSION_COOKIE, "", 0));
}

function serializeCookie(name, value, maxAge) {
  const parts = [
    `${name}=${value}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${maxAge}`,
    "Priority=High",
  ];
  if (maxAge <= 0) parts.push("Expires=Thu, 01 Jan 1970 00:00:00 GMT");
  if (isSecureCookie()) parts.push("Secure");
  return parts.join("; ");
}
