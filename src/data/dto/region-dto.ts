import * as z from 'zod'

export const RegionDtoSchema = z.object({
    name: z.string(),
})

export type RegionDto = z.infer<typeof RegionDtoSchema>