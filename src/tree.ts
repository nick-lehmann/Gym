import { TreeItemType } from './problem-tree.js'
import { Problem } from './problem.js'
import { Provider } from './providers/providers.js'
import { Solution } from './solution.js'

interface ResourceIdentifier {
  deserialize(): string
  serialize(input: string): ResourceIdentifier | undefined
}

interface TreeNodeContent extends Record<TreeItemType, unknown> {
  [TreeItemType.Provider]: Provider
  [TreeItemType.Problem]: Problem
  [TreeItemType.Solution]: Solution
}

interface TreeNode<T extends TreeItemType, Children> {
  type: T

  inner(): TreeNodeContent[T]

  parent(): TreeNode<any, TreeNode<T, Children>> | undefined
  hasChildren(): boolean
  getChildren(): Promise<TreeNode<any, Children>[]>
}
