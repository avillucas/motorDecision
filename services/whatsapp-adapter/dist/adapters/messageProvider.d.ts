import { BotMessage, MessageProviderInterface } from "bot-flow";
import { WASocket } from "@adiwajshing/baileys";
export declare class WhatsAppMessageProvider implements MessageProviderInterface {
    private readonly socket;
    constructor(socket: WASocket);
    send(message: BotMessage): Promise<void>;
}
//# sourceMappingURL=messageProvider.d.ts.map