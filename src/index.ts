/* eslint-disable @typescript-eslint/ban-ts-comment */
import { exec } from "child_process";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";
import "dotenv/config.js";
import {
  Bot,
  ButtonsManager,
  CommandManager,
  Compiler,
  EventManager,
  SlashManager,
} from "dtscommands";
import { mkdir, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";

import { BuildCommands } from "./utility/build.js";
// import './selfIndex.js'

const bot = new Bot({
  commandsDir: path.join(process.cwd(), "src", "main", "commands"),
  eventsDir: path.join(process.cwd(), "src", "main", "events"),
  prefix: process.env.PREFIX || "!",
  additionalPrefixes: ["?"],
  uniCommandsDir: path.join(process.cwd(), "src", "main", "uniCommands"),
  slashCommandsDir: path.join(process.cwd(), "src", "main", "slashCommands"),
  cooldown: 0,
  mentionMessage: {
    content: "",
    embeds: [
      new EmbedBuilder()
        .setTitle("Hello I'm Bazar Exchange Manager")
        .setDescription(
          `I will help you to manage your marketplace.\n\nMy prefix is \`${
            process.env.PREFIX || "!"
          }\`\n\nTo get command list \`${process.env.PREFIX || "!"}help\`\n\n`
        )
        .setColor("Aqua")
        .setFooter({
          text: "Made with ❤️ by Siyam Hosan aka ByteBender",
        }),
    ],
    components: [
      new ActionRowBuilder().addComponents([
        new ButtonBuilder()
          .setURL("https://discord.gg/bazarex")
          .setLabel("Exchange Server")
          .setStyle(ButtonStyle.Link),
      ]),
    ],
  },
});

main();

async function main() {
  for (const of of ["events", "commands", "slashCommands", "buttons"]) {
    await CompileManager(of);
  }

  bot.login().then(() => {
    const watchers = [
      "unhandledRejection",
      "uncaughtException",
      "uncaughtExceptionMonitor",
    ];

    watchers.forEach((str) => {
      process.on(str, (data) => {
        console.log(data);
      });
    });
  });
}

async function CompileManager(of: string) {
  if (process.env.NODE_ENV === "dev") {
    await BuildCommands(of);
  }

  await ImportCommands(of);
}

async function ImportCommands(of: string) {
  const exportedClasses = JSON.parse(
    readFileSync(`./src/main/${of}/bundle/classes.json`, {
      encoding: "utf-8",
    })
  );

  switch (of) {
    case "events":
      {
        const allImports = await import("./main/events/bundle/bundled.js");
        await EventManager(bot, exportedClasses, allImports);
      }
      break;
  }
}

export default bot;

export const client = bot;
