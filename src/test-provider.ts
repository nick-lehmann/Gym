import { ExecOptions } from 'child_process'
import * as vscode from 'vscode'
import { Gym } from './gym.js'
import { Problem } from './problem.js'
import { getAocTestdataForProblem } from './providers/adventofcode/data.js'
import { AOCProblemIdentifier } from './providers/adventofcode/identifier.js'
import { runRustTest } from './runner/rust.js'
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

      // if (node.type !== TreeItemType.Solution) {
      //   vscode.window.showErrorMessage(
      //     `Unable to any test that does not represent a single solution`
      //   )
      //   continue
      // }

      const problem = node.inner() as Problem
      const identifier = problem.identifier as AOCProblemIdentifier
      // TODO: Save this information in the identifier
      // const part = 'part1'
      // const paddedDay = identifier.day.toString().padStart(2, '0')

      const data = await getAocTestdataForProblem(problem)

      const testcase = data.tests.part1[0]

      // const testFilter = `aoc${identifier.year}::day${paddedDay}::test_${identifier.year}_${identifier.day}_${part}_example`
      const testFilter = 'aoc2020::day01::test_2022_1_part1_example'

      const cmd = `cat input.txt | cargo test ${testFilter} -- --nocapture`
      const execOptions: ExecOptions = {
        cwd: '/Users/nick/Projekte/Advent Of Code/rust', // TODO: Find exec directory from workspace.
      }

      const start = Date.now()
      const actual = await runRustTest()
      const duration = Date.now() - start

      const expected = testcase.solution.toString()

      if (actual.trim() == expected.trim()) {
        testRun.passed(test, duration)
      } else {
        const message = vscode.TestMessage.diff('Test failed', expected, actual)
        testRun.failed(test, message, duration)
      }
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
