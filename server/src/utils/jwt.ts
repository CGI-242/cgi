import jwt from "jsonwebtoken";

if (!process.env.JWT_SECRET) {
  throw new Error("FATAL: JWT_SECRET is not defined. Server cannot start without it.");
}
if (!process.env.JWT_REFRESH_SECRET) {
  throw new Error("FATAL: JWT_REFRESH_SECRET is not defined. Server cannot start without it.");
}

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || "15m") as jwt.SignOptions["expiresIn"];
const JWT_REFRESH_EXPIRES_IN = (process.env.JWT_REFRESH_EXPIRES_IN || "7d") as jwt.SignOptions["expiresIn"];
const JWT_REMEMBER_EXPIRES_IN = "7d" as jwt.SignOptions["expiresIn"];
const JWT_REMEMBER_REFRESH_EXPIRES_IN = "30d" as jwt.SignOptions["expiresIn"];

interface TokenPayload {
  userId: string;
  email: string;
}

export function generateAccessToken(payload: TokenPayload, rememberMe?: boolean): string {
  const expiresIn = rememberMe ? JWT_REMEMBER_EXPIRES_IN : JWT_EXPIRES_IN;
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function generateRefreshToken(payload: TokenPayload, rememberMe?: boolean): string {
  const expiresIn = rememberMe ? JWT_REMEMBER_REFRESH_EXPIRES_IN : JWT_REFRESH_EXPIRES_IN;
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn });
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload;
}
