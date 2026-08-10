import { BotMessage, MessageProviderInterface } from "bot-flow";
import makeWASocket, { WASocket } from "@adiwajshing/baileys";

export class WhatsAppMessageProvider implements MessageProviderInterface {
  constructor(private readonly socket: WASocket) {}

  async send(message: BotMessage): Promise<void> {
    await this.socket.sendMessage(message.to, { text: message.text });
  }
}
