import type { ErrorHandler } from "hono";
import { AbortedStream, NotHttpParams } from "../errors/errors.ts";

export const errors: ErrorHandler = (error, c) => {
  if (error instanceof Deno.errors.NotFound) {
    return c.json({
      error: "the resource doesn't exists",
    }, { status: 400 });
  }

  if (error instanceof Deno.errors.IsADirectory) {
    return c.json({
      error: "the resource is a directory",
    }, { status: 400 });
  }

  if (error instanceof Deno.errors.NotADirectory) {
    return c.json({
      error: "the resource is not a directory",
    }, { status: 400 });
  }

  if (error instanceof Deno.errors.AlreadyExists) {
    return c.json({
      error: "The resource already exists",
    }, 400);
  }

  if (error instanceof AbortedStream) {
    return c.json({ message: "internal server error" }, 500);
  }

  if (error instanceof NotHttpParams) {
    return c.json({
      error: error.msg,
    }, 400);
  }
  return c.json({ error: "internal server error" }, 500);
};
