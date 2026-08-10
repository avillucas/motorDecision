import Redis from "ioredis";
import { SessionRepositoryInterface, UserSession } from "bot-flow";
export declare class RedisSessionRepository implements SessionRepositoryInterface {
    private readonly client;
    constructor(client: Redis);
    load(sessionId: string): Promise<UserSession | null>;
    save(session: UserSession): Promise<void>;
    delete(sessionId: string): Promise<void>;
}
//# sourceMappingURL=redisSessionRepository.d.ts.map