import { Uri } from 'vscode'
import { TreeItemType } from '../explorer.js'
import { ProblemIdentifier, Provider } from '../providers/providers.js'
import { Solution } from './solution.js'
import { TreeNode } from './tree.js'

export class Problem {
  public readonly node: ProblemNode = new ProblemNode(this)

  constructor(
    public readonly provider: Provider,
    public readonly identifier: ProblemIdentifier,
    // TODO: Add option to have other sub-problems as children.
    public solutions: Solution[] = []
  ) {}

  getLink(): string {
    return this.provider.getLinkToProblem(this.identifier)
  }
}

export class ProblemNode implements TreeNode<Problem> {
  type = TreeItemType.Problem
  canHaveChildren = true

  constructor(public problem: Problem) {}

  inner(): Problem {
    return this.problem
  }

  id(): string {
    return `problems/${
      this.problem.provider.name
    }/${this.problem.identifier.toString()}`
  }

  label(): string {
    return this.problem.identifier.toString()
  }

  uri(): Uri | undefined {
    return undefined
  }

  parent() {
    return this.problem.provider.node
  }

  hasChildren(): boolean {
    return this.problem.solutions.length !== 0
  }

  getChildren() {
    return this.problem.solutions.map((s) => s.node)
  }
}
