import type { Command } from "commander";
import { systemRequire } from "./utils.js";
import { registerWidgetCommands } from "./widget/index.js";

const packageJson = systemRequire("../package.json");

export const registerCommands = (cli: Command) => {
  cli.helpOption("-h", "Отображает помощь по командам");
  cli.name("im-package-cli");
  cli.version(
    packageJson.version,
    "-v, --version",
    "Текущая версия библиотеки"
  );

  registerWidgetCommands(cli);
};
