import { Provider } from '../providers/providers'

/**
 * Marks the root node for the internal tree structure.
 */
export class Gym {
  constructor(public providers: Provider[]) {}
}
