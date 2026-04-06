'use server'

import { headers } from "next/headers"
import { auth } from "../auth"
import { getHouseIdByUserId } from "./receipt.actions"
import { hasPantryItems } from "../services/pantry.services"

export const checkIfFirstTime = async (): Promise<boolean> => {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        const userId = session?.user.id
        if (!userId) return false

        const houseId = await getHouseIdByUserId(userId)
        if (!houseId) return false

        const hasPantry = await hasPantryItems(houseId)
        return !hasPantry

    } catch (error) {
        console.error('[checkIfFirstTime]', error)
        return false
    }
}