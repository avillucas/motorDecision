"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlowMachine = void 0;
class FlowMachine {
    constructor(sessionRepository, messageProvider, eventDispatcher) {
        this.sessionRepository = sessionRepository;
        this.messageProvider = messageProvider;
        this.eventDispatcher = eventDispatcher;
    }
    async process(incoming) {
        const sessionId = incoming.sessionId;
        const existingSession = await this.sessionRepository.load(sessionId);
        const session = existingSession ?? {
            sessionId,
            userId: incoming.from,
            state: "idle",
            metadata: {},
            lastMessage: undefined
        };
        const context = {
            session,
            incoming
        };
        const response = this.next(context);
        session.state = response.nextState;
        session.lastMessage = incoming.text;
        session.metadata = { ...session.metadata, ...response.metadata };
        await this.sessionRepository.save(session);
        await this.messageProvider.send(response.message);
        await this.eventDispatcher.dispatch("message.sent", {
            sessionId,
            to: response.message.to,
            text: response.message.text,
            nextState: response.nextState
        });
    }
    next(context) {
        const { session, incoming } = context;
        if (session.state === "idle") {
            return {
                message: {
                    to: incoming.from,
                    text: "Hola! Soy tu asistente. ¿En qué puedo ayudarte hoy?"
                },
                nextState: "awaiting_input",
                metadata: {}
            };
        }
        if (session.state === "awaiting_input") {
            return {
                message: {
                    to: incoming.from,
                    text: `Recibí tu mensaje: \"${incoming.text}\". Estoy procesando tu solicitud...`
                },
                nextState: "processing",
                metadata: { lastUserText: incoming.text }
            };
        }
        return {
            message: {
                to: incoming.from,
                text: "Tu conversación está en estado de procesamiento. Por favor espera un momento."
            },
            nextState: "finished",
            metadata: {}
        };
    }
}
exports.FlowMachine = FlowMachine;
//# sourceMappingURL=flowMachine.js.map