import { program } from "@commander-js/extra-typings";

program
  .command("test-command")
  .description("Test command")
  .argument("<name>", "Name of the user")
  .action((name) => {
    console.log(`Hello, ${name}!`);
  });
