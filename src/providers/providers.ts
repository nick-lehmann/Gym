import { z } from 'zod'

export type Provider = {
  name: string
  identifier: z.ZodObject<any>
}
