'use server'

import { headers } from "next/headers"
import { auth } from "../auth"
import { db } from "../db"
import { pantryItem } from "../schema"
import { ManualGroceryItem, ManualGroceryItemSchema } from "../schemas/grocery.schemas"
import { getHouseIdByUserId } from "./receipt.actions"
import { z } from "zod"
import { sql } from "drizzle-orm"

const SaveManualItemsParamsSchema = z.array(ManualGroceryItemSchema).min(1)

interface SaveResult {
  success: boolean
  data?: typeof pantryItem.$inferSelect[]
  error?: string
}

export async function savePantryItemsAction(items: ManualGroceryItem[]): Promise<SaveResult> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    const userId = session?.user.id
    if (!userId) {
      return { success: false, error: "User not authenticated" }
    }

    const parsedItems = SaveManualItemsParamsSchema.safeParse(items)
    if (!parsedItems.success) {
      console.error('[savePantryItemsAction] Parse error:', parsedItems.error)
      return { success: false, error: "Invalid items format" }
    }

    const houseId = await getHouseIdByUserId(userId)
    if (!houseId) {
      return { success: false, error: "House not found for user" }
    }

    const data = parsedItems.data.map(item => ({
      name: item.name.toLowerCase(),
      quantity: String(item.quantity),
      unit: item.unit ?? "",
      houseId,
      addedVia: "MANUAL" as const,
      stockStatus: "IN_STOCK" as const,
      category: "OTHER" as const,
    }))

    const savedItems = await db
      .insert(pantryItem)
      .values(data)
      .onConflictDoUpdate({
        target: [pantryItem.houseId, pantryItem.name],
        set: {
          quantity: sql`(${pantryItem.quantity}::float + excluded.quantity::float)::text`,
          stockStatus: sql`'IN_STOCK'`,
          addedVia: sql`'MANUAL'`,
          lastRestockedAt: sql`now()`,
          updatedAt: sql`now()`,
        },
      })
      .returning()

    return { success: true, data: savedItems }

  } catch (error) {
    console.error("[savePantryItemsAction] Error:", error)
    return { success: false, error: "Failed to save pantry items" }
  }
}
