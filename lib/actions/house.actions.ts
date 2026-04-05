"use server"

import { auth } from "../auth"
import { headers } from "next/headers"
import { createHouseSchema } from "../schemas/house.schema"
import { createHouseAndCompleteOnboarding } from "../services/house.services"

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

        // Transactional call
        const result = await createHouseAndCompleteOnboarding(userId, parsedResult.data)
        if(!result.success) {
            throw new Error(result.errorMessage)
        }
        
        return {
            success: true,
            data: result.data
        }
    } catch (error) {
        return {
            success: false,
            error: {
                message: error instanceof Error ? error.message : String(error),
                name: error instanceof Error ? error.name : 'Error'
            }
        }
    }
}