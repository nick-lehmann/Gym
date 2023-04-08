import * as vscode from 'vscode'

import { Gym, Problem, TreeNode, run } from '@gym/core'

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
      testRun.started(test)

      // Skip tests the user asked to exclude
      if (request.exclude?.includes(test)) continue

      console.info('Running test', test.label)

      const node = this.nodeCache.get(test.id)
      if (node === undefined) {
        vscode.window.showErrorMessage(
          `Unable to run test as it seems to not exist: ${test.id}`
        )
        continue
      }

      const problem = node.inner() as Problem

      try {
        const { status, duration } = await run(problem)

        if (status === 'passed') {
          testRun.passed(test, duration)
        } else {
          // const message = vscode.TestMessage.diff('Test failed')
          const message = new vscode.TestMessage('Test failed')
          testRun.failed(test, message, duration)
        }
      } catch (e: unknown) {
        vscode.window.showErrorMessage('failed to run test')
      }
    }

    testRun.end()
  }

  private treeNodeToTestItem(node: TreeNode<any>): vscode.TestItem {
    const uri = node.uri()
    const testItem = this.controller.createTestItem(
      node.id(),
      node.label(),
      uri ? vscode.Uri.parse(uri) : undefined
    )
    testItem.canResolveChildren = node.canHaveChildren
    return testItem
  }
}
