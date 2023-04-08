import { z } from 'zod'

export const SUPPORTED_PROGRAMMING_LANGUAGES = [
  'python',
  'javascript',
  'typescript',
  'rust',
] as const
export const ProgrammingLanguage = z.enum(SUPPORTED_PROGRAMMING_LANGUAGES)
export type ProgrammingLanguage = z.infer<typeof ProgrammingLanguage>
