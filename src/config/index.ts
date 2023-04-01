import { z } from 'zod'
import { ProvidersConfig } from './providers.js'

export const IDENTIFIER = 'gym'
export const CONFIG_NAME = 'gym.yaml'

export const Config = z.object({
  providers: ProvidersConfig,
})
export type Config = z.infer<typeof Config>
