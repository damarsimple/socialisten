"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const axios_1 = __importDefault(require("axios"));
const fs_1 = require("fs");
const form_data_1 = __importDefault(require("form-data"));
const data = JSON.parse((0, fs_1.readFileSync)("./data.json").toString());
const commandMap = data.reduce((acc, cur) => {
    return Object.assign(Object.assign({}, acc), { [cur.price]: cur });
}, {});
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.Intents.FLAGS.GUILDS,
        discord_js_1.Intents.FLAGS.GUILD_MESSAGES,
        discord_js_1.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        discord_js_1.Intents.FLAGS.GUILD_MESSAGE_TYPING,
        discord_js_1.Intents.FLAGS.GUILD_WEBHOOKS,
    ],
});
const axiosClient = axios_1.default.create({
    baseURL: "http://localhost:4567",
    headers: {
        key: "test123",
        "Content-Type": "application/x-www-form-urlencoded",
    },
});
const sendCommand = (command) => {
    const d = new form_data_1.default();
    d.append("command", command);
    return new Promise((res, rej) => {
        axiosClient.post("/v1/server/exec", d).then(res).catch(rej);
    });
};
client.on("ready", () => {
    var _a;
    console.log(`Logged in as ${(_a = client.user) === null || _a === void 0 ? void 0 : _a.tag}!`);
});
const replacesKey = ["message", "command"];
client.on("messageCreate", (message) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    if (message.author.username == "SociaBuzz")
        for (const embed of message.embeds) {
            // msg        title: 'DONASI DAMAR_ALB SEBESAR Rp10.000 DARI Jessica',
            if (!embed.title)
                continue;
            const titles = embed.title.split(" ");
            const tag = titles[0];
            const player = titles[1];
            const amount = parseInt((_a = titles[3]) === null || _a === void 0 ? void 0 : _a.replace("Rp", "").replace(".", ""));
            const from = titles[5];
            const commandData = commandMap[amount];
            if (!commandData) {
                message.channel.send(`donasi sebesar ${amount} dari ${from} tidak ditemukan ...`);
                return;
            }
            if (tag == "DONASI") {
                const compiledCommand = (_b = commandData === null || commandData === void 0 ? void 0 : commandData.command) === null || _b === void 0 ? void 0 : _b.replace("$donatur", from).replace("$amount", `${amount}`);
                const compiledMessage = (_c = commandData === null || commandData === void 0 ? void 0 : commandData.command) === null || _c === void 0 ? void 0 : _c.replace("$donatur", from).replace("$amount", `${amount}`);
                sendCommand(compiledCommand)
                    .then((e) => {
                    message.channel.send(`[${player}] Donasi dari  ${from} berhasil diproses`);
                    message.channel.send(`[${player}] command : ${compiledCommand}`);
                    message.channel.send(`[${player}] response : ${JSON.stringify(e.data)}`);
                })
                    .catch((e) => {
                    message.channel.send(`[${player}] Donasi dari  ${from} gagal diproses ${e}`);
                });
            }
        }
}));
client.users.client.login("Nzc4MTI4NTE3MTAzMDkxNzEy.GsKLfe.y5a-cwDPpJHhj-isMHbOoGDEI_anr2B8euBeFY");
