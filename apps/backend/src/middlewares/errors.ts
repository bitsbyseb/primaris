import type { ErrorHandler } from "hono";
import {isBoom} from '@hapi/boom';
import { AbortedStream } from "../errors/errors.ts";
import type { ContentfulStatusCode } from "hono/utils/http-status";

export const errors: ErrorHandler = (error, c) => {
  console.error(error);
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
      
  if (isBoom(error)) {
    const statusCode = error.output.statusCode as ContentfulStatusCode;
    const message = error.output.payload.message;
    return c.json({
      error:message
    },error.output.statusCode as ContentfulStatusCode);
  }

  if (error instanceof AbortedStream) {
    return c.json({ error: "internal server error" }, 500);
  }
  
  return c.json({ error: "internal server error" }, 500);
};
