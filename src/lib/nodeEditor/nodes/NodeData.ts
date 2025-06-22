export interface NodeFlowPin {
	name: string;
	isFlow: true;
}

export interface NodeDataPin {
	name: string;
	typeName: string;
	isFlow?: false;
}

export type NodePin = NodeFlowPin | NodeDataPin;

export interface NodeData {
	name: string;
	inputs: NodePin[];
	outputs: NodePin[];
}
