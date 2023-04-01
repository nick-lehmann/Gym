import * as vscode from 'vscode'
import { Config } from './config/index.js'
import { ProgrammingLanguage } from './config/language.js'
import { PathTemplate } from './config/path-template.js'
import { getProviders } from './config/providers.js'
import { Gym } from './gym.js'
import { Problem } from './problem.js'
import { Provider } from './providers/providers.js'
import { Solution } from './solution.js'

/**
 * Entrypoint for the workspace discovery.
 */
export async function discover(config: Config): Promise<Gym> {
  console.debug('Start discovery')

  const providers = await Promise.all(
    getProviders(config.providers).map((provider) => discoverProvider(provider))
  )

  return new Gym(providers)
}

async function discoverProvider(provider: Provider): Promise<Provider> {
  console.debug('Start discovery of provider', provider.name)

  for (const [l, pathTemplate] of Object.entries(provider.config.paths)) {
    const lang = l as ProgrammingLanguage // TODO: Fix interference
    const identifierParts = provider.identifierParts()

    const globPattern = getGlobPattern(identifierParts, pathTemplate)
    const possibleFiles = await vscode.workspace.findFiles(globPattern)

    const regex = getRegex(identifierParts, pathTemplate)

    for (const file of possibleFiles) {
      const matches = file.toString().match(regex)
      if (!matches) continue
      matches.shift()

      const identifier = provider.identifierFromParts(matches)
      console.debug(`Matching file ${file}: ${identifier}`)

      const existing = provider.problems.find((p) =>
        p.identifier.equals(identifier)
      )

      if (existing !== undefined) {
        const solution = new Solution(existing, file.toString(), lang)
        existing.solutions.push(solution)
      } else {
        const problem = new Problem(provider, identifier)
        problem.solutions.push(new Solution(problem, file.toString(), lang))
        provider.problems.push(problem)
      }
    }
  }

  provider.problems.sort((a, b) => a.identifier.compare(b.identifier))

  return provider
}

// export async function findSolutions(): Promise<Solution[]> {
//   console.debug('Start discovery of solutions')
//   const config = await getConfig()
//   const root = vscode.workspace.rootPath

//   const providers = getProviders(config.providers)

//   const solutions = []

//   for (const provider of providers) {
//     const identifierParts = Object.keys(provider.identifierParts())
//     console.debug(
//       `Discover solution for ${provider.name} with identifier parts ${identifierParts}`
//     )

//     for (const language of SUPPORTED_PROGRAMMING_LANGUAGES) {
//       const pathTemplate = provider.config.paths[language]
//       if (!pathTemplate) continue

//       // TODO: Add validation.
//       const globPattern = getGlobPattern(identifierParts, pathTemplate)
//       // All files that match the path pattern described in the config.
//       const possibleFiles = await glob(`${root}/${globPattern}`)

//       const regex = getRegex(identifierParts, pathTemplate)

//       console.debug(`Discover ${language} solutions`, {
//         globPattern,
//         regex,
//         possibleFiles,
//       })

//       for (const file of possibleFiles) {
//         const matches = file.match(regex)
//         if (!matches) continue
//         matches.shift()

//         const identifier = identifierFromParts(matches)
//         console.debug(`Matching file ${file}: ${identifier}`)

//         const problem = new Problem(provider, identifier)

//         solutions.push(new Solution(problem, file, language))
//       }
//     }
//   }

//   console.debug('Done finding solutions: ', solutions)

//   return solutions
// }

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
  pathTemplate: PathTemplate
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

// export function getSolutionPathPatterns(config: Config): SolutionPaths[] {
//   if (!vscode.workspace.workspaceFolders) return []

//   const solutionPaths = []

//   for (const workspaceFolder of vscode.workspace.workspaceFolders) {
//     for (const provider of getProviders(config.providers)) {
//       const identifierParts = Object.keys(provider.identifier.shape)

//       for (const [language, path] of Object.entries(provider.config.paths)) {
//         solutionPaths.push({
//           provider,
//           language: language as ProgrammingLanguage,
//           root: workspaceFolder.uri.fsPath,
//           pathPattern: getGlobPattern(identifierParts, path),
//         })
//       }
//     }
//   }

//   return solutionPaths
// }
