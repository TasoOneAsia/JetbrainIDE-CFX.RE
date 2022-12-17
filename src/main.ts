#!/usr/bin/env node

import { GamesType } from "./enum/GamesType";
import figlet from "figlet";
import { terminal as term } from "terminal-kit";
import got from "got";
import { NativeJSONDefinition } from "./types";
import { FilesBuilder } from "./files-builder";
import { ContentGenerate } from "./content-generate";

/**
 * The [[Main]] class that groups together all the logical execution processes of the system.
 */
export class Main {
  /**
   * @param gametype
   */
  private static getNativeLink = (gametype: GamesType): string => {
    switch (gametype) {
      case GamesType.GTA:
        return "https://runtime.fivem.net/doc/natives.json";
      case GamesType.RDR3:
        return "https://raw.githubusercontent.com/alloc8or/rdr3-nativedb-data/master/natives.json";
      case GamesType.Cfx:
        return "https://runtime.fivem.net/doc/natives_cfx.json";
      default:
        return "https://runtime.fivem.net/doc/natives.json";
    }
  };
  /**
   * Startup logicNom de la native fivem
   *
   * @param dir Location of the file where the project will be built
   *
   * @param gametype
   * @return void
   */
  public static onEnable = (dir: string, gametype: GamesType): void => {
    const json = Main.getNativeLink(gametype);
    if (json !== undefined) {
      figlet("JetBrainIDE-CitizenFX", (err, data) => {
        term.blue(data);
        term.red("\n Dylan Malandain - @iTexZoz \n");
      });

      got
        .get(json)
        .json<NativeJSONDefinition>()
        .then((data) => {
          const files = new FilesBuilder(dir);
          files.init().then(async () => {
            files.category(data);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            const builder = new ContentGenerate(files);
            builder.generateTemplate(data);
          });
        })
        .catch((e) => console.error(e));
    } else {
      process.exit();
    }
  };

  /**
   * Folder generate logic
   *
   * @param response
   *
   * @return void
   */
  public static onFolderGenerate = (response: void) => {
    term.cyan("Create build directory successfully : " + response);
  };

  /**
   * File update logic
   *
   * @param stats
   * @param filename Name of the updated file
   * @param nativename Name of the native fivem
   *
   * @return void
   */
  public static onFileUpdate = (
    stats: { native: { total: number; current: number } },
    filename: String,
    nativename: String
  ): void => {
    stats.native.current++;
    term.green("[File : " + filename + " ] [Native : " + nativename + " ]\n");
    if (stats.native.current == stats.native.total) process.exit();
  };
}
