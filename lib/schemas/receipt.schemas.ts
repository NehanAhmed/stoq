import z from "zod"

export const ExtractedItemSchema = z.object({
  name: z.string().min(1),
  quantity: z.string()
    .regex(/^\d+$/, "Quantity must be a positive integer")
    .transform((val) => String(parseInt(val, 10))) // Remove leading zeros
    .refine((val) => parseInt(val, 10) > 0, "Quantity must be greater than 0"),
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
export type ReceiptItem = z.infer<typeof ExtractedItemSchema>