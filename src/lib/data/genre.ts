import * as z from 'zod'
import {ObjectIdSchema} from '$lib/data/index'

export const GenreDtoSchema = z.object({
    id: ObjectIdSchema.optional(),
    name: z.string(),
    shortName: z.string().optional()
})

export type GenreDto = z.infer<typeof GenreDtoSchema>