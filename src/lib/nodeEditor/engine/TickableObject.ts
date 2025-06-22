export interface ITickableObject {
	tick(deltaSeconds: number): void;
}

export function isTickableObject(obj: object | null | undefined): obj is ITickableObject {
	return !!obj && 'tick' in obj;
}
