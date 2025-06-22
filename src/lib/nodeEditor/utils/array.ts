export function zip<U, V>(left: U[], right: V[]): [U | null, V | null][] {
	const max = Math.max(left.length, right.length);
	return Array(max)
		.fill(0)
		.map((_, i) => [left.length > i ? left[i] : null, right.length > i ? right[i] : null]);
}

export function filterValid<T>(value: T | null | undefined): value is T {
	return value !== null && value !== undefined;
}
