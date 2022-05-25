import { Client, Intents } from "discord.js";
import axios, { AxiosResponse } from "axios";
import { readFileSync } from "fs";
import FormData from "form-data";
interface CommandData {
  name: string;
  description: string;
  price: number;
  message: string;
  command: string;
}

const data: CommandData[] = JSON.parse(readFileSync("./data.json").toString());

const commandMap = data.reduce((acc, cur) => {
  return {
    ...acc,
    [cur.price]: cur,
  };
}, {} as Record<number, CommandData>);

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_MESSAGE_TYPING,
    Intents.FLAGS.GUILD_WEBHOOKS,
  ],
});

const axiosClient = axios.create({
  baseURL: "http://localhost:4567",
  headers: {
    key: "test123",
    "Content-Type": "application/x-www-form-urlencoded",
  },
});

const sendCommand = (command: string) => {
  const d = new FormData();
  d.append("command", command);
  return new Promise<AxiosResponse>((res, rej) => {
    axiosClient.post("/v1/server/exec", d).then(res).catch(rej);
  });
};

client.on("ready", () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

const replacesKey = ["message", "command"];

client.on("messageCreate", async (message) => {
  if (message.author.username == "SociaBuzz")
    for (const embed of message.embeds) {
      // msg        title: 'DONASI DAMAR_ALB SEBESAR Rp10.000 DARI Jessica',

      if (!embed.title) continue;

      const titles = embed.title.split(" ");

      const tag = titles[0];
      const player = titles[1];
      const amount = parseInt(titles[3]?.replace("Rp", "").replace(".", ""));
      const from = titles[5];

      const commandData = commandMap[amount];

      if (!commandData) {
        message.channel.send(
          `donasi sebesar ${amount} dari ${from} tidak ditemukan ...`
        );

        return;
      }

      if (tag == "DONASI") {
        const compiledCommand = commandData?.command
          ?.replace("$donatur", from)
          .replace("$amount", `${amount}`);

        const compiledMessage = commandData?.command
          ?.replace("$donatur", from)
          .replace("$amount", `${amount}`);

        sendCommand(compiledCommand)
          .then((e) => {
            message.channel.send(
              `[${player}] Donasi dari  ${from} berhasil diproses`
            );
            message.channel.send(`[${player}] command : ${compiledCommand}`);
            message.channel.send(
              `[${player}] response : ${JSON.stringify(e.data)}`
            );
          })
          .catch((e) => {
            message.channel.send(
              `[${player}] Donasi dari  ${from} gagal diproses ${e}`
            );
          });
      }
    }
});

client.users.client.login(
  "Nzc4MTI4NTE3MTAzMDkxNzEy.GsKLfe.y5a-cwDPpJHhj-isMHbOoGDEI_anr2B8euBeFY"
);
