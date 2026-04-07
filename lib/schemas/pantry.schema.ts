import { z } from "zod";

export const pantryItemSchema = z.object({
  id: z.string().uuid(),
  houseId: z.string().uuid(),
  name: z.string().nonempty(),
  quantity: z.string().nonempty(),
  unit: z.string().nonempty(),
  stockStatus: z.enum(["IN_STOCK", "LOW", "OUT"]).default("IN_STOCK"),
  category: z.enum(["PRODUCE", "DAIRY", "DRY_GOODS", "BEVERAGES", "CONDIMENTS", "OTHER"]).default("OTHER"),
  addedVia: z.enum(["RECEIPT", "MANUAL"]).default("MANUAL"),
  lastRestockedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  
})

export type PantryItem = z.infer<typeof pantryItemSchema>
