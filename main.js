import { hyperIter } from "./tools.js";

const vecLerp = (v1, v2, factor = .5) =>
	v1.map ((_, idx) => 
		v1 [idx] * (1 - factor) +
		v2 [idx] * factor
	)

const drawPoint = (imageData, point, color) => {
	const pixelIdx = ((0|point[1]) * imageData.width + (0|point[0])) * 4;
	[...color, 255].forEach ((val, idx) =>
		imageData.data[pixelIdx + idx] = val
	)
}

const mod = (a, b) => (a % b + b) % b

const recurOp = op => depth => (history, offset = 1, first = 0) =>
	depth == 0 ? history [first] : op (
		recurOp (op) (depth - 1) (history, 1, first + offset),
		recurOp (op) (depth - 1) (history, 1, first)
	)

const initializeChaosGame = (canvas, numPoints) => {
	const context = canvas.getContext('2d')
	const canvasSize = [canvas.width, canvas.height]
	const imageData = new ImageData(...canvasSize);

	context.clearRect(0, 0, ...canvasSize);

	const targetPoints = []
	const center = canvasSize.map (x => x / 2)
	const radius = Math.min(...canvasSize) / 2
	const angleIncrement = (2 * Math.PI) / numPoints
	const thirdAngle = Math.PI * 2 / 3
	const rotationFactor = 2

	for (let i = 0; i < numPoints; i++) {
		let angle = i * angleIncrement;
		targetPoints.push({
			position: [
				center[0] + radius * Math.cos(angle),
				center[1] + radius * Math.sin(angle)
			],
			color: [-thirdAngle, 0, thirdAngle].map (channelOffset =>
				128 + Math.cos (rotationFactor * (angle + channelOffset)) * 128
			)
		});
	}

	let currentPoint = {
		position: canvasSize.map (x => x * Math.random()),
		color: [128, 128, 128]
	}

	const history = []

	const [Δ, ΔΔ, ΔΔΔ, ΔΔΔΔ] = [1, 2, 3, 4].map (depth => (history, offset) =>
		mod (recurDiff (depth) (history, offset), numPoints)
	)

	const [Σ, ΣΣ, ΣΣΣ, ΣΣΣΣ] = [1, 2, 3, 4].map (depth => (history, offset) =>
		mod (recurSum (depth) (history, offset), numPoints)
	)

	for (let i = 0; i < 2**20; i++) {
		const targetIndex = Math.floor(Math.random() * numPoints)
		const targetPoint = targetPoints[targetIndex]
		history.unshift (targetIndex);

		if (
			[].includes (Δ (history)) ||
			[].includes (Σ (history)) ||
			[].includes (ΔΔ (history))
		) {
			history.shift ();
			continue
		}

		(history.length >= 16) && history.pop()

		currentPoint = {
			position: vecLerp (currentPoint.position, targetPoint.position),
			color: vecLerp (currentPoint.color, targetPoint.color)
		};

		drawPoint(imageData, currentPoint.position, currentPoint.color)
	}

	context.putImageData(imageData, 0, 0);
}

const canvas = document.getElementById('canvas');

initializeChaosGame(canvas, 5);
