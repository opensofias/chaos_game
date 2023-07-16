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

// Function to draw a point on the canvas
function drawPoint(context, point, color) {
	context.fillStyle = color;
	context.fillRect(point.x, point.y, 1, 1);
}

// Function to initialize the Chaos Game
function initializeChaosGame(canvas, numPoints) {
	var context = canvas.getContext('2d');
	var canvasWidth = canvas.width;
	var canvasHeight = canvas.height;

	// Clear the canvas
	context.clearRect(0, 0, canvasWidth, canvasHeight);

	// Generate target points forming a circle
	var targetPoints = [];
	var centerX = canvasWidth / 2;
	var centerY = canvasHeight / 2;
	var radius = Math.min(canvasWidth, canvasHeight) / 2 - 10;
	var angleIncrement = (2 * Math.PI) / numPoints;

	for (var i = 0; i < numPoints; i++) {
		var angle = i * angleIncrement;
		var x = centerX + radius * Math.cos(angle);
		var y = centerY + radius * Math.sin(angle);
		targetPoints.push({ x: x, y: y });
	}

	// Pick a random starting point
	var currentPoint = {
		x: Math.floor(Math.random() * canvasWidth),
		y: Math.floor(Math.random() * canvasHeight)
	};

	// Iterate and draw the chaos game
	for (var i = 0; i < 100000; i++) {
		// Pick a random target point
		var targetIndex = Math.floor(Math.random() * numPoints);
		var targetPoint = targetPoints[targetIndex];

		// Calculate the midpoint between the current point and the target point
		currentPoint = calculateMidpoint(currentPoint, targetPoint);

		// Draw the midpoint
		drawPoint(context, currentPoint, getRandomColor());
	}
}

// Get the canvas element
var canvas = document.getElementById('canvas');

// Initialize the Chaos Game with 5 target points forming a circle
initializeChaosGame(canvas, 5);
