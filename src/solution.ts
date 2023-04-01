import * as vscode from 'vscode'
import { ProgrammingLanguage } from './config/language.js'
import { TreeItemType } from './problem-tree.js'
import { Problem } from './problem.js'
import { TreeNode } from './tree.js'

export class Solution {
  public node: SolutionNode = new SolutionNode(this)

  constructor(
    public readonly problem: Problem,
    public readonly path: string,
    public readonly language: ProgrammingLanguage
  ) {}

  // TODO: Do not use `rootPath`
  absolutePath() {
    return `${vscode.workspace.rootPath}/${this.path}`
  }
}

export class SolutionNode extends TreeNode<Solution> {
  type = TreeItemType.Solution
  canHaveChildren = false

  constructor(public readonly solution: Solution) {
    super()
  }

  inner() {
    return this.solution
  }

  id(): string {
    return (
      this.solution.problem.node.id() + '/solutions/' + this.solution.language
    )
  }

  uri(): vscode.Uri {
    return vscode.Uri.file(this.solution.absolutePath())
  }

  label(): string {
    return this.inner().language
  }

  parent() {
    return this.solution.problem.node
  }

  hasChildren() {
    return false
  }

  getChildren() {
    return []
  }
}

export async function openSolution(solution: Solution) {
  const document = await vscode.workspace.openTextDocument(
    vscode.Uri.file(solution.absolutePath())
  )
  await vscode.window.showTextDocument(document, {
    preview: false,
  })
}
