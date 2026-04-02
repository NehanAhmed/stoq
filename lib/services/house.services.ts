import { db } from "../db";
import { House } from "../types/house.types";
import { house } from "../schema";

export async function createHouse(userId: string, formData: House) {
    try {
        const [houseRecord] = await db
    .insert(house)
    .values({...formData, userId})
    .returning();

    return {
        success: true,
        data: houseRecord
    };
    } catch (error) {
        return {
            success: false,
            error: error
        };
    }
    
}