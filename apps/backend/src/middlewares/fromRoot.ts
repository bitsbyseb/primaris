import type { Context, MiddlewareHandler, Next } from "hono";
import { getCookie } from "hono/cookie";

export const fromRoot: MiddlewareHandler = async (c: Context, next: Next) => {
  try {
    const fromRootCookie = getCookie(c, "fromRoot");
    if (!fromRootCookie) {
      return c.redirect("/");
    }
    await next();
  } catch {
    return c.json({
      error: "internal server error",
    }, 500);
  }
};
