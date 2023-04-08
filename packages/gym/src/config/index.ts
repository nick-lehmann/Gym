import { z } from 'zod'
import { ProvidersConfig } from './providers'

export * from './language'
export * from './load'
export * from './path-template'
export * from './providers'

export const IDENTIFIER = 'gym'
export const CONFIG_NAME = 'gym.yaml'

export const Config = z.object({
  providers: ProvidersConfig,
})
export type Config = z.infer<typeof Config>
