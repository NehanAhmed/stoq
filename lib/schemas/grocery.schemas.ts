import { z } from "zod"

export const ManualGroceryItemSchema = z.object({
  name: z.string().trim().min(1, "Item name is required"),
 quantity: z.string()
  .regex(/^\d+$/, "Quantity must be a positive integer")
  .refine((val) => parseInt(val, 10) > 0, "Quantity must be greater than 0"),
  unit: z.enum(["g", "kg", "ml", "l", "oz", "lb", "pcs", "pack", "box", "bottle", "can", "jar", "bag"]).nullable(),
})

export const ManualGroceryFormSchema = z.object({
  items: z.array(ManualGroceryItemSchema).min(1, "At least one item is required"),
})

export type ManualGroceryItem = z.infer<typeof ManualGroceryItemSchema>
export type ManualGroceryForm = z.infer<typeof ManualGroceryFormSchema>
