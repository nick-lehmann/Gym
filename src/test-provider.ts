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
    context.subscriptions.push(this.controller)
    this.controller.resolveHandler = this.resolveHandler
  }

  /**
   * Create a run profile for the test controller.
   *
   * Source: https://code.visualstudio.com/api/extension-guides/testing#running-tests
   */
  createProfiles() {
    this.controller.createRunProfile(
      'Run',
      vscode.TestRunProfileKind.Run,
      (request, token) => this.run(request, token)
    )
  }

  resolveHandler: vscode.TestController['resolveHandler'] = async (
    item: vscode.TestItem | undefined
  ) => {
    if (!item) {
      this.context.subscriptions.push(...this.watch())
      return
    }
  }

  async run(request: vscode.TestRunRequest, token: vscode.CancellationToken) {
    const testRun = this.controller.createTestRun(request)

    const queue: vscode.TestItem[] = []
    // Loop through all included tests, or all known tests, and add them to our queue
    if (request.include) request.include.forEach((test) => queue.push(test))
    else this.controller.items.forEach((test) => queue.push(test))

    while (queue.length > 0 && !token.isCancellationRequested) {
      const test = queue.pop()!

      // Skip tests the user asked to exclude
      if (request.exclude?.includes(test)) {
        continue
      }

      console.info('Running test', test.label)

      // switch (getType(test)) {
      //   case ItemType.File:
      //     // If we're running a file and don't know what it contains yet, parse it now
      //     if (test.children.size === 0) {
      //       await parseTestsInFileContents(test)
      //     }
      //     break
      //   case ItemType.TestCase:
      //     // Otherwise, just run the test case. Note that we don't need to manually
      //     // set the state of parent tests; they'll be set automatically.
      //     const start = Date.now()
      //     try {
      //       await assertTestPasses(test)
      //       run.passed(test, Date.now() - start)
      //     } catch (e) {
      //       run.failed(
      //         test,
      //         new vscode.TestMessage(e.message),
      //         Date.now() - start
      //       )
      //     }
      //     break
      // }

      test.children.forEach((test) => queue.push(test))
    }

    testRun.end()
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
