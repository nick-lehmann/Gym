/**
 * Set as the `contextValue` of a `TreeItem` to differentiate the different types of tree nodes.
 *
 * This value can be referenced in the `package.json` `contribute` field to provide context actions
 * only for some types of tree nodes.
 */
export enum TreeItemType {
  Provider = 'provider',
  Problem = 'problem',
  ProblemGroup = 'problem-group',
  Solution = 'solution',
  Implementation = 'implementation',
  Testcase = 'testcase',
}

export abstract class TreeNode<Inner> {
  abstract type: TreeItemType

  // VS Code wants to know in advance which tree items could be expanded and which never.
  // If set to true, the user will be able to expand the tree item.
  abstract canHaveChildren: boolean

  // The text shown to the user.
  abstract id(): string
  abstract label(): string
  uri(): string | undefined {
    return undefined
  }

  abstract inner(): Inner

  abstract parent(): TreeNode<any> | undefined
  abstract hasChildren(): boolean
  abstract getChildren(): TreeNode<any>[]
}
