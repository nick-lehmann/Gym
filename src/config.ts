import * as vscode from 'vscode'
import { parse as parseYaml } from 'yaml'
import { z } from 'zod'
import { getGlobPattern } from './discovery.js'
import { AdventOfCodeConfig } from './providers/adventofcode/config.js'
import { AdventOfCode } from './providers/adventofcode/index.js'
import { Provider } from './providers/providers.js'

export const IDENTIFIER = 'gym'
export const CONFIG_NAME = 'gym.yaml'

export const PROVIDERS: Provider[] = [AdventOfCode]

/**
 * A path that still contains placeholders.
 *
 * For advent of code, these placeholders can be: {year} and {day}.
 */
export const TemplatePath = z.string()

export const SUPPORTED_PROGRAMMING_LANGUAGES = [
  'python',
  'javascript',
  'typescript',
  'rust',
] as const
export const ProgrammingLanguage = z.enum(SUPPORTED_PROGRAMMING_LANGUAGES)
export type ProgrammingLanguage = z.infer<typeof ProgrammingLanguage>
export const ProblemPaths = z.record(ProgrammingLanguage, z.string())
export type ProblemPaths = z.infer<typeof ProblemPaths>

export const ProvidersConfig = z.object({
  adventofcode: AdventOfCodeConfig,
})

export const Config = z.object({
  paths: ProblemPaths,
  data: TemplatePath,
  providers: ProvidersConfig,
})
export type Config = z.infer<typeof Config>

export async function getConfig(): Promise<Config> {
  const path = `${vscode.workspace.rootPath}/${CONFIG_NAME}`
  const content = await vscode.workspace.fs.readFile(vscode.Uri.file(path))
  const rawConfig = parseYaml(content.toString())

  return Config.parse(rawConfig)
}

export type SolutionPaths = {
  provider: Provider
  language: ProgrammingLanguage
  root: string
  pathPattern: string
}

export function getSolutionPathPatterns(config: Config): SolutionPaths[] {
  if (!vscode.workspace.workspaceFolders) return []

  const solutionPaths = []

  for (const workspaceFolder of vscode.workspace.workspaceFolders) {
    for (const provider of PROVIDERS) {
      const identifierParts = Object.keys(provider.identifier.shape)

      for (const [language, path] of Object.entries(config.paths)) {
        solutionPaths.push({
          provider,
          language: language as ProgrammingLanguage,
          root: workspaceFolder.uri.fsPath,
          pathPattern: getGlobPattern(identifierParts, path),
        })
      }
    }
  }

  return solutionPaths
}
