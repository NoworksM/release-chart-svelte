import * as z from 'zod'
import {ObjectIdSchema} from '$lib/data/index'

export const RegionDtoSchema = z.object({
    id: ObjectIdSchema,
    name: z.string(),
    shortName: z.string(),
    iconUnicode: z.string().max(4)
})

export type RegionDto = z.infer<typeof RegionDtoSchema>

export const RegionsSchema = z.enum(['NA', 'EU', 'JP'])

export type Regions = z.infer<typeof RegionsSchema>