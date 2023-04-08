// import { CONTEXT } from '../../../extension/src/extension'
import { Implementation } from './implementation'
import { Testcase } from './testcase'
import { TreeItemType, TreeNode } from './tree'

/**
 * Users might implement a problem even in a single language in multiple ways. We call these ways `solutions`.
 * Each solution is likely to represent a single function in this language.
 * Therefore, a user will create multiple implementations in form of multiple functions.
 * Each implementation has to take the same shape of inputs, and given the same inputs, also return the same output.
 */
export class Solution {
  public readonly node = new SolutionNode(this)

  constructor(
    // If there is only one solution, we leave the `name` undefined.
    // However, as soon as there is more than one solution in an implementation, we have to require the name.
    public readonly name: string | undefined,
    public readonly path: string,
    public readonly implementation: Implementation,
    public testcases: Testcase[]
  ) {}

  absolutePath() {
    // TODO
    return `${this.path}`
  }
}

export const DEFAULT_SOLUTION_NAME = 'default'

export class SolutionNode implements TreeNode<Solution> {
  type: TreeItemType = TreeItemType.Solution
  canHaveChildren = true

  constructor(public readonly solution: Solution) {}

  id(): string {
    return this.solution.implementation.node.id() + '/' + this.solution.name
  }

  uri(): string | undefined {
    return this.solution.absolutePath()
  }

  label(): string {
    return this.solution.name ?? DEFAULT_SOLUTION_NAME
  }

  inner(): Solution {
    return this.solution
  }

  parent(): TreeNode<any> | undefined {
    return this.solution.implementation.node
  }

  hasChildren(): boolean {
    return this.getChildren().length !== 0
  }

  // Unimplemented, since `canHaveChildren` is false.
  getChildren(): TreeNode<any>[] {
    return this.solution.testcases.map((testcase) => testcase.node)
  }
}

export async function openSolution(solution: Solution) {
  // const document = await vscode.workspace.openTextDocument(
  //   vscode.Uri.file(solution.absolutePath())
  // )
  // await vscode.window.showTextDocument(document, {
  //   preview: false,
  // })
}
