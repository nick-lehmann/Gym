import { z } from 'zod'
import { BaseProviderConfig } from '../config'
import { ProblemIdentifier, Provider } from '../providers'

export const ProjectEulerConfig = z.object({}).merge(BaseProviderConfig)
export type ProjectEulerConfig = z.infer<typeof ProjectEulerConfig>

const IdentifierData = z.object({
  num: z.number(),
})
type IdentifierData = z.infer<typeof IdentifierData>

class Identifier extends ProblemIdentifier<IdentifierData> {
  constructor(public readonly num: number) {
    super()
  }

  compare(other: Identifier): 0 | 1 | -1 {
    if (this.num < other.num) return -1
    if (this.num < other.num) return 1
    return 0
  }

  toString(): string {
    return this.num.toString()
  }
}

export class ProjectEulerProvider extends Provider<
  Identifier,
  ProjectEulerConfig
> {
  constructor(config: ProjectEulerConfig) {
    super('projecteuler', ['num'], config)
  }

  getLinkToProblem(identifier: Identifier): string {
    return `https://projecteuler.net/problem=${identifier.num}`
  }

  identifierFromParts(parts: string[]): Identifier {
    return new Identifier(parseInt(parts[0]))
  }

  discoverFile(): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
