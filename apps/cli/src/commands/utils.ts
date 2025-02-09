import { InvalidArgumentError } from "@commander-js/extra-typings";
import fs from "node:fs";

export function checkFilePath(path: string) {
  try {
    const isFile = fs.statSync(path).isFile();
    if (!isFile) {
      throw new InvalidArgumentError("Not a file.");
    }
    return path;
  } catch (e) {
    if (e instanceof Error) {
      throw new InvalidArgumentError(e.message);
    } else {
      throw new InvalidArgumentError("Unknown file error.");
    }
  }
}
