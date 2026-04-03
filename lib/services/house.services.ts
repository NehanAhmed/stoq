import { db } from "../db";
import { CreateHouseFormData } from "../types/house.types";
import { house, user } from "../schema";
import { eq } from "drizzle-orm";

export async function createHouse(userId: string, formData: CreateHouseFormData) {
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

export async function updateOnboardingStatusByUserId(userId: string) {
    try {
        const [userRecord] = await db
    .update(user)
    .set({ onboarding: true })
    .where(eq(user.id, userId))
    .returning();

    return {
        success: true,
        data: userRecord
    };
    } catch (error) {
        return {
            success: false,
            error: error
        };
    }
}