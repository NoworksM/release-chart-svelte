import * as z from 'zod'

export const Role = z.enum(['admin'])

export type Role = z.infer<typeof Role>