import { z } from 'zod'
import { BaseProviderConfig } from '../config.js'

export const AdventOfCodeConfig = z
  .object({
    session: z.string(),
  })
  .merge(BaseProviderConfig)
export type AdventOfCodeConfig = z.infer<typeof AdventOfCodeConfig>
