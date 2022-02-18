export function gini(population) {
	population.sort((a, b) => a - b)

	let groupedPopulation = []
	for (let person of population) {
		const i = groupedPopulation.findIndex((e) => e.wealth === person)
		if (i > -1) {
			groupedPopulation[i].count = groupedPopulation[i].count + 1
		} else {
			groupedPopulation.push({
				count: 1,
				wealth: parseFloat(person),
			})
		}
	}

	groupedPopulation.reverse()

	const totalIncome = population.reduce((p, c) => p + c, 0)
	const totalPopulation = population.length

	let parsedPopulation = []
	let parsedWealths = []
	for (let person of groupedPopulation) {
		parsedWealths.push(person.wealth)
		const richer = groupedPopulation
			.map((a) => (parsedWealths.indexOf(a.wealth) > -1 ? a : null))
			.filter((a) => a !== null)
			.map((e) => e.count)
			.reduce((p, c) => p + c, 0)
		parsedPopulation.push({
			fractionOfIncome: (person.count * person.wealth) / totalIncome,
			fractionOfPopulation: person.count / totalPopulation,
			fractionOfRicher: 1 - richer / totalPopulation,
		})
	}

	let scores = []
	for (let person of parsedPopulation) {
		const score =
			person.fractionOfIncome *
			(person.fractionOfPopulation + 2 * person.fractionOfRicher)
		scores.push(score)
	}

	const giniScore = Math.abs(1 - scores.reduce((p, c) => p + c, 0)).toFixed(3)

	return giniScore
}

export function parseArgs(ar) {
	let args = []
	for (let a of ar) {
		if (a.split(":").length > 1) {
			for (let i = 0; i < a.split(":")[1]; i++) {
				args.push(parseFloat(a.split(":")[0]))
			}
		} else {
			args.push(parseFloat(a))
		}
	}
	return args
}
