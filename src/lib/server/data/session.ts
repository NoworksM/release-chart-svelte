import type {DBRef} from 'mongodb'
import * as z from 'zod'

export interface Session {
    token: string
    expiresAt: Date
    user: DBRef
}

export const SessionHashSchema = z.object({
    token: z.string(),
    expiresAt: z.string(),
    userId: z.string().length(24).regex(/^[0-9a-fA-F]{24}]$/)
})

export type SessionHash = z.infer<typeof SessionHashSchema>