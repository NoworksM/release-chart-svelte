import type {ObjectId} from 'mongodb'
import * as z from 'zod'
import {Role} from '$lib/data/roles'
import {DateTime} from 'luxon'
import { UserInfoDtoSchema } from '$lib/data/user'

export interface UserInfo {
    _id: ObjectId
    externalId?: string
    roles: string[]
    name: string
    password: string
    email: string
    createdAt?: Date
    updatedAt?: Date
}
export const UserInfoHashSchema = UserInfoDtoSchema
    .omit({createdAt: true, updatedAt: true, roles: true})
    .extend({
        createdAt: z.string().refine(v => DateTime.fromISO(v).isValid),
        updatedAt: z.string().refine(v => DateTime.fromISO(v).isValid),
        roles: z.preprocess((v) => (<string> v).split(','), z.array(Role))
    })

export type UserInfoHash = z.infer<typeof UserInfoHashSchema>