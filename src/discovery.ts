import { glob } from 'glob'
import * as vscode from 'vscode'
import {
  Config,
  getConfig,
  getProviders,
  ProgrammingLanguage,
  SUPPORTED_PROGRAMMING_LANGUAGES,
} from './config.js'
import { Problem } from './problem.js'
import { identifierFromParts } from './providers/adventofcode/identifier.js'
import { Provider } from './providers/providers.js'
import { Solution } from './solution.js'

export async function discover() {
  console.debug('Start discovery')
}

export async function findSolutions(): Promise<Solution[]> {
  console.debug('Start discovery of solutions')
  const config = await getConfig()
  const root = vscode.workspace.rootPath

  const providers = getProviders(config.providers)

  const solutions = []

  for (const provider of providers) {
    const identifierParts = Object.keys(provider.identifier.shape)
    console.debug(
      `Discover solution for ${provider.name} with identifier parts ${identifierParts}`
    )

    for (const language of SUPPORTED_PROGRAMMING_LANGUAGES) {
      const pathTemplate = provider.config.paths[language]
      if (!pathTemplate) continue

      // TODO: Add validation.
      const globPattern = getGlobPattern(identifierParts, pathTemplate)
      // All files that match the path pattern described in the config.
      const possibleFiles = await glob(`${root}/${globPattern}`)

      const regex = getRegex(identifierParts, pathTemplate)

      console.debug(`Discover ${language} solutions`, {
        globPattern,
        regex,
        possibleFiles,
      })

      for (const file of possibleFiles) {
        const matches = file.match(regex)
        if (!matches) continue
        matches.shift()

        const identifier = identifierFromParts(matches)
        console.debug(`Matching file ${file}: ${identifier}`)

        const problem = new Problem(provider, identifier)

        solutions.push(new Solution(problem, file, language))
      }
    }
  }

  console.debug('Done finding solutions: ', solutions)

  return solutions
}

export async function findSolutionsByProblem(
  problem: Problem
): Promise<Solution[]> {
  // const config = await getConfig()
  // const solutions = []

  // for (const language of SUPPORTED_PROGRAMMING_LANGUAGES) {
  //   const solution = Solution.find(config.paths, problem, language)
  //   if (solution !== undefined) solutions.push(solution)
  // }

  // return solutions
  return []
}

export function getGlobPattern(
  identifierParts: string[],
  pathTemplate: string
): string {
  return identifierParts.reduce((result, part) => {
    return result.replace(`{${part}}`, '*')
  }, pathTemplate)
}

function getRegex(identifierParts: string[], pathTemplate: string): RegExp {
  const regex = identifierParts.reduce((result, part) => {
    return result.replace(`{${part}}`, '(\\d+)')
  }, pathTemplate)

  return new RegExp(regex)
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
    for (const provider of getProviders(config.providers)) {
      const identifierParts = Object.keys(provider.identifier.shape)

      for (const [language, path] of Object.entries(provider.config.paths)) {
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
