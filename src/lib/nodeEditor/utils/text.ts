import { Text } from 'troika-three-text';
import * as THREE from 'three';

export function createText(text: string, parent?: THREE.Object3D): Text {
	const textObject = new Text();
	textObject.text = text;
	textObject.fontSize = 12;
	textObject.color = 0xffffff;
	textObject.outlineColor = 0x000000;
	textObject.outlineOffsetX = 1;
	textObject.outlineOffsetY = 1;
	textObject.anchorY = 'middle';
	textObject.anchorX = 'center';

	if (parent) {
		parent.add(textObject);
	}

	return textObject;
}

export function waitForTextSyncs(texts: Text[], onDone: () => void) {
	let counter = texts.length;

	const decrementCounter = () => {
		--counter;
		if (counter <= 0) {
			onDone();
		}
	};

	texts.forEach((text) => text.sync(decrementCounter));
}
