export type SessionId = string;
export type ConversationState = "idle" | "awaiting_input" | "processing" | "finished";
export interface UserMessage {
    sessionId: SessionId;
    from: string;
    text: string;
    receivedAt: string;
}
export interface BotMessage {
    to: string;
    text: string;
}
export interface UserSession {
    sessionId: SessionId;
    userId: string;
    state: ConversationState;
    metadata: Record<string, unknown>;
    lastMessage?: string;
}
//# sourceMappingURL=types.d.ts.map