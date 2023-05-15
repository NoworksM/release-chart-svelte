import * as z from 'zod'
import {ReleaseDtoSchema} from './release-dto'
import {createdPagedDtoSchema} from './paged'

export const GameDtoSchema = z.object({
    id: z.string().length(24).optional(),
    title: z.string().trim(),
    description: z.string().trim(),
    releases: z.array(ReleaseDtoSchema).min(1),
    developer: z.string().trim(),
    publisher: z.string().trim(),
    genres: z.array(z.string().trim()).min(1),
    posterId: z.string().length(24).optional(),
    updatedAt: z.string().optional(),
    createdAt: z.string().optional()
})

export type GameDto = z.infer<typeof GameDtoSchema>

export const GamePageSchema = createdPagedDtoSchema(GameDtoSchema)

export type GamePage = z.infer<typeof GamePageSchema>