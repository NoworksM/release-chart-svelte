import * as z from 'zod'

export const PlatformDtoSchema = z.object({
    name: z.string(),
    shortName: z.string(),
    manufacturer: z.string(),
})

export type PlatformDto = z.infer<typeof PlatformDtoSchema>