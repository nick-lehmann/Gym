import { Provider } from '../providers'
import { AdventOfCodeConfig } from './config'
import { getProblemUrl } from './fetch'
import { AOCPart, AOCProblemIdentifier } from './identifier'

export * from './config'
export * from './data'
export * from './fetch'
export * from './identifier'

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

  discoverFile(): Promise<void> {
    throw new Error('Method not implemented.')
  }

  resourceIdentifier(): string {
    return this.name
  }
}
