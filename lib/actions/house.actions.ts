"use server"

import { auth } from "../auth"
import { headers } from "next/headers"
import { CreateHouseFormData } from "../types/house.types"
import { createHouse, updateOnboardingStatusByUserId } from "../services/house.services"
import { createHouseSchema } from "../schemas/house.schema"

export const createHouseAction = async (formData: unknown) => {
    try {
        // Authentication
        const session = await auth.api.getSession({
            headers: await headers()
        })
        const userId = session?.session?.userId
        if (!userId) {
            throw new Error("User not found")
        }

        // Validation

       const parsedResult = createHouseSchema.safeParse(formData)
       if(!parsedResult.success) {
        throw new Error(parsedResult.error.message)
       }

        // Actual Call
        const result = await createHouse(userId,parsedResult.data as CreateHouseFormData)
        if(!result.success) {
            throw new Error(result.error as string)
        }
        const updateOnboardingStatus = await updateOnboardingStatusByUserId(userId)
        if(!updateOnboardingStatus.success) {
            throw new Error(updateOnboardingStatus.error as string)
        }
        return {
            success: true,
            data: result.data
        }
        
        

    } catch (error) {
        return {
            success: false,
            error: error
        }
    }
}