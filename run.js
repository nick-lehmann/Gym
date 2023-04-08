import process from 'child_process'
// const { exec } = require('child_process')

async function runTest() {
  const cmd =
    'cat input.txt | cargo test aoc2020::day01::test_2022_1_part1_example -- --nocapture'

  return new Promise((resolve, reject) => {
    process.exec(
      cmd,
      {
        cwd: '/Users/nick/Projekte/Advent Of Code/rust',
      },
      (err, stdout, stderr) => {
        if (err) reject(err)
        resolve(stdout)
      }
    )
  })
}

function extractTestResult(output): string {
  const lines = output.split('\n')
  const solution = []
  let isSolution = false

  const START = 'Start solution'
  const END = 'End solution'

  for (const line of lines) {
    if (line === START) {
      isSolution = true
      continue
    }

    if (line === END) return solution[0]

    if (isSolution) {
      solution.push(line)
    }
  }

  return
}

const output = await runTest()
console.log('Done')
console.log(output)

let solution = extractTestResult(output)

if (solution.length === 1) {
  solution = solution[0]
}

console.log(solution)
