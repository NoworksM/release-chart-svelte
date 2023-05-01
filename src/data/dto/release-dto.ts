import * as z from 'zod'

export const ReleaseDtoSchema = z.object({
    releaseDate: z.string().datetime(),
    platforms: z.array(z.string().trim()),
    regions: z.array(z.string().trim())
})

export type ReleaseDto = z.infer<typeof ReleaseDtoSchema>