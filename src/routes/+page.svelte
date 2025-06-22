<script lang="ts">
	import { NodeEditorEngine } from '$lib/nodeEditor/engine/Engine';
	import { SimpleTickObject } from '$lib/nodeEditor/engine/SimpleTickObject';
	import { Node } from '$lib/nodeEditor/nodes/Node';
	import { onMount } from 'svelte';

	let canvas: HTMLCanvasElement;

	/* 	let fps = $state(0);
	let isPanning = $state(false); */
	let fps = $state(0);
	let debugInfos: string[] = $state([]);
	let engine: NodeEditorEngine | null = $state(null);

	onMount(() => {
		engine = new NodeEditorEngine(canvas);
		engine.framerateLimit = 75;
		engine.start();
		engine.debug.onMessagesChanged.add((newInfos) => (debugInfos = newInfos));

		const node2 = new Node({
			name: 'Branch',
			inputs: [
				{ name: 'In', isFlow: true },
				{ name: 'Condition', typeName: 'boolean' }
			],
			outputs: [
				{ name: 'True', isFlow: true },
				{ name: 'False', isFlow: true }
			]
		});

		node2._rootScene.translateX(200).translateY(200);

		engine.addObject(
			new Node({
				name: 'LiteLLM Chat',
				inputs: [
					{ name: 'Run', isFlow: true },
					{ name: 'Model', typeName: 'string' },
					{ name: 'Temperature', typeName: 'float' },
					{ name: 'Messages', typeName: 'Message[]' },
					{ name: 'API key', typeName: 'string' },
					{ name: 'Max tokens', typeName: 'integer' },
					{ name: 'Stream', typeName: 'boolean' }
				],
				outputs: [
					{ name: 'Done', isFlow: true },
					{ name: 'Output', typeName: 'string' },
					{ name: 'Thinking tokens', typeName: 'integer' },
					{ name: 'Stream delta', isFlow: true }
				]
			})
		);

		engine.addObject(node2);

		engine.addObject(
			new SimpleTickObject(() => {
				fps = engine!.fps;
			})
		);

		/* 		engine.AddObject(
			new Node({
				name: 'LiteLLM Chat',
				inputs: [
					{ name: 'Run', isFlow: true },
					{ name: 'Model', typeName: 'string' },
					{ name: 'Temperature', typeName: 'float' },
					{ name: 'Messages', typeName: 'Message[]' },
					{ name: 'API key', typeName: 'string' },
					{ name: 'Max tokens', typeName: 'integer' },
					{ name: 'Stream', typeName: 'boolean' }
				],
				outputs: [
					{ name: 'Done', isFlow: true },
					{ name: 'Output', typeName: 'string' },
					{ name: 'Thinking tokens', typeName: 'integer' },
					{ name: 'Stream delta', isFlow: true }
				]
			})
		); */

		/* 		canvas.addEventListener('mousedown', () => (isPanning = true));
		canvas.addEventListener('mouseup', () => (isPanning = false));
		canvas.addEventListener('mouseleave', () => (isPanning = false));

		canvas.addEventListener('mousemove', (ev) => {
			if (isPanning) {
				engine.mainCamera?.MoveByPixels(-ev.movementX, ev.movementY);
			}
		});

		canvas.addEventListener('wheel', (ev) => {
			const zoomAmount = 0.1;
			const delta = ev.deltaY < 0 ? zoomAmount : ev.deltaY > 0 ? -zoomAmount : 0;
			engine.mainCamera?.Zoom(delta);
		}); */
	});
</script>

<div class="h-dvh w-dvw bg-amber-400 p-4">
	<canvas class="block h-full w-full bg-red-600 focus:outline-0" tabindex="0" bind:this={canvas}>
		Javascript/WebGL must be enabled
	</canvas>
	<div class="absolute top-5 left-6 flex flex-col font-mono text-white">
		<span>FPS: {Math.round(fps)}</span>
		{#each debugInfos as debug}
			<span>{debug}</span>
		{/each}
	</div>
</div>
