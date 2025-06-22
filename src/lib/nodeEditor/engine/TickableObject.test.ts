import { expect, test } from 'vitest';
import { isTickableObject } from './TickableObject';

test('isTickableObject', () => {
	expect(isTickableObject(undefined)).toBe(false);
	expect(isTickableObject(null)).toBe(false);
	expect(isTickableObject({})).toBe(false);
	expect(isTickableObject({ tick(deltaSeconds: number) {} })).toBe(true);
});
