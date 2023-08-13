export const hyperIter = (size = [], fun = x => x) => {
	if (!(size.length) || Math.min (...size) < 1) return []

	const count = (new Array(size.length)).fill(0)
	const result = []
	let carry = 0
	while (!carry) {
		result.push (fun ([...count]))

		carry ++
		size.forEach ((target, idx) => {
			if (carry)
				if (count[idx] == target -1) count[idx] = 0
				else {count[idx] ++; carry -- }
		})
	}

	return result
}