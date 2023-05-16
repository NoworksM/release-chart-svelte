import * as z from 'zod'

export const ObjectIdSchema = z.string().regex(/^[a-fA-F0-9]{24}$/)