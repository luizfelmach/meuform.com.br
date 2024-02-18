import { createCookieSessionStorage } from "@remix-run/node";
import { env } from "./env";

export type SessionData = {
  id: string;
};

export type SessionFlashData = {
  error?: { message: string; id: number };
  success?: { message: string; id: number };
  payment?: { message: string; id: number };
};

export const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>({
    cookie: {
      name: "meuform:token",
      secrets: [env.JWT_SECRET],
      sameSite: "lax",
      httpOnly: true,
      maxAge: 60 * 60 * 8,
      path: "/",
      secure: true,
    },
  });
