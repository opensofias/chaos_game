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

const recurOp = (op, base) => (history, depth = 1, offset = 1, first = 0) =>
	depth == 0 ? history [first] :
	mod (op (
		recurOp (op, base) (history, depth - 1, 1, first + offset),
		recurOp (op, base) (history, depth - 1, 1, first)
	), base)

const TAU = Math.PI * 2

const makeTargetPoints = ({
		canvasSize, numPoints,
		rotationFactor = 2,
		renderSize = 1
	}) => {
	const radius = Math.min(...canvasSize) / 2 * renderSize

	return hyperIter (
		[numPoints], ([idx]) => idx * TAU / numPoints
	).map (angle => ({
		position: canvasSize.map ((size, dim) =>
			size / 2 + radius * Math [['cos', 'sin'] [dim]] (angle)
		),
		color: [-TAU / 3, 0, TAU / 3].map (channelOffset =>
			128 + Math.cos (rotationFactor * (angle + channelOffset)) * 128
		)
	}))
}

const initializeChaosGame = (canvas, numPoints) => {
	const context = canvas.getContext('2d')
	const canvasSize = [canvas.width, canvas.height]
	const imageData = new ImageData(...canvasSize);

	context.clearRect(0, 0, ...canvasSize);

	const targetPoints = makeTargetPoints ({canvasSize, numPoints})

	let currentPoint = {
		position: canvasSize.map (x => x * Math.random()),
		color: [128, 128, 128]
	}

	const history = []

	const [Σ, Δ, Π] = [
		(x, y) => x + y,
		(x, y) => x - y,
		(x, y) => x * y
	].map (fun => (recurOp (fun, numPoints)))

	for (let i = 0; i < 2**20; i++) {
		const targetIndex = Math.floor(Math.random() * numPoints)
		const targetPoint = targetPoints[targetIndex]
		history.unshift (targetIndex);

		if (
			[].includes (Δ (history)) ||
			[].includes (Σ (history)) ||
			[].includes (Π (history))
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
