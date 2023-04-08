import { TextDecoder } from 'util'
// import * as vscode from 'vscode'
import { z } from 'zod'
import { Problem } from '../../models/problem'
import { AOCProblemIdentifier } from './identifier'

const AOCTestcase = z.object({
  input: z.string(),
  solution: z.number(),
})
const AOCPart = z.array(AOCTestcase)
const DataFile = z.object({
  tests: z.object({
    part1: AOCPart,
    part2: AOCPart,
  }),
})
export type DataFile = z.infer<typeof DataFile>

export function getDataFile(problem: Problem): string {
  const identifier = problem.identifier as AOCProblemIdentifier
  const paddedDay = identifier.day.toString().padStart(2, '0')

  // const path = `./data/aoc${identifier.year}/${paddedDay}.yaml`
  const path = '/Users/nick/Projekte/Advent Of Code/exercises/2020/01.yaml'
  return path
}

export async function getAocTestdataForProblem(
  problem: Problem
): Promise<DataFile> {
  const dataUri = getDataFile(problem)
  // const raw = await vscode.workspace.fs.readFile(dataUri)

  const decoder = new TextDecoder()
  // const text = decoder.decode(raw)

  // const content = yaml.parse(text)
  // return DataFile.parse(content)
  throw new Error('not implemented')
}
