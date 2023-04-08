import { Provider } from '../providers/providers'
import { Problem } from './problem'
import { TreeItemType, TreeNode } from './tree'

/**
 * A group of problems.
 *
 * The children of a group are either groups themselves or specfic problems.
 * Every problem group should be runnable.
 * Every problem group is a tree item.
 * Problem groups might not have any documentation to them and might serve only organisation purposes.
 *
 * TODO: Add partial identifier.
 */
export class ProblemGroup {
  public readonly node = new ProblemGroupTreeItem(this)

  constructor(
    public readonly name: string,
    public readonly key: string,
    public parent: Provider | ProblemGroup,
    public subgroups: ProblemGroup[] = [],
    public problems: Problem[] = []
  ) {}
}

export class ProblemGroupTreeItem implements TreeNode<ProblemGroup> {
  type: TreeItemType = TreeItemType.ProblemGroup
  canHaveChildren = true

  constructor(public readonly problemGroup: ProblemGroup) {}

  // Refactor
  id(): string {
    let current: ProblemGroup = this.problemGroup

    const identifierParts = []

    // eslint-disable-next-line no-constant-condition
    while (true) {
      identifierParts.push(current.name)

      if (current.parent instanceof Provider) break
      current = current.parent
    }

    const partialProblemPart = identifierParts.reverse().join('-')
    const provider = current.parent as Provider

    return provider.node.id() + '/' + partialProblemPart
  }

  label(): string {
    return this.inner().name
  }

  uri(): string | undefined {
    return undefined
  }

  inner(): ProblemGroup {
    return this.problemGroup
  }

  parent(): TreeNode<any> | undefined {
    return this.problemGroup.parent.node
  }

  hasChildren(): boolean {
    return (
      this.problemGroup.subgroups.length > 0 ||
      this.problemGroup.problems.length > 0
    )
  }

  getChildren(): TreeNode<any>[] {
    if (this.problemGroup.subgroups.length > 0)
      return this.problemGroup.subgroups.map((group) => group.node)

    if (this.problemGroup.problems.length > 0)
      return this.problemGroup.problems.map((problem) => problem.node)

    return []
  }
}
