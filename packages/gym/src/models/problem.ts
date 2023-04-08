import { ProblemIdentifier, Provider } from '../providers/providers'
import { Implementation } from './implementation'
import { ProblemGroup } from './problem-group'
import { TreeItemType, TreeNode } from './tree'

/**
 * A problem is, well, a single problem.
 *
 * It has a description.
 * It has multiple testcases.
 * It is found on a single provider.
 * Every problem has a unique identifier.
 * Every problem is runnable by the test runner.
 */
export class Problem {
  public readonly node: ProblemNode = new ProblemNode(this)

  constructor(
    public readonly parent: Provider | ProblemGroup,
    public readonly identifier: ProblemIdentifier,
    // TODO: Add option to have other sub-problems as children.
    public solutions: Implementation[] = []
  ) {}

  getProvider(): Provider {
    let current = this.parent
    while (!(current instanceof Provider)) {
      current = current.parent
    }
    return current
  }

  getLink(): string {
    return this.getProvider().getLinkToProblem(this.identifier)
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
    return (
      this.problem.getProvider().node.id() +
      '/' +
      this.problem.identifier.toString()
    )
  }

  label(): string {
    return this.problem.identifier.toString()
  }

  uri(): string | undefined {
    return undefined
  }

  parent() {
    return this.problem.parent.node
  }

  hasChildren(): boolean {
    return this.problem.solutions.length !== 0
  }

  getChildren() {
    return this.problem.solutions.map((s) => s.node)
  }
}
