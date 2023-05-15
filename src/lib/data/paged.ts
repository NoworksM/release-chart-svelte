import * as z from 'zod'

export function createdPagedDtoSchema<TSchema extends z.ZodTypeAny>(itemSchema: TSchema) {
    return z.object({
        page: z.number().int().gte(1),
        pages: z.number().int().gte(1),
        data: z.array(itemSchema)
    })
}