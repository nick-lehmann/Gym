import { exec } from 'child_process'
import { BaseRunner } from './base.js'

export class RustRunner extends BaseRunner {}

export async function runRustTest(): Promise<string> {
  const cmd =
    'cat input.txt | cargo test aoc2020::day01::test_2022_1_part1_example -- --nocapture'

  return new Promise((resolve, reject) => {
    exec(
      cmd,
      {
        cwd: '/Users/nick/Projekte/Advent Of Code/rust',
      },
      (err, stdout, stderr) => {
        if (err) reject(err)

        const value = extractTestResult(stdout)

        if (value) resolve(value)
        else reject('Unable to extract test result')
      }
    )
  })
}

function extractTestResult(output: string): string | undefined {
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
