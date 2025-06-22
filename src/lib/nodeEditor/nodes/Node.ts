import { EngineObject, type IEngineObject } from '../engine/EngineObject';

import type { NodeData, NodePin } from './NodeData';
import { createText, waitForTextSyncs } from '../utils/text';
import {
	createCircle,
	createSquare,
	getHeight,
	getWidth,
	positionT,
	positionTL,
	positionTR
} from '../utils/mesh';
import { filterValid } from '../utils/array';
import type { Text } from 'troika-three-text';
import type { NodeEditorEngine } from '../engine/Engine';
import { asPointerEventListener } from '../engine/pointerInput/PointerEventListener';
import * as THREE from 'three';

export class Node extends EngineObject implements IEngineObject {
	#nodeData: NodeData;
	#line!: THREE.Line;
	#activePin: THREE.Mesh | null = null;

	constructor(nodeData: NodeData) {
		super();
		this.#nodeData = nodeData;
		this._rootScene.position.z = 0;
	}

	onStart(engine: NodeEditorEngine): void {
		super.onStart(engine);

		this.#line = new THREE.Line(
			new THREE.BufferGeometry().setFromPoints([
				new THREE.Vector3(0, 0, 0),
				new THREE.Vector3(0, 0, 0)
			]),
			new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 3 })
		).translateZ(10);
		this._rootScene.add(this.#line);

		const titleText = createText(this.#nodeData.name);

		const inputTuples: [NodePin, Text][] = this.#nodeData.inputs.map((input) => [
			input,
			createText(input.name)
		]);
		const outputTuples: [NodePin, Text][] = this.#nodeData.outputs.map((output) => [
			output,
			createText(output.name)
		]);

		const allTexts = [
			titleText,
			...inputTuples.map((v) => v[1]),
			...outputTuples.map((v) => v[1])
		].filter(filterValid);

		waitForTextSyncs(allTexts, () => {
			const TITLE_PADDING_Y = 5;
			const PIN_MARGIN = 10;
			const IO_GAP = 30;
			const IO_PADDING_Y = 5;
			const IO_ROW_GAP = 5;

			const contentWidth = Math.max(
				getWidth(titleText),
				Math.max(...inputTuples.map((v) => getWidth(v[1]))) +
					Math.max(...outputTuples.map((v) => getWidth(v[1]))) +
					PIN_MARGIN * 2 +
					IO_GAP
			);

			const titleBackdrop = asPointerEventListener(
				createSquare(
					contentWidth,
					getHeight(titleText) + TITLE_PADDING_Y * 2,
					0x888888,
					this._rootScene
				),
				{
					onDrag: this.#onDrag.bind(this)
				}
			);
			titleBackdrop.add(titleText);
			positionT(titleText, 0, TITLE_PADDING_Y);

			const rowTextHeight = getHeight(outputTuples[0][1]);
			const rowCount = Math.max(inputTuples.length, outputTuples.length);
			const ioHeight = rowCount * (rowTextHeight + IO_ROW_GAP) + IO_PADDING_Y * 2;

			const ioBackdrop = asPointerEventListener(createSquare(contentWidth, ioHeight, 0x232323), {
				onDrag: this.#onDrag.bind(this)
			});
			this._rootScene.add(ioBackdrop);
			ioBackdrop.position.y = -getHeight(ioBackdrop) / 2 - getHeight(titleBackdrop) / 2;

			[...inputTuples, ...outputTuples].map((v) => v[1]).forEach((t) => ioBackdrop.add(t));

			inputTuples.forEach(([pinData, text], i) => {
				positionTL(text, PIN_MARGIN, i * rowTextHeight + i * IO_ROW_GAP + IO_PADDING_Y);

				positionTL(
					this.#makePin(pinData.isFlow === true, ioBackdrop),
					-PIN_MARGIN / 2,
					i * rowTextHeight + rowTextHeight / 2 - 5 + i * IO_ROW_GAP + IO_PADDING_Y
				);
			});

			outputTuples.forEach(([pinData, text], i) => {
				positionTR(text, -PIN_MARGIN, i * rowTextHeight + i * IO_ROW_GAP + IO_PADDING_Y);

				positionTR(
					this.#makePin(pinData.isFlow === true, ioBackdrop),
					PIN_MARGIN / 2,
					i * rowTextHeight + rowTextHeight / 2 - 5 + i * IO_ROW_GAP + IO_PADDING_Y
				);
			});
		});
	}

	#onDrag(x: number, y: number) {
		this._rootScene.position.x += x;
		this._rootScene.position.y += y;
	}

	#makePin(isFlow: boolean, parent: THREE.Object3D) {
		const mesh = isFlow
			? createSquare(10, 10, 0xffffff, parent)
			: createCircle(5, 0xffffff, parent);
		mesh.position.z = 5;

		return asPointerEventListener(mesh, {
			onHoverBegin: this.#setActivePin.bind(this, mesh),
			onHoverEnd: this.#setActivePin.bind(this, null),
			onDrag: this.#dragFromActivePin.bind(this)
		});
	}

	#dragFromActivePin() {
		const pinWs = new THREE.Vector3();
		this.#activePin!.getWorldPosition(pinWs);
		this.#line.geometry.setFromPoints([
			this.#line.worldToLocal(pinWs),
			this.#line.worldToLocal(this._engine.pointer.pointerWs)
		]);
	}

	#setActivePin(newActivePin: THREE.Mesh | null) {
		if (this.#activePin) {
			this.#activePin.scale.setScalar(1.0);
			this.#activePin = null;
		}

		if (newActivePin) {
			this.#activePin = newActivePin;
			this.#activePin.scale.setScalar(1.2);
		}
	}
}
