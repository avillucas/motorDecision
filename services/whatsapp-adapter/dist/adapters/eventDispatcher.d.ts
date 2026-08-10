import { EventDispatcherInterface } from "bot-flow";
export declare class ConsoleEventDispatcher implements EventDispatcherInterface {
    private readonly logger;
    dispatch(eventType: string, payload: unknown): Promise<void>;
}
//# sourceMappingURL=eventDispatcher.d.ts.map