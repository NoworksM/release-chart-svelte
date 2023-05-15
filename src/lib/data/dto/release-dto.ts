import * as z from 'zod'

const dateRegex = /^\d{4}-\d{2}-\d{2}/

const DateValidator = z.string().refine(v => dateRegex.test(v), v => ({message: `${v} is not a valid date in the format of yyyy-MM-dd`}))

export const ReleaseDtoSchema = z.object({
    releaseDate: DateValidator,
    platforms: z.array(z.string().trim()),
    regions: z.array(z.string().trim())
})

export type ReleaseDto = z.infer<typeof ReleaseDtoSchema>