import chalk from "chalk"
import readline from "readline-sync"

function gini(population) {
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

function calculate(population) {
	console.log(gini(population))
}

function parseArgs(ar) {
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

function cliArgs() {
	return parseArgs(process.argv.splice(2))
}

function main() {
	console.log(chalk.green("Gini Coefficient Calculator"))
	console.log(
		"Usage: Enter either a list of numbers or value:count (you can mix both in a single calculation)"
	)
	const rawArgs = readline.question("Enter your list: ")
	const processedArgs = parseArgs(rawArgs.split(",").map((e) => e.trim()))
	const result = gini(processedArgs)

	console.log(chalk.green("The Gini coefficient of this list is:"))
	console.log(chalk.bold.green(result))
}

main()
