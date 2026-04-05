import z from "zod"

export const ExtractedItemSchema = z.object({
  name: z.string().min(1),
  quantity: z.preprocess(
    (val) => (typeof val === "string" ? parseFloat(val) : val),
    z.number().positive().finite()
  ),
  unit: z.enum(["g", "kg", "ml", "l", "oz", "lb", "pcs", "pack", "box", "bottle", "can", "jar", "bag"]).nullable(),
})

export const ExtractionResponseSchema = z.object({
  items: z.array(ExtractedItemSchema).min(1),
})

export const SavePantryItemsToDatabaseParams = z.object({
  items: z.array(ExtractedItemSchema).min(1),
})




export type ExtractedItem = z.infer<typeof ExtractedItemSchema>
export type ExtractionResponse = z.infer<typeof ExtractionResponseSchema>