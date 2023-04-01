import { ProblemIdentifier, Provider } from './providers/providers.js'
import { Solution } from './solution.js'

export class Problem {
  constructor(
    public readonly provider: Provider,
    public readonly identifier: ProblemIdentifier,
    // TODO: Add option to have other sub-problems as children.
    public solutions: Solution[] = []
  ) {}

  getLink(): string {
    return this.provider.getLinkToProblem(this.identifier)
  }
}
