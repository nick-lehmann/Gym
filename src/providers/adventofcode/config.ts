import { z } from "zod"

export const AdventOfCodeConfig = z.object({
  session: z.string(),
})
export type AdventOfCodeConfig = z.infer<typeof AdventOfCodeConfig>;
