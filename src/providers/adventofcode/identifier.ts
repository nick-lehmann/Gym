import { z } from 'zod'

export const AOCProblemIdentifier = z.object({
  year: z.number(),
  day: z.number(),
})
export type ProblemIdentifier = z.infer<typeof AOCProblemIdentifier>

export const identifierFromParts = ([
  year,
  day,
]: string[]): ProblemIdentifier => ({
  year: parseInt(year),
  day: parseInt(day),
})
