import { z } from 'zod'
import { ProgrammingLanguage } from '../config/language'
import { ProvidersConfig } from '../config/providers'
import { Implementation } from '../models/implementation'
import { Problem } from '../models/problem'
import { Solution } from '../models/solution'
import { Testcase } from '../models/testcase'
import { Identifier } from '../providers/adventofcode/identifier'

const SOLUTIONS = [
  'test_2020_1_part1_default',
  'test_2020_1_part1_cached',
  'test_2020_1_part1_round',
  'test_2020_1_part2_default',
]

function solutionNamesFromFile(file: string): string[] {
  return SOLUTIONS
}

const TestcaseTemplate = z.object({
  solution: z.string(),
})

const SolutionIdentifier = Identifier.merge(TestcaseTemplate)
type SolutionIdentifier = z.infer<typeof SolutionIdentifier>

// TODO: Use datastore here.
// TODO: Return testcases instead of strings.
function getTestcasesForImplementation(): string[] {
  return ['example', 'puzzle']
}

function discoverImplementation(
  file: string,
  problem: Problem,
  language: ProgrammingLanguage,
  config: ProvidersConfig
): Implementation {
  const implementation = new Implementation(problem, language, [])
  const solutionRegex =
    /test_(?<year>\d+)_(?<day>\d+)_(?<part>\w+)_(?<solution>\w+)/gm

  for (const solutionName of solutionNamesFromFile(file)) {
    const match = solutionName.matchAll(solutionRegex).next().value
    const identifier = SolutionIdentifier.parse(match.groups)

    const solution = new Solution(identifier.solution, file, implementation, [])

    solution.testcases = getTestcasesForImplementation().map(
      (name) => new Testcase(solution, name)
    )

    implementation.solutions.push(solution)
  }

  return implementation
}
