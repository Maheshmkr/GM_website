import { createServerFn } from "@tanstack/react-start";

export const getSession = createServerFn({ method: "GET" }).handler(async () => {
  const { getCookie } = await import("@tanstack/react-start/server");
  const role = getCookie("auth_role") as "admin" | "user" | null;
  return { role: role || null };
});

