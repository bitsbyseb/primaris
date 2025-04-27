import type { ErrorHandler } from "hono";
import { AbortedStream, NotHttpParams } from "../errors/errors.js";

export const errors: ErrorHandler = (error, c) => {
  // FIXME: create an instance for all this conditions
  // if (error instanceof NotFound) {
  //   return c.json({
  //     error: "the resource doesn't exists",
  //   }, { status: 400 });
  // }

  // if (error instanceof IsADirectory) {
  //   return c.json({
  //     error: "the resource is a directory",
  //   }, { status: 400 });
  // }

  // if (error instanceof NotADirectory) {
  //   return c.json({
  //     error: "the resource is not a directory",
  //   }, { status: 400 });
  // }

  // if (error instanceof AlreadyExists) {
  //   return c.json({
  //     error: "The resource already exists",
  //   }, 400);
  // }

  // if (error instanceof AbortedStream) {
  //   return c.json({ message: "internal server error" }, 500);
  // }

  // if (error instanceof NotHttpParams) {
  //   return c.json({
  //     error: error.msg,
  //   }, 400);
  // }
  console.error(error);
  return c.json({ error: "internal server error" }, 500);
};
