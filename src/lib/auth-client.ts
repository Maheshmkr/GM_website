import { createServerFn } from "@tanstack/react-start";
import { verifySessionToken } from "./security";

export const getSession = createServerFn({ method: "GET" }).handler(async () => {
  const { getCookie } = await import("@tanstack/react-start/server");
  const sessionCookie = getCookie("auth_session");
  const session = verifySessionToken(sessionCookie);

  return {
    role: session?.role || null,
    username: session?.username || null,
    userId: session?.userId || null,
  };
});
