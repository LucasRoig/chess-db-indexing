import { InvalidArgumentError, program } from "@commander-js/extra-typings";
import { confirm } from "@inquirer/prompts";
import fs from "node:fs";
import { checkFilePath } from "./utils";

function myParseInt(value: string) {
  // parseInt takes a string and a radix
  const parsedValue = Number.parseInt(value, 10);
  if (Number.isNaN(parsedValue)) {
    throw new InvalidArgumentError('Not a number.');
  }
  return parsedValue;
}



program
  .command("cut-pgn")
  .description("Cut a pgn file keeping only the first n games")
  .requiredOption("-i, --input <path>", "input file", checkFilePath)
  .requiredOption("-o, --output <path>", "output file")
  .requiredOption("-n, --number <number>", "number of games to keep", myParseInt)
  .action(async (args, _options) => {
    const answers = await confirm({
      message: "Are you sure you want to cut this file?",
    })
  });
