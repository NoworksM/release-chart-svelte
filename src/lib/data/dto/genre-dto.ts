import * as z from 'zod'

export const GenreDtoSchema = z.object({
    name: z.string(),
})

export type GenreDto = z.infer<typeof GenreDtoSchema>