import { z } from 'zod'
import { Problem } from '../problem.js'

export type Provider = {
  name: string
  identifier: z.ZodObject<any>

  getLinkToProblem: (problem: Problem) => string
}
