import { z } from 'zod'
import { ProblemIdentifier } from '../providers.js'

export const AOCPart = z.enum(['part1', 'part2'])
export type AOCPart = z.infer<typeof AOCPart>

export const Identifier = z.object({
  year: z.number(),
  day: z.number(),
  part: AOCPart,
})
export type Identifier = z.infer<typeof Identifier>

export const identifierFromParts = ([
  year,
  day,
  part,
]: string[]): Identifier => ({
  year: parseInt(year),
  day: parseInt(day),
  part: part as AOCPart,
})

export const IdentifierData = z.object({
  year: z.number(),
  day: z.number(),
})

export class AOCProblemIdentifier extends ProblemIdentifier<Identifier> {
  constructor(
    public readonly year: number,
    public readonly day: number,
    public readonly part: AOCPart
  ) {
    super()
  }

  compare(other: AOCProblemIdentifier): 0 | 1 | -1 {
    if (this.year < other.year) return -1
    if (this.year > other.year) return 1
    if (this.day < other.day) return -1
    if (this.day > other.day) return 1
    if (this.part < other.part) return -1
    if (this.part > other.part) return 1
    return 0
  }

  toString(): string {
    return `${this.year}-${this.day.toString().padStart(2, '0')}`
  }
}
