import * as vscode from 'vscode'
import { TreeItemType } from '../explorer.js'

export abstract class TreeNode<Inner> {
  abstract type: TreeItemType

  // VS Code wants to know in advance which tree items could be expanded and which never.
  // If set to true, the user will be able to expand the tree item.
  abstract canHaveChildren: boolean

  // The text shown to the user.
  abstract id(): string
  abstract label(): string
  uri(): vscode.Uri | undefined {
    return undefined
  }

  abstract inner(): Inner

  abstract parent(): TreeNode<any> | undefined
  abstract hasChildren(): boolean
  abstract getChildren(): TreeNode<any>[]
}
