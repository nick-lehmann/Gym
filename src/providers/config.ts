import { z } from 'zod'
import { ProgrammingLanguage } from '../config/language.js'
import { PathTemplate } from '../config/path-template.js'

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
