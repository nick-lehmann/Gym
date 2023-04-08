import { ProgrammingLanguage } from '../config/language'
import { Problem } from './problem'
import { Solution } from './solution'
import { TreeItemType, TreeNode } from './tree'

/**
 * An `Implemenation` represents the attempt to solve a problem in a particular language.
 *
 * Please note that an `Implementation` is not a function that can be run. However, an `Implementation`
 * can have multiple solutions which in turn represents the different ways to solve a problem in this language.
 */
export class Implementation {
  public node: ImplementationNode = new ImplementationNode(this)

  constructor(
    public readonly problem: Problem,
    public readonly language: ProgrammingLanguage,
    public readonly solutions: Solution[]
  ) {}
}

export class ImplementationNode extends TreeNode<Implementation> {
  type = TreeItemType.Implementation
  canHaveChildren = false

  constructor(public readonly implementation: Implementation) {
    super()
  }

  inner() {
    return this.implementation
  }

  id(): string {
    return (
      this.implementation.problem.node.id() + '/' + this.implementation.language
    )
  }

  /**
   * A implementation only has a uri if all of its solutions have the same uri.
   */
  uri(): string | undefined {
    const paths = this.implementation.solutions.map((s) => s.absolutePath())

    if (paths.length === 0) return undefined
    if (paths.length === 1) return paths[0]

    return paths.every((u) => u === paths[0]) ? paths[0] : undefined
  }

  label(): string {
    return this.implementation.language
  }

  parent() {
    return this.implementation.problem.node
  }

  hasChildren() {
    return this.getChildren().length > 0
  }

  getChildren() {
    return this.implementation.solutions.map((s) => s.node)
  }
}
