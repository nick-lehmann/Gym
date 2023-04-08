import { z } from 'zod'

/**
 * A path that still contains placeholders.
 *
 * For advent of code, these placeholders can be: {year} and {day}.
 */
export const PathTemplate = z.string()
export type PathTemplate = z.infer<typeof PathTemplate>

export function getGlobPattern(
  identifierParts: string[],
  pathTemplate: PathTemplate
): string {
  return identifierParts.reduce((result, part) => {
    return result.replace(`{${part}}`, '*')
  }, pathTemplate)
}

export function getRegex(
  identifierParts: string[],
  pathTemplate: string
): RegExp {
  const regex = identifierParts.reduce((result, part) => {
    return result.replace(`{${part}}`, '(.+)')
  }, pathTemplate)

  return new RegExp(regex)
}
