'use server'
import { headers } from "next/headers"
import { auth } from "../auth"
import { extractReceiptItems } from "../services/receipt.services"
import { SavePantryItemsToDatabaseParams } from "../schemas/receipt.schemas"
import { db } from "../db"
import { house, pantryItem } from "../schema"
import { eq } from "drizzle-orm"

export async function scanReceiptAction(formData: FormData) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        })

        const userId = session?.user.id
        if (!userId) {
            return { success: false, error: "User not authenticated" }
        }

        const file = formData.get("file") as File
        if (!file) return { success: false, error: "No file provided" }

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

export async function savePantryItemsToDatabase(items: unknown[] |unknown){
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
            return { success: false, error: "Invalid items format" }
        }
        

        const houseId = await getHouseIdByUserId(userId)
        if (!houseId) {
            return { success: false, error: "House not found for user" }
        }
        
        const data = parsedList.data.items.map(item => ({
            ...item,
            unit: item.unit ?? "",
            houseId
        }))

        const [pantryItems] = await db
        .insert(pantryItem)
        .values(data)
        .returning()

        return { success: true, data: pantryItems }

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
            .limit(1)
        
        return houseData?.id
    } catch (error) {
        console.error("Error getting house id:", error)
        return null
    }
}

