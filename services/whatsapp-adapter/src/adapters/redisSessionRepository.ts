import Redis from "ioredis";
import { SessionRepositoryInterface, UserSession } from "bot-flow";

export class RedisSessionRepository implements SessionRepositoryInterface {
  constructor(private readonly client: Redis) {}

  async load(sessionId: string): Promise<UserSession | null> {
    const payload = await this.client.get(`session:${sessionId}`);
    if (!payload) {
      return null;
    }

    return JSON.parse(payload) as UserSession;
  }

  async save(session: UserSession): Promise<void> {
    await this.client.set(`session:${session.sessionId}`, JSON.stringify(session), "EX", 86400);
  }

  async delete(sessionId: string): Promise<void> {
    await this.client.del(`session:${sessionId}`);
  }
}
