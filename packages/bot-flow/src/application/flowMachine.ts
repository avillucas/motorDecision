import {
  BotMessage,
  ConversationState,
  SessionId,
  UserMessage,
  UserSession
} from "../domain/types";
import {
  EventDispatcherInterface,
  FlowContext,
  MessageProviderInterface,
  SessionRepositoryInterface
} from "../domain/ports";

export class FlowMachine {
  constructor(
    private readonly sessionRepository: SessionRepositoryInterface,
    private readonly messageProvider: MessageProviderInterface,
    private readonly eventDispatcher: EventDispatcherInterface
  ) {}

  async process(incoming: UserMessage): Promise<void> {
    const sessionId = incoming.sessionId;
    const existingSession = await this.sessionRepository.load(sessionId);

    const session: UserSession = existingSession ?? {
      sessionId,
      userId: incoming.from,
      state: "idle",
      metadata: {},
      lastMessage: undefined
    };

    const context: FlowContext = {
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

  private next(context: FlowContext): {
    message: BotMessage;
    nextState: ConversationState;
    metadata: Record<string, unknown>;
  } {
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
