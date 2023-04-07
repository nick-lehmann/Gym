import { exec } from 'child_process'
import * as vscode from 'vscode'
import { CONTEXT } from '../extension.js'
import { Problem } from '../problem.js'
import { getAocTestdataForProblem } from '../providers/adventofcode/data.js'
import { AOCProblemIdentifier } from '../providers/adventofcode/identifier.js'
import { RunnerConfig } from './config.js'
import { SAMPLE_EXTRACTION_CONFIG, extractTestResult } from './extract.js'

// TODO: Make these constants configurable.
// const CMD_TEMPLATE = `cat input.txt | cargo test aoc{year}::day0{day}::test_{year}_{day}_{part}_{example} -- --nocapture`
const CWD = '/Users/nick/Projekte/Advent Of Code/rust' // TODO: Find exec directory from workspace.
const IDENTIFIER = new AOCProblemIdentifier(2020, 1, 'part1')

const SAMPLE_RUNNER_CONFIG: RunnerConfig = {
  directoy: 'rust',
  command:
    'cat {file} | cargo test aoc{year}::day0{day}::test_{year}_{day}_{part} -- --nocapture',
  input: {
    method: 'file',
  },
  output: {
    method: 'stdout',
    extraction: SAMPLE_EXTRACTION_CONFIG,
  },
}

export enum TestStatus {
  Passed = 'passed',
  Skipped = 'skipped',
  Failed = 'failed',
}

export type TestResult = {
  status: TestStatus
  duration: number
}

export async function run(
  problem: Problem,
  identifier = IDENTIFIER,
  config: RunnerConfig = SAMPLE_RUNNER_CONFIG
): Promise<TestResult> {
  const testCaseName = 'example'
  const data = await getAocTestdataForProblem(problem)

  const testcase = data.tests.part1[0]
  const expected = testcase.solution.toString()

  const fileName = 'input.txt'
  const cmd = getTestCommand(config, identifier, testCaseName, fileName)

  const cwd = vscode.Uri.joinPath(CONTEXT.root, config.directoy)

  const start = Date.now()
  const actual = await execTest(cmd, cwd.path, config)
  const duration = Date.now() - start

  return {
    status:
      actual.trim() === expected.trim() ? TestStatus.Passed : TestStatus.Failed,
    duration,
  }
}

export async function execTest(
  cmd: string,
  cwd: string,
  config: RunnerConfig
): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(cmd, { cwd }, (err, stdout, stderr) => {
      if (err) {
        reject(err)
        return
      }

      const value = extractTestResult(stdout, config.output.extraction)

      if (value) resolve(value)
      else reject('Unable to extract test result')
    })
  })
}

/**
 * Replaces the template parameters in the the command template.
 *
 * TODO: Make generic
 */
function getTestCommand(
  config: RunnerConfig,
  // cmdTemplate: string,
  identifier: AOCProblemIdentifier,
  testCaseName: string,
  filePath?: string
): string {
  const cmd = config.command
    .replaceAll('{year}', identifier.year.toString())
    .replaceAll('{day}', identifier.day.toString())
    .replaceAll('{part}', identifier.part.toString())
    .replaceAll('{testCaseName}', testCaseName)
    .replaceAll('{file}', filePath ?? '')

  if (config.input.method === 'file')
    return cmd.replaceAll('{file}', filePath ?? '')

  return cmd
}
