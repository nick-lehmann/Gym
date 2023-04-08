import { Config } from '../config/index'
import { ProgrammingLanguage } from '../config/language'
import { getGlobPattern, getRegex } from '../config/path-template'
import { getProviders } from '../config/providers'
import { Gym } from '../models/gym'
import { Provider } from '../providers/providers'

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
    // const possibleFiles = await vscode.workspace.findFiles(globPattern)
    const possibleFiles: string[] = []

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

      // TODO
      // if (existing !== undefined) {
      //   const solution = new Implementation(existing, file.toString(), lang)
      //   existing.solutions.push(solution)
      // } else {
      //   const problem = new Problem(provider, identifier)
      //   problem.solutions.push(
      //     new Implementation(problem, file.toString(), lang)
      //   )
      //   provider.problems.push(problem)
      // }
    }
  }

  provider.problems.sort((a, b) => a.identifier.compare(b.identifier))

  return provider
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
