import { z } from 'zod'
import { PathTemplate } from '../config/path-template.js'
import { ExtractionConfig } from './extract.js'

// file: Add `file` template variable that resolves to testdata file
export const InputMethod = z.enum(['file', 'stdin'])

// Configures how the testdata is passed to the command
// stdin: Testdata is piped to stdin
export const InputConfig = z.object({
  method: InputMethod,
})

export const OutputMethod = z.enum(['file', 'stdout'])

export const OutputConfig = z.object({
  method: OutputMethod,
  extraction: ExtractionConfig.optional(),
})

export const RunnerConfig = z.object({
  // Path relatie to the workspace folder where the test command is executed.
  directoy: z.string(),
  command: PathTemplate,
  input: InputConfig,
  output: OutputConfig,
})
export type RunnerConfig = z.infer<typeof RunnerConfig>
