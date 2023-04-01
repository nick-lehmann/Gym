import * as vscode from 'vscode'
import { Config, getConfig, getSolutionPathPatterns } from './config.js'

/**
 * Provides a test controller that lets you run your solutions from the integrated testing view.
 *
 * Sample: https://github.com/microsoft/vscode-extension-samples/tree/98346fc4fa81067e253df9b32922cc02e8b24274/test-provider-sample
 */
export class Tests {
  private readonly controller: vscode.TestController

  constructor(
    private readonly context: vscode.ExtensionContext,
    private readonly config: Config,
    private readonly fileChangedEmitter: vscode.EventEmitter<vscode.Uri>
  ) {
    this.controller = vscode.tests.createTestController('gym', 'Gym')
    this.controller.resolveHandler = this.resolveHandler
  }

  resolveHandler: vscode.TestController['resolveHandler'] = async (
    item: vscode.TestItem | undefined
  ) => {
    if (!item) {
      this.context.subscriptions.push(...this.watch())
      return
    }
  }

  upsertSolution(uri: vscode.Uri): { file: vscode.TestItem } {
    const existing = this.controller.items.get(uri.toString())
    if (existing) return { file: existing }

    const file = this.controller.createTestItem(
      uri.toString(),
      uri.path.split('/').pop()!,
      uri
    )
    this.controller.items.add(file)

    // TODO: Build similar hierarchy to the problems view.
    file.canResolveChildren = false
    return { file }
  }

  async findFiles() {
    const config = await getConfig()
    const solutionPaths = await getSolutionPathPatterns(config)

    for (const solutionPath of solutionPaths) {
      const files = await vscode.workspace.findFiles(
        solutionPath.pathPattern,
        undefined,
        1000
      )
      for (const file of files) this.upsertSolution(file)
    }
  }

  /**
   * Watch the workspace for any change to your solutions.
   *
   * TODO: Does not work currently.
   */
  private watch(): vscode.FileSystemWatcher[] {
    const solutionPaths = getSolutionPathPatterns(this.config)
    return solutionPaths.map((solutionPath) => {
      const watcher = vscode.workspace.createFileSystemWatcher(
        solutionPath.pathPattern
      )

      watcher.onDidCreate((uri) => {
        console.debug(`New solution found: ${uri.toString()}`)
        this.upsertSolution(uri)
        this.fileChangedEmitter.fire(uri)
      })
      watcher.onDidChange(async (uri) => {
        console.debug(`Solution changed: ${uri.toString()}`)
        const { file } = this.upsertSolution(uri)
        // if (data.didResolve) {
        //   await data.updateFromDisk(controller, file)
        // }
        this.fileChangedEmitter.fire(uri)
      })
      watcher.onDidDelete((uri) => {
        console.debug(`Solution deleted: ${uri.toString()}`)
        this.controller.items.delete(uri.toString())
      })

      return watcher
    })
  }
}
