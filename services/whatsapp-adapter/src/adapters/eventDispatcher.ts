import { EventDispatcherInterface } from "bot-flow";
import pino from "pino";

export class ConsoleEventDispatcher implements EventDispatcherInterface {
  private readonly logger = pino({ level: process.env.LOG_LEVEL ?? "info" });

  async dispatch(eventType: string, payload: unknown): Promise<void> {
    this.logger.info({ eventType, payload }, "event dispatched");
  }
}
