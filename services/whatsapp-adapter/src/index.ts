import makeWASocket, { WASocket } from "@adiwajshing/baileys";
import { DisconnectReason } from "@adiwajshing/baileys/lib/Types";
import { useMultiFileAuthState } from "@adiwajshing/baileys/lib/Utils/use-multi-file-auth-state";
import path from "path";
import Redis from "ioredis";
import { FlowMachine, UserMessage } from "bot-flow";
import { RedisSessionRepository } from "./adapters/redisSessionRepository";
import { WhatsAppMessageProvider } from "./adapters/messageProvider";
import { ConsoleEventDispatcher } from "./adapters/eventDispatcher";

const REDIS_URL = process.env.REDIS_URL ?? "redis://localhost:6379";
const AUTH_FOLDER = process.env.WA_SESSION_DIR ?? "/usr/src/app/auth";

async function main() {
  const authFolder = path.resolve(AUTH_FOLDER);
  const { state, saveCreds } = await useMultiFileAuthState(authFolder);

  const redisClient = new Redis(REDIS_URL);
  const sessionRepository = new RedisSessionRepository(redisClient);

  const socket: WASocket = makeWASocket({
    auth: state,
    printQRInTerminal: true,
    browser: ["bot-flow", "Chrome", "1.0"]
  });

  socket.ev.on("creds.update", saveCreds);

  const flowMachine = new FlowMachine(
    sessionRepository,
    new WhatsAppMessageProvider(socket),
    new ConsoleEventDispatcher()
  );

  socket.ev.on("messages.upsert", async (messages) => {
    try {
      for (const msg of messages.messages) {
        if (!msg.message || msg.key.fromMe || msg.key.remoteJid === "status@broadcast") {
          continue;
        }

        const from = msg.key.remoteJid ?? "unknown";
        const text = msg.message.conversation ?? msg.message?.extendedTextMessage?.text ?? "";
        if (!text) continue;

        const incoming: UserMessage = {
          sessionId: from,
          from,
          text,
          receivedAt: new Date().toISOString()
        };

        await flowMachine.process(incoming);
      }
    } catch (error) {
      console.error("Error procesando mensajes entrantes:", error);
    }
  });

  socket.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;
    console.log("Connection update:", connection);
    if (connection === "close" && lastDisconnect?.error) {
      const status = (lastDisconnect.error as any)?.output?.statusCode;
      if (status !== DisconnectReason.loggedOut) {
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
