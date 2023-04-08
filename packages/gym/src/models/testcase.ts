import { Solution } from './solution'
import { TreeItemType, TreeNode } from './tree'

/**
 * A `testcase` is a single solution combined with a pair of input and output.
 */
export class Testcase {
  public node = new TestcaseNode(this)

  constructor(public solution: Solution, public name: string) {}
}

export class TestcaseNode implements TreeNode<Testcase> {
  type: TreeItemType = TreeItemType.Testcase
  canHaveChildren = false

  constructor(public testcase: Testcase) {}

  uri(): string | undefined {
    return this.testcase.solution.node.uri()
  }

  id(): string {
    return this.testcase.solution.node.id() + '/' + this.testcase.name
  }

  label(): string {
    return this.testcase.name
  }

  inner(): Testcase {
    return this.testcase
  }

  parent(): TreeNode<any> | undefined {
    return this.testcase.solution.node
  }

  // Unimplemented, since `canHaveChildren` is false.
  hasChildren(): boolean {
    throw new Error('Method not implemented.')
  }

  // Unimplemented, since `canHaveChildren` is false.
  getChildren(): TreeNode<any>[] {
    throw new Error('Method not implemented.')
  }
}
