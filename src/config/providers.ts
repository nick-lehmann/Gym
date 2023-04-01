import { z } from 'zod'
import { AdventOfCodeConfig } from '../providers/adventofcode/config.js'
import { AdventOfCode } from '../providers/adventofcode/index.js'
import {
  ProjectEulerConfig,
  ProjectEulerProvider,
} from '../providers/projecteuler/index.js'
import { Provider } from '../providers/providers.js'

// TODO: Make providers optional.
export const ProvidersConfig = z.object({
  adventofcode: AdventOfCodeConfig,
  projecteuler: ProjectEulerConfig,
})
export type ProvidersConfig = z.infer<typeof ProvidersConfig>

export function getProviders(config: ProvidersConfig): Provider<any>[] {
  const providers: Provider<any, any>[] = []

  providers.push(new AdventOfCode(config.adventofcode))
  providers.push(new ProjectEulerProvider(config.projecteuler))

  return providers
}
