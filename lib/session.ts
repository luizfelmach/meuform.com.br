import { createCookieSessionStorage } from "@remix-run/node"; // or cloudflare/deno
import { env } from "./env";

type SessionData = {
  id: string;
};

type SessionFlashData = {
  error: string;
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
