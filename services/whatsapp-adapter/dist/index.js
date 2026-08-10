"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baileys_1 = __importDefault(require("@adiwajshing/baileys"));
const Types_1 = require("@adiwajshing/baileys/lib/Types");
const use_multi_file_auth_state_1 = require("@adiwajshing/baileys/lib/Utils/use-multi-file-auth-state");
const path_1 = __importDefault(require("path"));
const ioredis_1 = __importDefault(require("ioredis"));
const bot_flow_1 = require("bot-flow");
const redisSessionRepository_1 = require("./adapters/redisSessionRepository");
const messageProvider_1 = require("./adapters/messageProvider");
const eventDispatcher_1 = require("./adapters/eventDispatcher");
const REDIS_URL = process.env.REDIS_URL ?? "redis://localhost:6379";
const AUTH_FOLDER = process.env.WA_SESSION_DIR ?? "/usr/src/app/auth";
async function main() {
    const authFolder = path_1.default.resolve(AUTH_FOLDER);
    const { state, saveCreds } = await (0, use_multi_file_auth_state_1.useMultiFileAuthState)(authFolder);
    const redisClient = new ioredis_1.default(REDIS_URL);
    const sessionRepository = new redisSessionRepository_1.RedisSessionRepository(redisClient);
    const socket = (0, baileys_1.default)({
        auth: state,
        printQRInTerminal: true,
        browser: ["bot-flow", "Chrome", "1.0"]
    });
    socket.ev.on("creds.update", saveCreds);
    const flowMachine = new bot_flow_1.FlowMachine(sessionRepository, new messageProvider_1.WhatsAppMessageProvider(socket), new eventDispatcher_1.ConsoleEventDispatcher());
    socket.ev.on("messages.upsert", async (messages) => {
        try {
            for (const msg of messages.messages) {
                if (!msg.message || msg.key.fromMe || msg.key.remoteJid === "status@broadcast") {
                    continue;
                }
                const from = msg.key.remoteJid ?? "unknown";
                const text = msg.message.conversation ?? msg.message?.extendedTextMessage?.text ?? "";
                if (!text)
                    continue;
                const incoming = {
                    sessionId: from,
                    from,
                    text,
                    receivedAt: new Date().toISOString()
                };
                await flowMachine.process(incoming);
            }
        }
        catch (error) {
            console.error("Error procesando mensajes entrantes:", error);
        }
    });
    socket.ev.on("connection.update", (update) => {
        const { connection, lastDisconnect } = update;
        console.log("Connection update:", connection);
        if (connection === "close" && lastDisconnect?.error) {
            const status = lastDisconnect.error?.output?.statusCode;
            if (status !== Types_1.DisconnectReason.loggedOut) {
                console.log("Reconnecting...");
                socket.end(new Error("reconnect"));
            }
        }
    });
}
main().catch((error) => {
    console.error("Error iniciando whatsapp adapter:", error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map