import * as THREE from 'three';
import type { NodeEditorEngine } from './Engine';

export interface IEngineObject {
	getRootObject(): THREE.Object3D;
	onStart(engine: NodeEditorEngine): void;
	onEnd(): void;
	isPendingDestroy(): boolean;
}

export class EngineObject implements IEngineObject {
	_engine!: NodeEditorEngine;
	_rootScene: THREE.Scene;
	_isPendingDestroy: boolean;

	constructor() {
		this._rootScene = new THREE.Scene();
		this._isPendingDestroy = false;
	}

	getRootObject(): THREE.Object3D {
		return this._rootScene;
	}

	onStart(engine: NodeEditorEngine) {
		this._engine = engine;
		this._rootScene.name = this.constructor.name;
	}

	onEnd() {}

	isPendingDestroy() {
		return this._isPendingDestroy;
	}

	destroy() {
		this._isPendingDestroy = true;
	}
}
