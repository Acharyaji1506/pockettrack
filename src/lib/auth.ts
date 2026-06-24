import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "pockettrack-dev-secret";
const COOKIE_NAME = "pt_session";
const SEVEN_DAYS = 60 * 60 * 24 * 7;

export type SessionPayload = {
  userId: string;
  username: string;
};

export function signSession(payload: SessionPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: SEVEN_DAYS });
}

export function verifySession(token: string): SessionPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as SessionPayload;
  } catch {
    return null;
  }
}

export function sessionCookie(token: string) {
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SEVEN_DAYS}${
    process.env.NODE_ENV === "production" ? "; Secure" : ""
  }`;
}

export function clearSessionCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
