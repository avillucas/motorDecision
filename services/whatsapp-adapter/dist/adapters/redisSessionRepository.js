"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisSessionRepository = void 0;
class RedisSessionRepository {
    constructor(client) {
        this.client = client;
    }
    async load(sessionId) {
        const payload = await this.client.get(`session:${sessionId}`);
        if (!payload) {
            return null;
        }
        return JSON.parse(payload);
    }
    async save(session) {
        await this.client.set(`session:${session.sessionId}`, JSON.stringify(session), "EX", 86400);
    }
    async delete(sessionId) {
        await this.client.del(`session:${sessionId}`);
    }
}
exports.RedisSessionRepository = RedisSessionRepository;
//# sourceMappingURL=redisSessionRepository.js.map