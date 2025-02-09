import { program } from "@commander-js/extra-typings";
import { checkFilePath } from "./utils";
import { createReadStream } from "node:fs";
import { PgnParser } from "chessops/pgn";
import ora from "ora";

program
  .command("count-games")
  .description("Count games in a pgn file")
  .argument("<path>", "Pgn path", checkFilePath)
  .action(async (path) => {
    let count = 0;

    const parser = new PgnParser((_game, err) => {
      if (err) {
        // Budget exceeded.
        stream.destroy(err);
      }
      count++;
    });
    const spinner = ora("Counting games...").start();
    const stream = createReadStream(path, { encoding: "utf-8" });
    process.on("SIGINT", () => {
      stream.destroy();
    })
    await new Promise<void>((resolve) =>
      stream
        .on("data", (chunk) => {
          if (typeof chunk === "string") {
            parser.parse(chunk, { stream: true });
          } else {
            parser.parse(chunk.toString(), { stream: true });
          }
          spinner.text = `Counting games... ${count}`;
        })
        .on("close", () => {
          parser.parse("");
          spinner.text = "Counting games...";
          resolve();
        }),
    );
    spinner.succeed();

    console.info(count);
  });
