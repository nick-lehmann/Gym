import { Provider } from './providers/providers.js'

/**
 * Marks the root node for the internal tree structure.
 */
export class Gym {
  constructor(public providers: Provider[]) {}
}
