import * as vscode from 'vscode'
import { Config } from '../config/index.js'
import { ProgrammingLanguage } from '../config/language.js'
import { PathTemplate } from '../config/path-template.js'
import { getProviders } from '../config/providers.js'
import { Gym } from '../models/gym.js'
import { Problem } from '../models/problem.js'
import { Solution } from '../models/solution.js'
import { Provider } from '../providers/providers.js'

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
      // console.debug(`Matching file ${file}: ${identifier}`)

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

// watch(): vscode.FileSystemWatcher[] {
// const solutionPaths = getSolutionPathPatterns(this.config)
// return solutionPaths.map((solutionPath) => {
//   const watcher = vscode.workspace.createFileSystemWatcher(
//     solutionPath.pathPattern
//   )

//   watcher.onDidCreate((uri) => {
//     console.debug(`New solution found: ${uri.toString()}`)
//     this.upsertSolution(uri)
//     this.fileChangedEmitter.fire(uri)
//   })
//   watcher.onDidChange(async (uri) => {
//     this.upsertSolution(uri)
//     // if (data.didResolve) {
//     //   await data.updateFromDisk(controller, file)
//     // }
//     this.fileChangedEmitter.fire(uri)
//   })
//   watcher.onDidDelete((uri) => {
//     console.debug(`Solution deleted: ${uri.toString()}`)
//     this.controller.items.delete(uri.toString())
//   })

//   return watcher
// })
//   return []
// }
