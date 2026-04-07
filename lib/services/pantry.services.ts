import { db } from "../db"
import { pantryItem } from "../schema"
import { eq } from "drizzle-orm"

export const hasPantryItems = async (houseId: string): Promise<boolean> => {
    const result = await db
        .select({ id: pantryItem.id })
        .from(pantryItem)
        .where(eq(pantryItem.houseId, houseId))
        .limit(1)

    return result.length > 0
}