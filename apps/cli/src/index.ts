import { program } from "@commander-js/extra-typings";
import "./commands/cut-pgn";
import "./commands/test-command";
import "./commands/count-games";

program.name("chess-cli").description("CLI to do chess stuff").version("0.0.1");

program.parse();
