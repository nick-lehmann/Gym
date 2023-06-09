import { Gym, Implementation, Problem, Provider, TreeItemType } from '@gym/core'
import * as vscode from 'vscode'

export class ProblemTreeProvider implements vscode.TreeDataProvider<TreeItem> {
  constructor(private readonly gym: Gym) {}

  getChildren(element?: TreeItem): vscode.ProviderResult<TreeItem[]> {
    if (element === undefined) return this.getProviderItems()
    if (element.provider !== undefined) {
      console.debug('Fetch problems for provider', element.provider)
      return this.getProblemItems(element.provider)
    }
    if (element.problem !== undefined) {
      console.debug('Fetch solutions for problem', element.problem)
      return this.getSolutionItems(element.problem)
    }
  }

  async getProviderItems(): Promise<TreeItem[]> {
    return this.gym.providers.map((provider) =>
      TreeItem.fromProvider(provider, vscode.TreeItemCollapsibleState.Collapsed)
    )
  }

  // TODO: Add switch to show all available problems?
  async getProblemItems(provider: Provider): Promise<TreeItem[]> {
    return provider.problems.map((p) =>
      TreeItem.fromProblem(p, vscode.TreeItemCollapsibleState.Collapsed)
    )
    // return this.gym.providers.find((p) => p.name === provider.name)!.problems.sort((a, b) => a.identifier.compare(b.identifier)

    // const solutions = await findSolutions()
    // const allProblems = solutions.map((s) => s.problem)

    // const uniqueProblems = deduplicateProblems(allProblems)
    // uniqueProblems.sort(compareProblemsByIdentifier)

    // return uniqueProblems.map((problem) =>
    //   TreeItem.fromProblem(problem, vscode.TreeItemCollapsibleState.Collapsed)
    // )
  }

  async getSolutionItems(problem: Problem): Promise<TreeItem[]> {
    return problem.solutions.map((s) => TreeItem.fromSolution(s))

    // const solutions = await findSolutionsByProblem(problem)

    // return solutions.map((s) => TreeItem.fromSolution(s))
  }

  getTreeItem(element: TreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element
  }

  readonly onDidChangeTreeData: vscode.Event<TreeItem> | undefined
  private _onDidChangeTreeData: vscode.EventEmitter<
    TreeItem | undefined | null | void
  > = new vscode.EventEmitter<TreeItem | undefined | null | void>()

  refresh(): void {
    this._onDidChangeTreeData?.fire()
  }
}

/**
 * A single tree node in the problems explorer.
 *
 * provider
 * ├── problem1
 * │   ├── solution in python
 * │   ├── solution in rust
 * ├── problem2
 * │   ├── solution in python
 *
 * Hence, a tree node can have *exactly* one of the following types:
 * - provider
 * - problem
 * - solution
 */
export class TreeItem extends vscode.TreeItem {
  constructor(
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    readonly type: TreeItemType,
    public readonly provider?: Provider,
    public readonly problem?: Problem,
    public readonly solution?: Implementation
  ) {
    let label = 'Utter failure'

    if (provider) label = provider.name
    // TODO: Move to identifier
    if (problem) label = problem.identifier.toString()
    if (solution) label = solution.language

    super(label, collapsibleState)

    this.contextValue = type
  }

  static fromProvider(
    provider: Provider,
    collapsibleState?: vscode.TreeItemCollapsibleState
  ): TreeItem {
    return new TreeItem(
      vscode.TreeItemCollapsibleState.Collapsed,
      TreeItemType.Provider,
      provider
    )
  }

  static fromProblem(
    problem: Problem,
    collapsibleState?: vscode.TreeItemCollapsibleState
  ): TreeItem {
    return new TreeItem(
      vscode.TreeItemCollapsibleState.Collapsed,
      TreeItemType.Problem,
      undefined,
      problem
    )
  }

  static fromSolution(
    solution: Implementation,
    collapsibleState?: vscode.TreeItemCollapsibleState
  ): TreeItem {
    return new TreeItem(
      vscode.TreeItemCollapsibleState.None,
      TreeItemType.Solution,
      undefined,
      undefined,
      solution
    )
  }
}

// function compareProblemsByIdentifier(
//   { identifier: i1 }: Problem,
//   { identifier: i2 }: Problem
// ): number {
//   if (i1.year < i2.year) return -1
//   if (i1.year > i2.year) return 1
//   if (i1.day < i2.day) return -1
//   if (i1.day < i2.day) return 1
//   return 0
// }

// function deduplicateProblems(problems: Problem[]): Problem[] {
//   return problems.filter(
//     (problem, index, self) =>
//       index ===
//       self.findIndex(
//         (p) =>
//           p.identifier.year === problem.identifier.year &&
//           p.identifier.day === problem.identifier.day
//       )
//   )
// }
