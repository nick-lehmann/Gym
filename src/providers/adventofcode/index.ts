import { Provider } from '../providers.js'
import { getProblemUrl } from './fetch.js'
import { AOCProblemIdentifier } from './identifier.js'

export const AdventOfCode: Provider = {
  name: 'Advent of Code',
  identifier: AOCProblemIdentifier,

  getLinkToProblem: (problem): string =>
    getProblemUrl(
      problem.identifier.year.toString(),
      problem.identifier.day.toString()
    ),
}
