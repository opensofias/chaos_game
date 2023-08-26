import { hyperIter } from "./tools.js";
import { defaultCfg } from "./default.js";

const vecLerp = (v1, v2, factor = .5) =>
	v1.map ((_, idx) => 
		v1 [idx] * (1 - factor) +
		v2 [idx] * factor
	)

const drawPoint = (imageData, {position, color}) => {
	const pixelIdx = ((0|position[1]) * imageData.width + (0|position[0])) * 4;
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

const makeTargets = ({
		canvasSize, targetsAmount,
		rotationFactor = 2,
		renderSize = 1
	}) => {
	const radius = Math.min(...canvasSize) / 2 * renderSize

	return hyperIter (
		[targetsAmount], ([idx]) => idx * TAU / targetsAmount
	).map (angle => ({
		position: canvasSize.map ((size, dim) =>
			size / 2 + radius * Math [['cos', 'sin'] [dim]] (angle)
		),
		color: [-TAU / 3, 0, TAU / 3].map (channelOffset =>
			128 + Math.cos (rotationFactor * (angle + channelOffset)) * 128
		)
	}))
}

const makeCanvas = (width, height) => {
	const result = document.createElement ('canvas')
	result.setAttribute ('width', width)
	result.setAttribute ('height', height)
	document.body.appendChild (result)
	return result
}

const setupChaosGame = (config) => ({
	context: makeCanvas (...config.canvasSize).getContext('2d'),
	targets: makeTargets ({...config}),
	history: [],
	currentPoint: {
		position: config.canvasSize.map (x => x * Math.random()),
		color: [128, 128, 128]
	},
	config
})

const renderChaosGame = ({context, targets, config, history, currentPoint}) => {
	const {targetsAmount, lerpFactor, canvasSize, iterations} = config
	const imageData = new ImageData(...canvasSize);

	const [Σ, Δ, Π] = [
		(x, y) => x + y,
		(x, y) => x - y,
		(x, y) => x * y
	].map (fun => (recurOp (fun, targetsAmount)))

	for (let i = 0; i < iterations; i++) {
		const choice = Math.floor(Math.random() * targetsAmount)
		history.unshift (choice);

		if (
			[].includes (Δ (history)) ||
			[].includes (Σ (history)) ||
			[].includes (Π (history))
		) {
			history.shift ();
			continue
		}

		(history.length >= 16) && history.pop()

		currentPoint = Object.entries (currentPoint).reduce (
			(current, [prop, previous]) => ({...current,
				[prop]: vecLerp (previous, targets [choice] [prop], lerpFactor [prop])
			}), {}
		)
		
		drawPoint(imageData, currentPoint)
	}

	context.putImageData(imageData, 0, 0);

	return {context, targets, config, history, currentPoint}
}

renderChaosGame (setupChaosGame ({...defaultCfg}));
