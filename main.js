import { hyperIter } from "./tools.js";

// Function to generate random RGB color values
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

// Function to draw a point on the canvas
function drawPoint(context, point, color) {
	context.fillStyle = 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')'
	context.fillRect(...point, 1, 1)
}

const mod = (a, b) => (a % b + b) % b

// Function to initialize the Chaos Game
function initializeChaosGame(canvas, numPoints) {
	var context = canvas.getContext('2d')
	var canvasSize = [canvas.width, canvas.height]

	// Clear the canvas
	context.clearRect(0, 0, ...canvasSize);

	// Generate target points forming a circle
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

	// Pick a random starting point
	var currentPoint = {
		position: canvasSize.map (x => x * Math.random()),
		color: getRandomColor ()
	}

	const history = []

	const linearDiff = (points, offset = 0) =>
		mod (points [1 + offset] - points [0], numPoints)

	const quadraticDiff = (points, offset = 0) =>
		mod (
			mod (points [2 + offset] - points [1 + offset], numPoints) -
			mod (points [1] - points [0], numPoints),
			numPoints
		)

	// Iterate and draw the chaos game
	for (var i = 0; i < 2**20; i++) {
		// Pick a random target point
		var targetIndex = Math.floor(Math.random() * numPoints)
		var targetPoint = targetPoints[targetIndex]

		if (
			[].includes (linearDiff ([targetIndex, ...history])) ||
			[].includes (quadraticDiff ([targetIndex, ...history]))
		) continue

		history.unshift (targetIndex);
		(history.length >= 16) && history.pop()

		// Calculate the midpoint between the current point and the target point
		currentPoint = {
			position: vecLerp (currentPoint.position, targetPoint.position),
			color: vecLerp (currentPoint.color, targetPoint.color)
		};

		// Draw the midpoint
		drawPoint(context, currentPoint.position, currentPoint.color)
	}
}

// Get the canvas element
var canvas = document.getElementById('canvas');

// Initialize the Chaos Game with 5 target points forming a circle
initializeChaosGame(canvas, 6);
