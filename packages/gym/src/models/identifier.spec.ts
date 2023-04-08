import {
  AOCProblemIdentifier,
  AdventOfCode,
  AdventOfCodeConfig,
} from '../providers/adventofcode'
import { Implementation } from './implementation'
import { Problem } from './problem'
import { Solution } from './solution'
import { Testcase } from './testcase'

// @ts-ignore
const config: AdventOfCodeConfig = {}

describe('Resource identifiers', () => {
  const provider = new AdventOfCode(config)

  const identifier = new AOCProblemIdentifier(2020, 1, 'part1')

  // @ts-ignore
  const problem = new Problem(provider, identifier, [])

  const implementation = new Implementation(problem, 'rust', [])
  const solution = new Solution('naive', '', implementation, [])

  const testcase = new Testcase(solution, 'naive')

  test('for providers', () => {
    expect(provider.node.id()).toBe('advent-of-code')
  })

  test('for-problems', () => {
    expect(problem.node.id()).toBe('advent-of-code/2020-01-part1')
  })

  test('for-implementations', () => {
    expect(implementation.node.id()).toBe('advent-of-code/2020-01-part1/rust')
  })

  test('for-solutions', () => {
    expect(solution.node.id()).toBe('advent-of-code/2020-01-part1/rust/naive')
  })

  test('for-testcases', () => {
    expect(testcase.node.id()).toBe(
      'advent-of-code/2020-01-part1/rust/naive/naive'
    )
  })
})
