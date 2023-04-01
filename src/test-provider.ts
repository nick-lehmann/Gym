import * as vscode from 'vscode'
import { Gym } from './gym.js'
import { TreeNode } from './tree.js'

/**
 * Provides a test controller that lets you run your solutions from the integrated testing view.
 *
 * Sample: https://github.com/microsoft/vscode-extension-samples/tree/98346fc4fa81067e253df9b32922cc02e8b24274/test-provider-sample
 */
export class Tests {
  private readonly controller: vscode.TestController
  private readonly nodeCache = new Map<string, TreeNode<unknown>>()

  constructor(
    private readonly context: vscode.ExtensionContext,
    private readonly gym: Gym
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

  /**
   * VS Code inquires us about the children of a test.
   *
   * There are two cases:
   * - `item` is undefined, which means we should create the root nodes of the tree.
   * - `item` is defined, which means we should create the children of that node.
   */
  resolveHandler: vscode.TestController['resolveHandler'] = async (
    item: vscode.TestItem | undefined
  ) => {
    if (!item) {
      for (const provider of this.gym.providers) this.addItem(provider.node)
      return
    }

    const node = this.nodeCache.get(item.id)
    if (node === undefined) {
      vscode.window.showErrorMessage(
        `Unable to resolve node that does not exit: ${item.id}`
      )
      return
    }

    for (const childNode of node.getChildren()) this.addItem(childNode, item)
  }

  addItem(node: TreeNode<unknown>, parent?: vscode.TestItem) {
    const id = node.id()
    const existing = this.controller.items.get(id)
    if (existing !== undefined) {
      console.debug('Test item already exists', id)
      return
    }

    console.debug('Adding test item', id)
    this.nodeCache.set(id, node)
    const item = this.treeNodeToTestItem(node)

    if (parent) parent.children.add(item)
    else this.controller.items.add(item)
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

  private treeNodeToTestItem(node: TreeNode<any>): vscode.TestItem {
    const testItem = this.controller.createTestItem(
      node.id(),
      node.label(),
      node.uri()
    )
    testItem.canResolveChildren = node.canHaveChildren
    return testItem
  }
}
