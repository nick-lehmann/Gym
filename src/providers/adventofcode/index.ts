import { Provider } from '../providers.js'
import { AdventOfCodeConfig } from './config.js'
import { getProblemUrl } from './fetch.js'
import { Identifier } from './identifier.js'

// export const AdventOfCode: Provider = {
//   name: 'Advent of Code',
//   identifier: AOCProblemIdentifier,

//   getLinkToProblem: (problem): string =>
//     getProblemUrl(
//       problem.identifier.year.toString(),
//       problem.identifier.day.toString()
//     ),
// }

export class AdventOfCode extends Provider<Identifier, AdventOfCodeConfig> {
  constructor(config: AdventOfCodeConfig) {
    super('Advent of Code', Identifier, config)
  }

  getLinkToProblem(identifier: { year: number; day: number }): string {
    return getProblemUrl(identifier.year.toString(), identifier.day.toString())
  }
}
