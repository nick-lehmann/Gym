import { Identifier } from './providers/adventofcode/identifier.js'
import { Provider } from './providers/providers.js'

export class Problem {
  constructor(
    public readonly provider: Provider,
    public readonly identifier: Identifier,
    public readonly children: Problem[] = []
  ) {}

  getLink(): string {
    return this.provider.getLinkToProblem(this.identifier)
  }
}
