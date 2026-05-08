'use server'
import { headers } from "next/headers"
import { auth } from "../auth"
import { extractReceiptItems } from "../services/receipt.services"
import { SavePantryItemsToDatabaseParams, ReceiptItem } from "../schemas/receipt.schemas"
import { db } from "../db"
import { house, pantryItem } from "../schema"
import { eq, desc, sql } from "drizzle-orm"
import { ExtractionResult } from "../services/receipt.services"

// Normalize receipt items: aggregate duplicates by name+unit, detect unit mismatches
function normalizeReceiptItems(items: ReceiptItem[]): { normalized: ReceiptItem[]; unitMismatches: string[] } {
  const grouped = new Map<string, ReceiptItem & { totalQuantity: number }>()
  const unitMismatches: string[] = []

  for (const item of items) {
    const key = `${item.name.toLowerCase()}-${item.unit}`
    const existing = grouped.get(key)

    if (existing) {
      existing.totalQuantity += parseFloat(item.quantity.toString())
    } else {
      // Check for unit mismatch with different key but same name
      for (const [, entry] of grouped) {
        if (entry.name.toLowerCase() === item.name.toLowerCase() && entry.unit !== item.unit) {
          unitMismatches.push(item.name)
          break
        }
      }
      grouped.set(key, { ...item, totalQuantity: parseFloat(item.quantity.toString()) })
    }
  }

  const normalized = Array.from(grouped.values()).map(item => ({
    name: item.name,
    quantity: item.totalQuantity.toString(),
    unit: item.unit,
  }))

  return { normalized, unitMismatches }
}

export async function scanReceiptAction(formData: FormData): Promise<ExtractionResult> {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        })

        const userId = session?.user.id
        if (!userId) {
            return { success: false, error: "User not authenticated" }
        }

        const fileValue = formData.get("file")
        if (!fileValue || !(fileValue instanceof File)) {
            return { success: false, error: "No valid file provided" }
        }
        const file = fileValue

        if (file.size > 10 * 1024 * 1024) {
            return { success: false, error: "File size too large" }
        }

        if (!file.type.startsWith("image/")) {
            return { success: false, error: "File must be an image" }
        }


        const mimeType = file.type
        const arrayBuffer = await file.arrayBuffer()
        const base64 = Buffer.from(arrayBuffer).toString("base64")

        return extractReceiptItems(base64, mimeType)



    } catch (error) {
        console.error("Error scanning receipt:", error)
        return { success: false, error: "Failed to scan receipt" }
    }
}

export async function savePantryItemsToDatabase(items: unknown[] | unknown) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        })

        const userId = session?.user.id
        if (!userId) {
            return { success: false, error: "User not authenticated" }
        }

        const parsedList = SavePantryItemsToDatabaseParams.safeParse(items)
        if (!parsedList.success) {
            console.error('Parse error:', parsedList.error)
            return { success: false, error: "Invalid items format" }
        }


        const houseId = await getHouseIdByUserId(userId)
        if (!houseId) {
            return { success: false, error: "House not found for user" }
        }

        // Normalize items to handle duplicates and unit mismatches
        const { normalized, unitMismatches } = normalizeReceiptItems(parsedList.data.items)

        if (unitMismatches.length > 0) {
            console.warn("Unit mismatches detected:", unitMismatches)
        }

        const data = normalized.map(item => ({
            name: item.name.toLowerCase(),
            quantity: String(item.quantity),
            unit: item.unit ?? "",
            houseId,
            addedVia: "RECEIPT" as const
        }))

        const result = await db
            .insert(pantryItem)
            .values(data)
            .onConflictDoUpdate({
                target: [pantryItem.houseId, pantryItem.name],
                set: {
                    quantity: sql`(${pantryItem.quantity}::float + excluded.quantity::float)::text`,
                    stockStatus: sql`'IN_STOCK'`,
                    addedVia: sql`'RECEIPT'`,
                    lastRestockedAt: sql`now()`,
                    updatedAt: sql`now()`,
                },
            })
            .returning()

        return { success: true, data: result, unitMismatches: unitMismatches.length > 0 ? unitMismatches : undefined }

    } catch (error) {
        console.error("Error saving pantry items:", error)
        return { success: false, error: "Failed to save pantry items" }
    }
}

export const getHouseIdByUserId = async (userId: string) => {
    try {
        const [houseData] = await db
            .select()
            .from(house)
            .where(eq(house.userId, userId))
            .orderBy(desc(house.updatedAt))
            .limit(1)

        return houseData?.id
    } catch (error) {
        console.error("Error getting house id:", error)
        return null
    }
}

