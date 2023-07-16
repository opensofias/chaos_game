// Function to generate random RGB color values
function getRandomColor() {
	var r = Math.floor(Math.random() * 256);
	var g = Math.floor(Math.random() * 256);
	var b = Math.floor(Math.random() * 256);
	return 'rgb(' + r + ',' + g + ',' + b + ')';
}

// Function to calculate the midpoint between two points
function calculateMidpoint(p1, p2) {
	var x = (p1.x + p2.x) / 2;
	var y = (p1.y + p2.y) / 2;
	return { x: x, y: y };
}

const vecLerp = (v1, v2, factor = .5) =>
	v1.map ((_, idx) => 
		v1 [idx] * (1 - factor) +
		v2 [idx] * factor
	)

// Function to draw a point on the canvas
function drawPoint(context, point, color) {
	context.fillStyle = color;
	context.fillRect(...point, 1, 1);
}

// Function to initialize the Chaos Game
function initializeChaosGame(canvas, numPoints) {
	var context = canvas.getContext('2d');
	var canvasSize = [canvas.width, canvas.height];

	// Clear the canvas
	context.clearRect(0, 0, ...canvasSize);

	// Generate target points forming a circle
	var targetPoints = [];
	var center = canvasSize.map (x => x / 2);
	var radius = Math.min(...canvasSize) / 2;
	var angleIncrement = (2 * Math.PI) / numPoints;

	for (var i = 0; i < numPoints; i++) {
		var angle = i * angleIncrement;
		var x = center[0] + radius * Math.cos(angle);
		var y = center[1] + radius * Math.sin(angle);
		targetPoints.push([x, y]);
	}

	// Pick a random starting point
	var currentPoint = canvasSize.map (x => x * Math.random())

	// Iterate and draw the chaos game
	for (var i = 0; i < 100000; i++) {
		// Pick a random target point
		var targetIndex = Math.floor(Math.random() * numPoints);
		var targetPoint = targetPoints[targetIndex];

		// Calculate the midpoint between the current point and the target point
		currentPoint = vecLerp(currentPoint, targetPoint);

		// Draw the midpoint
		drawPoint(context, currentPoint, getRandomColor());
	}
}

// Get the canvas element
var canvas = document.getElementById('canvas');

// Initialize the Chaos Game with 5 target points forming a circle
initializeChaosGame(canvas, 5);
