import { hyperIter } from "./tools.js";

const getRandomColor = () => [
	Math.floor(Math.random() * 256),
	Math.floor(Math.random() * 256),
	Math.floor(Math.random() * 256),
]

const vecLerp = (v1, v2, factor = .5) =>
	v1.map ((_, idx) => 
		v1 [idx] * (1 - factor) +
		v2 [idx] * factor
	)

function drawPoint(imageData, point, color) {
	const idx = ((0|point[1]) * imageData.width + (0|point[0])) * 4;
	imageData.data[idx] = color[0];
	imageData.data[idx + 1] = color[1];
	imageData.data[idx + 2] = color[2];
	imageData.data[idx + 3] = 255;
}

const mod = (a, b) => (a % b + b) % b

const recurDiff = depth => (history, offset = 1, first = 0) =>
	depth == 0 ? history [first] :
		recurDiff (depth - 1) (history, 1, first + offset) -
		recurDiff (depth - 1) (history, 1, first)

function initializeChaosGame(canvas, numPoints) {
	var context = canvas.getContext('2d')
	var canvasSize = [canvas.width, canvas.height]
	const imageData = new ImageData(canvas.width, canvas.height);

	context.clearRect(0, 0, ...canvasSize);

	var targetPoints = []
	var center = canvasSize.map (x => x / 2)
	var radius = Math.min(...canvasSize) / 2
	var angleIncrement = (2 * Math.PI) / numPoints
	const thirdAngle = Math.PI * 2 / 3
	const rotationFactor = 2

	for (var i = 0; i < numPoints; i++) {
		var angle = i * angleIncrement;
		targetPoints.push({
			position: [
				center[0] + radius * Math.cos(angle),
				center[1] + radius * Math.sin(angle)
			],
			color: [
				128 + Math.cos (rotationFactor * (angle - thirdAngle)) * 128,
				128 + Math.cos (rotationFactor * angle) * 128,
				128 + Math.cos (rotationFactor * (angle + thirdAngle)) * 128
			]
		});
	}

	var currentPoint = {
		position: canvasSize.map (x => x * Math.random()),
		color: getRandomColor ()
	}

	const history = []

	const [linearDiff, quadraticDiff] = [1, 2].map (depth => (history, offset) =>
		mod (recurDiff (depth) (history, offset), numPoints)
	)

	for (var i = 0; i < 2**20; i++) {
		var targetIndex = Math.floor(Math.random() * numPoints)
		var targetPoint = targetPoints[targetIndex]
		history.unshift (targetIndex);

		if (
			[].includes (linearDiff (history)) ||
			[].includes (quadraticDiff (history))
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

var canvas = document.getElementById('canvas');

initializeChaosGame(canvas, 5);
