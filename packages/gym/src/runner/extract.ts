import { z } from 'zod'

/**
 * Defines how a runner should extract the result from the string returned by the test.
 *
 * If no option is specified here, the complete test result will be seen as the result.
 */
export const ExtractionConfig = z.object({
  regex: z.string().optional(),
})
export type ExtractionConfig = z.infer<typeof ExtractionConfig>

export const SAMPLE_EXTRACTION_CONFIG: ExtractionConfig = {
  regex: 'Start solution\\n(.+)\\nEnd solution',
}

export function extractTestResult(
  output: string,
  config?: ExtractionConfig
): string | undefined {
  if (config?.regex !== undefined) return regexExtraction(output, config.regex)

  return output
}

function regexExtraction(output: string, regex: string): string | undefined {
  const pattern = new RegExp(regex, 'gmi')

  const matches = pattern.exec(output)
  if (matches === null || matches.length < 2) return undefined

  return matches[1]
}
