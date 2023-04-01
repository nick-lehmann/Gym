import * as vscode from 'vscode'
import { Problem } from '../problem.js'
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
  constructor(
    public readonly name: string,
    public readonly parts: string[],
    public readonly config: Config,
    public problems: Problem[] = [],
    public watchers: vscode.FileSystemWatcher[] = [],
    public readonly supportsSubmission: boolean = false
  ) {}

  abstract getLinkToProblem(identifier: Identifier): string

  /**
   * Returns the `{keys}` that are available in the `PathTemplates` for this provider.
   */
  identifierParts(): string[] {
    return this.parts
  }

  abstract identifierFromParts(parts: string[]): Identifier
}
