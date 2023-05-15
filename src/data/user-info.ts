import type {ObjectId} from 'mongodb'
import * as z from 'zod'
import {Role} from './roles'
import {DateTime} from 'luxon'

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

export const UserInfoDtoSchema = z.object({
    externalId: z.string(),
    roles: z.array(Role),
    name: z.string(),
    email: z.string().email(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional()
})

export type UserInfoDto = z.infer<typeof UserInfoDtoSchema>


export const UserInfoHashSchema = UserInfoDtoSchema
    .omit({createdAt: true, updatedAt: true, roles: true})
    .extend({
        createdAt: z.string().refine(v => DateTime.fromISO(v).isValid),
        updatedAt: z.string().refine(v => DateTime.fromISO(v).isValid),
        roles: z.preprocess((v) => (<string> v).split(','), z.array(Role))
    })

export type UserInfoHash = z.infer<typeof UserInfoHashSchema>