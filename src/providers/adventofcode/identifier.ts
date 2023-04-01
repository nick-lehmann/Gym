import { z } from 'zod'

export const Identifier = z.object({
  year: z.number(),
  day: z.number(),
})
export type Identifier = z.infer<typeof Identifier>

export const identifierFromParts = ([year, day]: string[]): Identifier => ({
  year: parseInt(year),
  day: parseInt(day),
})
