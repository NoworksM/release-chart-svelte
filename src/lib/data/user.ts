import * as z from 'zod'
import { Role } from './roles'

export const UserInfoDtoSchema = z.object({
    externalId: z.string(),
    roles: z.array(Role),
    name: z.string(),
    email: z.string().email(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional()
})

export type UserInfoDto = z.infer<typeof UserInfoDtoSchema>