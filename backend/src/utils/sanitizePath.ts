import { join } from "node:path";

export const sanitizePath = (userPath: string): string => {
  const normalizedPath = userPath.replace(/\\/g, "/");
  const segments = normalizedPath.split("/");

  const cleanSegments = segments.filter((segment) => {
    return segment !== "" &&
      segment !== "." &&
      segment !== ".." &&
      !segment.startsWith(".");
  });
  const cleanPath = cleanSegments.join("/");
  const safePath = join("/", cleanPath);
  return safePath.slice(1);
};
