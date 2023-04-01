import * as vscode from 'vscode'
import { parse as parseYaml } from 'yaml'
import { z } from 'zod'
import { AdventOfCodeConfig } from './providers/adventofcode/config.js'
import { AdventOfCode } from './providers/adventofcode/index.js'
import {
  ProjectEulerConfig,
  ProjectEulerProvider,
} from './providers/projecteuler.js'
import { Provider } from './providers/providers.js'

export const IDENTIFIER = 'gym'
export const CONFIG_NAME = 'gym.yaml'

export function getProviders(config: ProvidersConfig): Provider<any>[] {
  const providers: Provider<any, any>[] = []

  providers.push(new AdventOfCode(config.adventofcode))
  providers.push(new ProjectEulerProvider(config.projecteuler))

  return providers
}

/**
 * A path that still contains placeholders.
 *
 * For advent of code, these placeholders can be: {year} and {day}.
 */
export const PathTemplate = z.string()
export type PathTemplate = z.infer<typeof PathTemplate>

export const SUPPORTED_PROGRAMMING_LANGUAGES = [
  'python',
  'javascript',
  'typescript',
  'rust',
] as const
export const ProgrammingLanguage = z.enum(SUPPORTED_PROGRAMMING_LANGUAGES)
export type ProgrammingLanguage = z.infer<typeof ProgrammingLanguage>

// TODO: Make providers optional.
export const ProvidersConfig = z.object({
  adventofcode: AdventOfCodeConfig,
  projecteuler: ProjectEulerConfig,
})
export type ProvidersConfig = z.infer<typeof ProvidersConfig>

export const Config = z.object({
  providers: ProvidersConfig,
})
export type Config = z.infer<typeof Config>

export async function getConfig(): Promise<Config> {
  const path = `${vscode.workspace.rootPath}/${CONFIG_NAME}`
  const content = await vscode.workspace.fs.readFile(vscode.Uri.file(path))
  const rawConfig = parseYaml(content.toString())

  return Config.parse(rawConfig)
}
