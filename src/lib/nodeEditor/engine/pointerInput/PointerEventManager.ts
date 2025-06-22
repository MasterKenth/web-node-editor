import * as THREE from 'three';

import type { NodeEditorEngine } from '../Engine';
import { EngineObject } from '../EngineObject';
import type { ITickableObject } from '../TickableObject';
import { isPointerEventListener, type IPointerEventListener } from './PointerEventListener';

export class PointerEventManager extends EngineObject implements ITickableObject {
	#pointer = new THREE.Vector2();
	#pointerWs = new THREE.Vector3();
	#raycaster = new THREE.Raycaster();

	#lastTarget: IPointerEventListener | null = null;
	isDragging = false;

	constructor() {
		super();
	}

	onStart(engine: NodeEditorEngine): void {
		super.onStart(engine);

		window.addEventListener('pointermove', this.#onPointerMove.bind(this));
		window.addEventListener('pointerdown', this.#onPointerDown.bind(this));
		window.addEventListener('pointerup', this.#onPointerUp.bind(this));
		window.addEventListener('wheel', this.#onWheel.bind(this));
	}

	#onPointerMove(event: PointerEvent) {
		const canvas = this._engine.canvas;

		const lastPointer = this.#pointer.clone();
		this.#pointer.x = ((event.clientX - canvas.offsetLeft) / canvas.width - 0.5) * 2;
		this.#pointer.y = -(((event.clientY - canvas.offsetTop) / canvas.height - 0.5) * 2);

		this._engine.mainCamera.camera.getWorldPosition(this.#pointerWs);
		this.#pointerWs.x += this._engine.mainCamera.camera.right * this.#pointer.x;
		this.#pointerWs.y -= this._engine.mainCamera.camera.bottom * this.#pointer.y;

		if (this.isDragging) {
			const xDeltaWS = (this.#pointer.x - lastPointer.x) * (this._engine!.canvas.width / 2);
			const yDeltaWS = (this.#pointer.y - lastPointer.y) * (this._engine!.canvas.height / 2);
			this.#lastTarget?.onDrag?.(xDeltaWS, yDeltaWS);
		}
	}

	get pointer() {
		return this.#pointer;
	}

	get pointerWs() {
		return this.#pointerWs;
	}

	#onPointerDown() {
		this.#lastTarget?.onPressDown?.();
		this.isDragging = true;
	}

	#onPointerUp() {
		this.#lastTarget?.onPressUp?.();
		this.isDragging = false;
	}

	#onWheel(event: WheelEvent) {
		this.#lastTarget?.onZoom?.(event.deltaY);
	}

	onEnd(): void {
		super.onEnd();
	}

	tick(): void {
		const newTarget = this.#tracePointerEventListener();
		this._engine.debug.addDebugMessage(`pointer: ${this.#pointer.x} ${this.#pointer.y}`);
		this._engine.debug.addDebugMessage(`pointerWs: ${this.#pointerWs.x} ${this.#pointerWs.y}`);

		if (!this.isDragging) {
			if (newTarget !== this.#lastTarget) {
				if (this.#lastTarget) {
					this.#lastTarget.onHoverEnd?.();
				}

				if (newTarget) {
					newTarget.onHoverBegin?.();
				}

				this.#lastTarget = newTarget;
			}
		}
	}

	#tracePointerEventListener(): IPointerEventListener | null {
		this.#raycaster.setFromCamera(this.#pointer, this._engine!.mainCamera!.camera);
		const intersects = this.#raycaster.intersectObjects(this._engine!.mainScene.children);
		const obj = intersects[0]?.object;
		return isPointerEventListener(obj) ? obj : null;
	}
}
