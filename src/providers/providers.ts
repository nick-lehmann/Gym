import * as vscode from 'vscode'
import { TreeItemType } from '../problem-tree.js'
import { Problem } from '../problem.js'
import { TreeNode } from '../tree.js'
import { BaseProviderConfig } from './config.js'

export abstract class ProblemIdentifier<
  T extends Record<string, unknown> = Record<string, unknown>
> {
  abstract compare(other: ProblemIdentifier<T>): -1 | 0 | 1
  equals(other: ProblemIdentifier<T>): boolean {
    return this.compare(other) === 0
  }

  abstract toString(): string
}

export abstract class Provider<
  Identifier extends ProblemIdentifier = ProblemIdentifier,
  Config extends BaseProviderConfig = BaseProviderConfig
> {
  public node: ProviderNode

  constructor(
    public readonly name: string,
    public readonly parts: string[],
    public readonly config: Config,
    public problems: Problem[] = [],
    public watchers: vscode.FileSystemWatcher[] = [],
    public readonly supportsSubmission: boolean = false
  ) {
    this.node = new ProviderNode(this)
  }

  abstract getLinkToProblem(identifier: Identifier): string

  /**
   * Returns the `{keys}` that are available in the `PathTemplates` for this provider.
   */
  identifierParts(): string[] {
    return this.parts
  }

  abstract identifierFromParts(parts: string[]): Identifier
}

export class ProviderNode implements TreeNode<Provider> {
  type: TreeItemType.Provider = TreeItemType.Provider
  canHaveChildren = true

  constructor(public provider: Provider) {}

  id(): string {
    return `providers/${this.provider.name}`
  }

  label(): string {
    return this.provider.name
  }

  uri(): vscode.Uri | undefined {
    return undefined
  }

  inner(): Provider {
    return this.provider
  }

  parent() {
    return undefined
  }

  hasChildren(): boolean {
    return this.provider.problems.length !== 0
  }

  getChildren() {
    return this.provider.problems.map((p) => p.node)
  }
}
