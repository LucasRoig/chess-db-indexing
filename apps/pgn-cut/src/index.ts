import { createReadStream, createWriteStream } from "node:fs";
import { PgnParser, makePgn } from "chessops/pgn";

const limit = 100_000;

async function main() {
  const stream = createReadStream("../../pgn/caissabase-2024-full.pgn", { encoding: "utf-8" });
  const writeStream = createWriteStream("../../pgn/caissabase-2024-100k.pgn", { encoding: "utf-8" });
  let count = 0;

  const parser = new PgnParser((game, err) => {
    if (err) {
      // Budget exceeded.
      stream.destroy(err);
    }
    count++;
    if (count <= limit) {
      if (count % 1000 === 0) {
        console.log(count);
      }
      writeStream.write(makePgn(game));
    } else {
      stream.destroy();
    }
  });

  await new Promise<void>((resolve) =>
    stream
      .on("data", (chunk) => {
        if (typeof chunk === "string") {
          parser.parse(chunk, { stream: true });
        } else {
          parser.parse(chunk.toString(), { stream: true });
        }
      })
      .on("close", () => {
        parser.parse("");
        resolve();
      }),
  );
}

main();
