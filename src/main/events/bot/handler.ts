import { Message } from "discord.js";
import { Event } from "dtscommands";
import { AddHisab, ClearHisab, TotalHisab } from "../../../utility/writter.js";
import moment from "moment";
import { config } from "../../../config.js";

export class HisabHandler extends Event<"messageCreate"> {
  constructor() {
    super({
      name: "messageCreate",
      nick: "HisabHandler",
    });
  }

  async run(message: Message): Promise<void> {
    if (message.channelId !== config.channelId || message.author.bot) {
      return;
    }

    if (message.content === "total") {
      const data = await TotalHisab();

      const total = data.reduce((acc, curr) => acc + curr.amount, 0);

      const today = moment().format("DD/MM/YYYY");
      let relyMessage: string = `-------------------[Hisab]-------------------\nDATE: ${today}\n------->`;

      const spaceTotal = 65;

      data.forEach((item, i) => {
        let infoText = `\n${i + 1}. [${moment(item.timestamp).format(
          "mm:HH A DD/MM/YYYY"
        )}] ${item.userId}(${item.messageId})`;

        const amountText =
          item.amount > 0 ? `+${item.amount}` : `${item.amount}`;

        const extraSpaces = spaceTotal - infoText.length;

        infoText += " ".repeat(extraSpaces) + amountText;

        relyMessage += infoText;
      });

      relyMessage += `\n--------------------[COUNT: ${data.length}]-------------------\n-------> TOTAL: ${total}`;

      message.reply(`\`\`\`py\n${relyMessage}\`\`\``);

      return;
    }

    if (message.content === "# clear") {
      const data = await TotalHisab();

      await ClearHisab();

      message.reply(`\`\`\`py\n> ${data.length} Hisab has been
cleared\n${data
        .map((i) => {
          if (i.amount > 0) {
            return `+${i.amount}`;
          } else {
            return `-${Math.abs(i.amount)}`;
          }
        })
        .join("")}\n------------------------------------\nTOTAL = ${data.reduce(
        (acc, curr) => acc + curr.amount,
        0
      )}\`\`\``);

      return;
    }

    const amountText = message.content
      .replace(/\s/g, "")
      .replace(/ /, "")
      .replace(/,/g, "")
      .replace(/٫/g, "");

    let amount = parseInt(amountText);

    if (
      message.author.id === "782272157627056190" &&
      !message.content.startsWith("+")
    ) {
      amount = parseInt(`-${amountText}`);
    }

    console.log("Amount: ", amount);

    if (isNaN(amount)) {
      message.react("❌");
      return;
    }

    const userId = message.author.displayName;

    const { newData, oldData } = await AddHisab({
      userId,
      amount,
      messageId: message.id,
    });

    message.reply(
      `\`\`${oldData.reduce(
        (acc, curr) => acc + curr.amount,
        0
      )} + ${amount} = ${newData.reduce(
        (acc, curr) => acc + curr.amount,
        0
      )}\`\``
    );
  }
}
