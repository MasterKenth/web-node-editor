import { MulticastEvent } from '../events/MulticastEvent';
import { EngineObject } from './EngineObject';
import type { ITickableObject } from './TickableObject';

interface DebugMessage {
	message: string;
	endtime: number;
}

export class DebugInfoManager extends EngineObject implements ITickableObject {
	#messages: DebugMessage[] = [];

	onMessagesChanged = new MulticastEvent<[string[]]>();

	tick(): void {
		const time = performance.now();
		let updatePending = false;
		for (let i = this.#messages.length - 1; i >= 0; --i) {
			if (this.#messages[i].endtime <= time) {
				this.#messages.splice(i, 1);
				updatePending = true;
			}
		}
		if (updatePending) {
			this.onMessagesChanged.broadcast(this.messages);
		}
	}

	get messages() {
		return this.#messages.map((m) => m.message);
	}

	addDebugMessage(message: string, lifetime: number = 0.001) {
		this.#messages.push({ message, endtime: performance.now() + lifetime * 1000 });
		this.onMessagesChanged.broadcast(this.messages);
	}
}
