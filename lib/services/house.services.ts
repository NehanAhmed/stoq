import { db } from "../db";
import { CreateHouseFormData } from "../types/house.types";
import { house, user } from "../schema";
import { eq } from "drizzle-orm";

export async function createHouse(userId: string, formData: CreateHouseFormData) {
    try {
        const [houseRecord] = await db
            .insert(house)
            .values({ ...formData, userId })
            .returning();

        return {
            success: true,
            data: houseRecord
        };
    } catch (error) {
        return {
            success: false,
            errorMessage: error instanceof Error ? error.message : String(error)
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
            errorMessage: error instanceof Error ? error.message : String(error)
        };
    }
}

export async function createHouseAndCompleteOnboarding(
    userId: string,
    formData: CreateHouseFormData
) {
    try {
        const result = await db.transaction(async (tx) => {
            const [houseRecord] = await tx
                .insert(house)
                .values({
                    name: formData.name,
                    noOfMembers: formData.noOfMembers,
                    userId
                })
                .returning();

            if (!houseRecord) {
                throw new Error("Failed to create house")
            }

            const [userRecord] = await tx
                .update(user)
                .set({ onboarding: true })
                .where(eq(user.id, userId))
                .returning();

            if (!userRecord) {
                throw new Error("Failed to update user onboarding status")
            }

            return { houseRecord, userRecord }
        })

        return {
            success: true,
            data: result
        };
    } catch (error) {
        return {
            success: false,
            errorMessage: error instanceof Error ? error.message : String(error)
        };
    }
}