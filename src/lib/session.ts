import { cookies } from "next/headers";

const SESSION_COOKIE = "session";

export interface SessionPayload {
  email: string;
  loggedInAt: string;
}

export async function createSession(email: string) {
  const payload: SessionPayload = { email, loggedInAt: new Date().toISOString() };
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, Buffer.from(JSON.stringify(payload)).toString("base64"), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(Buffer.from(raw, "base64").toString("utf-8")) as SessionPayload;
  } catch {
    return null;
  }
}

export { SESSION_COOKIE };
