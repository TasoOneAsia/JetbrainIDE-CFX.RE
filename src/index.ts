import { GamesType } from "./enum/GamesType";
import { terminal as term } from "terminal-kit";
import { Main } from "./main";

term.cyan(
  "Welcome to the native completion generator tool for Jetbrain IDEs for Cfx.re projects.\n"
);
term.cyan("Please select the natives you wish to generate\n");

const items: string[] = [
  "1. (FiveM) GTA V",
  "2. (RedM) Red Dead Redemption 2",
  "3. CFX (Is Available for RedM && FiveM)",
  "4. All categories",
];

term.on("key", (name: string) => {
  if (name === "CTRL_C") {
    term.green("SIGINT detected, exiting");
    process.exit();
  }
});

term.singleColumnMenu(items, function (error, response) {
  switch (response.selectedIndex) {
    case 0:
      return Main.onEnable("bin/cfx/GTAV", GamesType.GTA);
    case 1:
      return Main.onEnable("bin/cfx/RDR3", GamesType.RDR3);
    case 2:
      return Main.onEnable("bin/cfx/CFX-NATIVE", GamesType.Cfx);
    case 3:
      Main.onEnable("bin/cfx/GTAV", GamesType.GTA);
      Main.onEnable("bin/cfx/RDR3", GamesType.RDR3);
      return Main.onEnable("bin/cfx/CFX-NATIVE", GamesType.Cfx);
  }
});
