import { BotMessage, SessionId, UserMessage, UserSession } from "./types";
export interface SessionRepositoryInterface {
    load(sessionId: SessionId): Promise<UserSession | null>;
    save(session: UserSession): Promise<void>;
    delete(sessionId: SessionId): Promise<void>;
}
export interface MessageProviderInterface {
    send(message: BotMessage): Promise<void>;
}
export interface EventDispatcherInterface {
    dispatch(eventType: string, payload: unknown): Promise<void>;
}
export interface FlowContext {
    session: UserSession;
    incoming: UserMessage;
}
//# sourceMappingURL=ports.d.ts.map