export async function getSession(request?: Request): Promise<{ role: "admin" | "user" | null }> {
  if (typeof window === "undefined") {
    // Server-side (SSR): parse cookies from the request object
    if (!request) return { role: null };
    const cookieHeader = request.headers.get("cookie") || "";
    const cookies = cookieHeader.split(";").reduce((acc: Record<string, string>, cookie) => {
      const [name, value] = cookie.trim().split("=");
      if (name && value) acc[name] = value;
      return acc;
    }, {});
    return { role: (cookies["auth_role"] as "admin" | "user" | null) || null };
  } else {
    // Client-side (Browser): fetch using browser's relative fetch
    try {
      const res = await fetch("/api/auth/session");
      if (!res.ok) return { role: null };
      const data = await res.json();
      return { role: data.role };
    } catch (err) {
      console.error("Error fetching session on client:", err);
      return { role: null };
    }
  }
}
