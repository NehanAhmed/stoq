import z from "zod"

export const ExtractedItemSchema = z.object({
  name: z.string().min(1),
  quantity: z.string().min(1),
  unit: z.string().nullable(),
})

export const ExtractionResponseSchema = z.object({
  items: z.array(ExtractedItemSchema).min(1),
})

export type ExtractedItem = z.infer<typeof ExtractedItemSchema>
export type ExtractionResponse = z.infer<typeof ExtractionResponseSchema>