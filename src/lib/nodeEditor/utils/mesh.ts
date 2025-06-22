import * as THREE from 'three';

export function createSquare(
	width: number,
	height: number,
	color: number,
	parent?: THREE.Object3D,
	material?: THREE.Material
): THREE.Mesh {
	const newMesh = new THREE.Mesh(
		new THREE.PlaneGeometry(width, height),
		material ?? new THREE.MeshBasicMaterial({ color })
	);

	if (parent) {
		parent.add(newMesh);
	}

	return newMesh;
}

export function createCircle(radius: number, color: number, parent?: THREE.Object3D): THREE.Mesh {
	const newMesh = new THREE.Mesh(
		new THREE.CircleGeometry(radius),
		new THREE.MeshBasicMaterial({ color })
	);

	if (parent) {
		parent.add(newMesh);
	}

	return newMesh;
}

export function getWidth(mesh: THREE.Mesh): number {
	const size = new THREE.Vector3();
	mesh.geometry.computeBoundingBox();
	mesh.geometry.boundingBox?.getSize(size);
	return size.x;
}

export function getHeight(mesh: THREE.Mesh): number {
	const size = new THREE.Vector3();
	mesh.geometry.computeBoundingBox();
	mesh.geometry.boundingBox?.getSize(size);
	return size.y;
}

export function positionTL(mesh: THREE.Mesh, xPos: number, yPos: number) {
	const parentSize = new THREE.Vector3();
	const parentGeom = (mesh.parent as THREE.Mesh).geometry;
	if (parentGeom) {
		parentGeom.computeBoundingBox();
		parentGeom.boundingBox?.getSize(parentSize);
	}

	mesh.position.x = -(parentSize.x / 2) + xPos + getWidth(mesh) / 2;
	mesh.position.y = parentSize.y / 2 - yPos - getHeight(mesh) / 2;
}

export function positionTR(mesh: THREE.Mesh, xPos: number, yPos: number) {
	const parentSize = new THREE.Vector3();
	const parentGeom = (mesh.parent as THREE.Mesh).geometry;
	if (parentGeom) {
		parentGeom.computeBoundingBox();
		parentGeom.boundingBox?.getSize(parentSize);
	}

	mesh.position.x = parentSize.x / 2 + xPos - getWidth(mesh) / 2;
	mesh.position.y = parentSize.y / 2 - yPos - getHeight(mesh) / 2;
}

export function positionT(mesh: THREE.Mesh, xPos: number, yPos: number) {
	const parentSize = new THREE.Vector3();
	const parentGeom = (mesh.parent as THREE.Mesh).geometry;
	if (parentGeom) {
		parentGeom.computeBoundingBox();
		parentGeom.boundingBox?.getSize(parentSize);
	}

	mesh.position.x = xPos;
	mesh.position.y = parentSize.y / 2 - yPos - getHeight(mesh) / 2;
}

export function positionBL(mesh: THREE.Mesh, xPos: number, yPos: number) {
	const parentSize = new THREE.Vector3();
	const parentGeom = (mesh.parent as THREE.Mesh).geometry;
	if (parentGeom) {
		parentGeom.computeBoundingBox();
		parentGeom.boundingBox?.getSize(parentSize);
	}

	mesh.position.x = -(parentSize.x / 2) + xPos + getWidth(mesh) / 2;
	mesh.position.y = -parentSize.y / 2 - yPos - getHeight(mesh) / 2;
}
