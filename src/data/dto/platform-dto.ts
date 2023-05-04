import * as z from 'zod'

export const PlatformDtoSchema = z.object({
    id: z.string().length(24).regex(/^[0-9a-f]{24}$/).optional(),
    name: z.string(),
    shortName: z.string(),
    manufacturer: z.string(),
    priority: z.coerce.number().optional(),
    hasIcon: z.coerce.boolean().optional().default(false),
})

export type PlatformDto = z.infer<typeof PlatformDtoSchema>