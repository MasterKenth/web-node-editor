import * as THREE from 'three';
import { clamp } from 'three/src/math/MathUtils.js';
import { EngineObject } from './EngineObject';
import type { NodeEditorEngine } from './Engine';
import { asPointerEventListener } from './pointerInput/PointerEventListener';
import { createSquare } from '../utils/mesh';
import type { ITickableObject } from './TickableObject';

export class EngineCamera extends EngineObject implements ITickableObject {
	#camera!: THREE.OrthographicCamera;
	#canvas!: HTMLCanvasElement;
	#movementPlane!: THREE.Mesh;

	#zoomScale: number = 1;

	#minZoom = 0.1;
	#maxZoom = 2.0;

	onStart(engine: NodeEditorEngine): void {
		super.onStart(engine);

		this.#canvas = engine.canvas;

		this.#camera = new THREE.OrthographicCamera(
			this.#canvas.clientWidth / -2,
			this.#canvas.clientWidth / 2,
			this.#canvas.clientHeight / 2,
			this.#canvas.clientHeight / -2,
			0.1,
			2000
		).translateZ(1000);
		this._rootScene.add(this.#camera);

		this.#movementPlane = asPointerEventListener(
			createSquare(
				1,
				1,
				0x1c1c1c,
				this.#camera,
				new THREE.ShaderMaterial({
					uniforms: {
						tileColor: { value: new THREE.Color(0x888888) },
						lineColor: { value: new THREE.Color(0x777777) }
					},

					vertexShader: `
    				varying vec3 vWorldPosition;
						
						void main() {
							vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      				vWorldPosition = worldPosition.xyz;
							gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
						}
					`,

					fragmentShader: `
						uniform vec3 tileColor;
						uniform vec3 lineColor;
						varying vec3 vWorldPosition;
						
						void main() {
							vec2 band1 = (mod(vWorldPosition.xy, 100.0) / 100.0);
							vec2 band2 = (mod(vWorldPosition.xy + 10.0, 1000.0) / 1000.0);
							vec2 edgeMask1 = step(0.1, band1);
							vec2 edgeMask2 = step(0.02, band2);
							vec2 edgeMask = min(edgeMask1, edgeMask2);
							float tileMask = clamp((edgeMask.x + edgeMask.y) - 1.0, 0.0, 1.0);
							vec3 color = (tileMask * tileColor) + (1.0 - tileMask) * lineColor;

							gl_FragColor = vec4(color, 1.0);
						}
					`
				})
			),
			{
				onDrag: this.#onDrag.bind(this),
				onZoom: this.#onZoom.bind(this)
			}
		).translateZ(-1500);
		this.#movementPlane.scale.set(this.#canvas.clientWidth, this.#canvas.clientHeight, 1);

		window.addEventListener('auxclick', (ev) => {
			ev.preventDefault();
			this.#resetZoom();
			// TODO: change to key R or something
		});
		this.zoom(0);
	}

	tick(): void {
		this._engine.debug.addDebugMessage(
			`camera: ${this.#camera.left} ${this.#camera.right} ${this.#camera.top} ${this.#camera.bottom}`
		);
	}

	reapplySize() {
		this.zoom(0);
	}

	#onDrag(x: number, y: number) {
		this.move(-x, -y);
	}

	#onZoom(delta: number) {
		this.zoom(-delta * 0.001);
	}

	get currentZoom() {
		return this.#zoomScale;
	}

	get camera() {
		return this.#camera;
	}

	move(xPixels: number, yPixels: number) {
		// Assumes camera is by default setup to be 1:1 with canvas and that canvas is 1:1 with DOM size
		this.#camera.position.x += xPixels / this.#zoomScale;
		this.#camera.position.y += yPixels / this.#zoomScale;
	}

	zoom(delta: number) {
		this.#zoomScale = clamp(this.#zoomScale * (1 + delta), this.#minZoom, this.#maxZoom);
		this.#camera.left = this.#canvas.clientWidth / -2 / this.#zoomScale;
		this.#camera.right = this.#canvas.clientWidth / 2 / this.#zoomScale;
		this.#camera.top = this.#canvas.clientHeight / 2 / this.#zoomScale;
		this.#camera.bottom = this.#canvas.clientHeight / -2 / this.#zoomScale;
		this.#camera.updateProjectionMatrix();

		this.#movementPlane.scale.set(
			this.#camera.right - this.#camera.left,
			this.#camera.bottom - this.#camera.top,
			1
		);
	}

	#resetZoom() {
		this.#zoomScale = 1.0;
		this.zoom(0);
	}
}
