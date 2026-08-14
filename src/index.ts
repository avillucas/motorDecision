import { WhatsAppAdapter } from "./infrastructure/WhatsAppAdapter";

const adapter = new WhatsAppAdapter();

console.log("Iniciando Bot de WhatsApp...");
adapter.start().catch(err => {
    console.error("Error crítico al iniciar el bot:", err);
});
