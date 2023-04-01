import { glob } from 'glob'
import * as vscode from 'vscode'
import {
  getConfig,
  PROVIDERS,
  SUPPORTED_PROGRAMMING_LANGUAGES,
} from './config.js'
import { Problem } from './problem.js'
import { identifierFromParts } from './providers/adventofcode/identifier.js'
import { Solution } from './solution.js'

export async function findSolutions(): Promise<Solution[]> {
  console.debug('Start discovery of solutions')
  const config = await getConfig()
  const root = vscode.workspace.rootPath

  const solutions = []

  for (const provider of PROVIDERS) {
    const identifierParts = Object.keys(provider.identifier.shape)
    console.debug(
      `Discover solution for ${provider.name} with identifier parts ${identifierParts}`
    )

    for (const language of SUPPORTED_PROGRAMMING_LANGUAGES) {
      const pathTemplate = config.paths[language]
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
  const config = await getConfig()
  const solutions = []

  for (const language of SUPPORTED_PROGRAMMING_LANGUAGES) {
    const solution = Solution.find(config.paths, problem, language)
    if (solution !== undefined) solutions.push(solution)
  }

  return solutions
}

function getGlobPattern(
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
