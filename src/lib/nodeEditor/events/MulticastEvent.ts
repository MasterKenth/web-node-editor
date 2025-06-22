export class MulticastEvent<T extends readonly unknown[] = []> {
	#listeners: Set<(...args: T) => void> = new Set();

	add(listener: (...args: T) => void) {
		this.#listeners.add(listener);
	}

	remove(listener: (...args: T) => void) {
		this.#listeners.delete(listener);
	}

	broadcast(...args: T) {
		this.#listeners.forEach((listener) => {
			try {
				listener(...args);
			} catch (error) {
				console.error('Error in MulticastEvent listener', error);
			}
		});
	}
}
