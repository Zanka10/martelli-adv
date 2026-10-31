// Funções de token compatíveis com o runtime Edge (usadas também no middleware).
import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "martelli_session";
export const SESSION_MAX_AGE = 60 * 60 * 8; // 8 horas

export type SessionPayload = { uid: string; v: number };

function secretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET ausente ou muito curto (mínimo de 32 caracteres). Configure-o no arquivo .env.");
  }
  return new TextEncoder().encode(secret);
}

export async function signSession(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(secretKey());
}

export async function verifySession(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey(), { algorithms: ["HS256"] });
    if (typeof payload.uid !== "string" || typeof payload.v !== "number") return null;
    return { uid: payload.uid, v: payload.v };
  } catch {
    return null;
  }
}
