import { z } from 'zod'
import { ProblemIdentifier } from '../providers.js'

export const Identifier = z.object({
  year: z.number(),
  day: z.number(),
})
export type Identifier = z.infer<typeof Identifier>

export const identifierFromParts = ([year, day]: string[]): Identifier => ({
  year: parseInt(year),
  day: parseInt(day),
})

export const IdentifierData = z.object({
  year: z.number(),
  day: z.number(),
})

export class AOCProblemIdentifier extends ProblemIdentifier<Identifier> {
  constructor(public readonly year: number, public readonly day: number) {
    super()
  }

  compare(other: AOCProblemIdentifier): 0 | 1 | -1 {
    if (this.year < other.year) return -1
    if (this.year > other.year) return 1
    if (this.day < other.day) return -1
    if (this.day > other.day) return 1
    return 0
  }

  toString(): string {
    return `${this.year}-${this.day}`
  }
}
