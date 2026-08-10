import { UserMessage } from "../domain/types";
import { EventDispatcherInterface, MessageProviderInterface, SessionRepositoryInterface } from "../domain/ports";
export declare class FlowMachine {
    private readonly sessionRepository;
    private readonly messageProvider;
    private readonly eventDispatcher;
    constructor(sessionRepository: SessionRepositoryInterface, messageProvider: MessageProviderInterface, eventDispatcher: EventDispatcherInterface);
    process(incoming: UserMessage): Promise<void>;
    private next;
}
//# sourceMappingURL=flowMachine.d.ts.map