import { db } from "../db"
import { pantryItem } from "../schema"
import { eq } from "drizzle-orm"

export const checkForPantryItems = async (houseId: string) : Promise<boolean> => {
    const pantryItems = await db
    .select()
    .from(pantryItem)
    .where(eq(pantryItem.houseId, houseId))
    
    if(pantryItems.length === 0){
        return true
    }
    
    return false
}