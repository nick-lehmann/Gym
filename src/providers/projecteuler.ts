import { z } from 'zod'
import { BaseProviderConfig } from './config.js'
import { Provider } from './providers.js'

export const ProjectEulerConfig = z.object({}).merge(BaseProviderConfig)
export type ProjectEulerConfig = z.infer<typeof ProjectEulerConfig>

const Identifier = z.object({
  num: z.number(),
})
type Identifier = z.infer<typeof Identifier>

export class ProjectEulerProvider extends Provider<
  Identifier,
  ProjectEulerConfig
> {
  constructor(config: ProjectEulerConfig) {
    super('projecteuler', Identifier, config)
  }

  getLinkToProblem(identifier: Identifier): string {
    return `https://projecteuler.net/problem=${identifier.num}`
  }
}
