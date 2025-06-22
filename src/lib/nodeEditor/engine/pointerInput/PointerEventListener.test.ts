import { expect, test } from 'vitest';
import { asPointerEventListener, isPointerEventListener } from './PointerEventListener';

test('isPointerEventListener', () => {
	expect(isPointerEventListener(undefined)).toBe(false);
	expect(isPointerEventListener(null)).toBe(false);
	expect(isPointerEventListener({})).toBe(false);
	expect(isPointerEventListener({ onHoverBegin() {} })).toBe(true);
	expect(isPointerEventListener({ onHoverEnd() {} })).toBe(true);
	expect(isPointerEventListener({ onPressDown() {} })).toBe(true);
	expect(isPointerEventListener({ onPressUp() {} })).toBe(true);
	expect(isPointerEventListener({ onDrag() {} })).toBe(true);
	expect(isPointerEventListener({ onZoom() {} })).toBe(true);
});

test('asPointerEventListener', () => {
	expect(isPointerEventListener(asPointerEventListener({}, {}))).toBe(false);
	expect(isPointerEventListener(asPointerEventListener({}, { onHoverBegin() {} }))).toBe(true);
	expect(isPointerEventListener(asPointerEventListener({}, { onHoverEnd() {} }))).toBe(true);
	expect(isPointerEventListener(asPointerEventListener({}, { onPressDown() {} }))).toBe(true);
	expect(isPointerEventListener(asPointerEventListener({}, { onPressUp() {} }))).toBe(true);
	expect(isPointerEventListener(asPointerEventListener({}, { onDrag() {} }))).toBe(true);
	expect(isPointerEventListener(asPointerEventListener({}, { onZoom() {} }))).toBe(true);
});
