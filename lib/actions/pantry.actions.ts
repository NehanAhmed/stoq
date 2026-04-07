'use server'

import { headers } from "next/headers"
import { auth } from "../auth"
import { getHouseIdByUserId } from "./receipt.actions"
import { getAllPantryItems, hasPantryItems } from "../services/pantry.services"

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

export const getPantryItemsByHouseId = async (houseId:string) => {
try {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if(!session?.session) {
        return { success: false, error: 'Unauthorized' }
    }

   const items = await getAllPantryItems(houseId)

    return { success: true, data: items }
} catch (error) {
    console.error('[getPantryItems]', error)
    return { success: false, error: 'Failed to fetch pantry items' }
}
}