"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleEventDispatcher = void 0;
const pino_1 = __importDefault(require("pino"));
class ConsoleEventDispatcher {
    constructor() {
        this.logger = (0, pino_1.default)({ level: process.env.LOG_LEVEL ?? "info" });
    }
    async dispatch(eventType, payload) {
        this.logger.info({ eventType, payload }, "event dispatched");
    }
}
exports.ConsoleEventDispatcher = ConsoleEventDispatcher;
//# sourceMappingURL=eventDispatcher.js.map