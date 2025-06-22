import * as THREE from 'three';
import { EngineCamera } from './EngineCamera';
import { type IEngineObject } from './EngineObject';
import { isTickableObject, type ITickableObject } from './TickableObject';
import { PointerEventManager } from './pointerInput/PointerEventManager';
import { DebugInfoManager } from './DebugInfoManager';

export class NodeEditorEngine {
	#canvas: HTMLCanvasElement;
	#mainScene!: THREE.Scene;
	#renderer!: THREE.WebGLRenderer;

	mainCamera!: EngineCamera;
	pointer!: PointerEventManager;
	framerateLimit: number = 1000;
	startTimeMs: number = -1;
	deltaSeconds: number = -1;
	totalSeconds: number = -1;

	#lastRenderTimeMs: number = -1;

	#allObjects = new Set<IEngineObject>();
	#tickableObjects = new Set<ITickableObject>();
	debug = new DebugInfoManager();

	constructor(canvas: HTMLCanvasElement) {
		this.#canvas = canvas;
	}

	start() {
		this.#mainScene = new THREE.Scene();
		this.#canvas.width = this.#canvas.clientWidth;
		this.#canvas.height = this.#canvas.clientHeight;
		this.#renderer = new THREE.WebGLRenderer({ canvas: this.#canvas, antialias: true });
		this.#renderer.setViewport(0, 0, this.#canvas.width, this.#canvas.height);

		this.#renderer.setClearColor(new THREE.Color().setHex(0xff00ff));

		this.#lastRenderTimeMs = performance.now();
		this.startTimeMs = performance.now();

		this.mainCamera = new EngineCamera();
		this.addObject(this.mainCamera);
		this.addObject(this.debug);

		this.pointer = new PointerEventManager();
		this.addObject(this.pointer);

		/* this.#mainScene.add(
			new THREE.Mesh(
				new THREE.BoxGeometry(100, 100),
				new THREE.MeshBasicMaterial({ color: 0xff0000 })
			)
				.translateX(50)
				.translateY(50)
		); */

		requestAnimationFrame(this.#MainLoop.bind(this));

		window.addEventListener('resize', this.#onResize.bind(this));
	}

	#onResize() {
		this.#canvas.width = this.#canvas.clientWidth;
		this.#canvas.height = this.#canvas.clientHeight;
		this.#renderer.setSize(this.#canvas.width, this.#canvas.height, false);
		this.mainCamera.reapplySize();
	}

	get canvas() {
		return this.#canvas;
	}

	get mainScene() {
		return this.#mainScene!;
	}

	get fps() {
		return 1.0 / this.deltaSeconds;
	}

	addObject(newObj: IEngineObject) {
		this.#allObjects.add(newObj);
		if (isTickableObject(newObj)) {
			this.#tickableObjects.add(newObj);
		}
		this.#mainScene!.add(newObj.getRootObject());
		newObj.onStart(this);
	}

	#removeObject(obj: IEngineObject) {
		this.#mainScene!.remove(obj.getRootObject());
		this.#allObjects.delete(obj);
		if (isTickableObject(obj)) {
			this.#tickableObjects.delete(obj);
		}
	}

	#MainLoop(previousFrameTimeMs: DOMHighResTimeStamp) {
		requestAnimationFrame(this.#MainLoop.bind(this));

		if (previousFrameTimeMs - this.#lastRenderTimeMs >= 1000.0 / this.framerateLimit) {
			this.deltaSeconds = (previousFrameTimeMs - this.#lastRenderTimeMs) * 0.001;
			this.totalSeconds += this.deltaSeconds;
			this.#lastRenderTimeMs = previousFrameTimeMs;

			this.#tickableObjects.forEach((obj) => obj.tick(this.deltaSeconds));

			this.#renderer.render(this.#mainScene, this.mainCamera.camera);

			const toRemove = [...this.#allObjects].filter((obj) => obj.isPendingDestroy());
			toRemove.forEach(this.#removeObject.bind(this));
		}
	}
}
