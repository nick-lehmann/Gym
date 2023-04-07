import { Provider } from '../providers.js'
import { AdventOfCodeConfig } from './config.js'
import { getProblemUrl } from './fetch.js'
import { AOCPart, AOCProblemIdentifier } from './identifier.js'

export class AdventOfCode extends Provider<
  AOCProblemIdentifier,
  AdventOfCodeConfig
> {
  constructor(config: AdventOfCodeConfig) {
    super('advent-of-code', ['year', 'day'], config)
  }

  getLinkToProblem(identifier: { year: number; day: number }): string {
    return getProblemUrl(identifier.year.toString(), identifier.day.toString())
  }

  identifierFromParts(parts: string[]): AOCProblemIdentifier {
    return new AOCProblemIdentifier(
      parseInt(parts[0]),
      parseInt(parts[1]),
      parts[2] as AOCPart
    )
  }
}
