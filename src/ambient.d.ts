/** from https://github.com/protectwise/troika/issues/214 */
declare module 'troika-three-text' {
	import type { Color, Material, MeshBasicMaterial, MeshStandardMaterial } from 'three';
	import { Mesh } from 'three';

	export class Text extends Mesh {
		constructor();

		text: string;
		fontSize: number;
		font: string;
		color: string | number | Material;
		maxWidth: number;
		lineHeight: number;
		letterSpacing: number;
		textAlign: 'left' | 'right' | 'center' | 'justify';
		material: MeshBasicMaterial | MeshStandardMaterial;
		anchorX: 'left' | 'center' | 'right' | number;
		anchorY: 'top' | 'middle' | 'bottom' | 'baseline' | number;
		clipRect: [number, number, number, number];
		depthOffset: number;
		direction: 'auto' | 'ltr' | 'rtl';
		overflowWrap: 'normal' | 'break-word';
		whiteSpace: 'normal' | 'nowrap';
		outlineWidth: number;
		outlineOffsetX: number;
		outlineOffsetY: number;
		outlineColor: string | number;
		outlineOpacity: number;
		strokeWidth: number;
		strokeColor: string | number | Color;
		strokeOpacity: number;
		curveRadius: number;
		fillOpacity: number;
		fontStyle: 'normal' | 'italic';
		fontWeight: 'normal' | 'bold';
		glyphGeometryDetail: number;
		gpuAccelerateSDF: boolean;
		outlineBlur: number;
		sdfGlyphSize: number;
		textIndent: number;
		unicodeFontsUrl: string;
		sync: (callback?: () => void) => void;
		dispose(): void;
	}
}
