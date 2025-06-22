import { EngineObject } from './EngineObject';
import type { ITickableObject } from './TickableObject';

export class SimpleTickObject extends EngineObject implements ITickableObject {
	#tickFunc: (deltaSeconds: number) => void;

	constructor(tick: (deltaSeconds: number) => void) {
		super();
		this.#tickFunc = tick;
	}

	tick(deltaSeconds: number): void {
		this.#tickFunc(deltaSeconds);
	}
}
