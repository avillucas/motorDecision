"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsAppMessageProvider = void 0;
class WhatsAppMessageProvider {
    constructor(socket) {
        this.socket = socket;
    }
    async send(message) {
        await this.socket.sendMessage(message.to, { text: message.text });
    }
}
exports.WhatsAppMessageProvider = WhatsAppMessageProvider;
//# sourceMappingURL=messageProvider.js.map