import { z } from 'zod'

/**
 * A path that still contains placeholders.
 *
 * For advent of code, these placeholders can be: {year} and {day}.
 */
export const PathTemplate = z.string()
export type PathTemplate = z.infer<typeof PathTemplate>
