"use server"

import { auth } from "../auth"
import { headers } from "next/headers"
import { House } from "../types/house.types"
import { createHouse } from "../services/house.services"

export const createHouseAction = async (formData: House) => {
    try {
        // Authentication
        const session = await auth.api.getSession({
            headers: await headers(),
        })
        const userId = session?.user?.id
        if (!userId) {
            throw new Error("User not found")
        }

        // Validation

        const { name, noOfMembers } = formData

        if(!name || !noOfMembers) {
            throw new Error("Name and number of members are required")
        }

        // Actual Call
        const result = await createHouse(userId,formData)
        if(!result.success) {
            throw new Error(result.error as string)
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