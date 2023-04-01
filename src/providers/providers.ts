import { z } from 'zod'
import { BaseProviderConfig } from './config.js'

export abstract class Provider<
  Identifier = any,
  Config extends BaseProviderConfig = BaseProviderConfig
> {
  constructor(
    public readonly name: string,
    public readonly identifier: z.ZodObject<any>,
    public readonly config: Config,
    public readonly supportsSubmission: boolean = false
  ) {}

  abstract getLinkToProblem(identifier: Identifier): string

  /**
   * Returns the `{keys}` that are available in the `PathTemplates` for this provider.
   */
  identifierParts(): string[] {
    return Object.keys(this.identifier.shape)
  }
}
