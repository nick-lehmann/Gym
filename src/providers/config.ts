import { z } from 'zod'
import { PathTemplate, ProgrammingLanguage } from '../config.js'

export const ProblemPaths = z.record(ProgrammingLanguage, z.string())
export type ProblemPaths = z.infer<typeof ProblemPaths>

/**
 * Common config values for all providers.
 */
export const BaseProviderConfig = z.object({
  paths: ProblemPaths,
  data: z
    .object({
      path: PathTemplate,
    })
    .optional(),
})
export type BaseProviderConfig = z.infer<typeof BaseProviderConfig>
