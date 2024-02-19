import { SessionType, commitSession } from "@/lib/session";
import { TypedResponse, json, redirect } from "@remix-run/node";

type jsonSessionFunction = <Data>(
  data: Data,
  session: SessionType
) => Promise<TypedResponse<Data>>;

type redirectSessionFunction = <Data>(
  url: string,
  session: SessionType
) => Promise<TypedResponse<Data>>;

export const jsonSession: jsonSessionFunction = async (data, session) => {
  return json(data, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export const redirectSession: redirectSessionFunction = async (
  url,
  session
) => {
  return redirect(url, {
    headers: { "Set-Cookie": await commitSession(session) },
  });
};
