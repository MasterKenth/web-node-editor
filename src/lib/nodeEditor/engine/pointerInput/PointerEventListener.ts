export interface IPointerEventListener {
	onHoverBegin?(): void;
	onHoverEnd?(): void;
	onPressDown?(): void;
	onPressUp?(): void;

	/**
	 *
	 * @param x Amount moved in X-axis, in world space
	 * @param y Amount moved in Y-axis, in world space
	 */
	onDrag?(x: number, y: number): void;

	onZoom?(value: number): void;
}

export function isPointerEventListener(
	obj: object | null | undefined
): obj is IPointerEventListener {
	return (
		!!obj &&
		['onHoverBegin', 'onHoverEnd', 'onPressDown', 'onPressUp', 'onDrag', 'onZoom'].some((prop) =>
			Object.hasOwn(obj, prop)
		)
	);
}

export function asPointerEventListener<T>(
	obj: T,
	pointerEvents: IPointerEventListener
): T & IPointerEventListener {
	const pointerObj = obj as unknown as IPointerEventListener;
	if (pointerEvents.onHoverBegin) {
		pointerObj.onHoverBegin = pointerEvents.onHoverBegin;
	}

	if (pointerEvents.onHoverEnd) {
		pointerObj.onHoverEnd = pointerEvents.onHoverEnd;
	}

	if (pointerEvents.onPressDown) {
		pointerObj.onPressDown = pointerEvents.onPressDown;
	}

	if (pointerEvents.onPressUp) {
		pointerObj.onPressUp = pointerEvents.onPressUp;
	}

	if (pointerEvents.onDrag) {
		pointerObj.onDrag = pointerEvents.onDrag;
	}

	if (pointerEvents.onZoom) {
		pointerObj.onZoom = pointerEvents.onZoom;
	}

	return pointerObj as unknown as T & IPointerEventListener;
}
