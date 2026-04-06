'use server'

import { headers } from "next/headers"
import { auth } from "../auth"
import { getHouseIdByUserId } from "./receipt.actions"
import { checkForPantryItems } from "../services/pantry.services"

export const checkIfFirstTime = async () => {
try {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    const userId = session?.user.id
    if(!userId){
        return false
    }
    
    const houseId = await getHouseIdByUserId(userId)

    if(!houseId){
        return false
    }

    const isFirstTime  = await checkForPantryItems(houseId)
    
    if(isFirstTime){
        return true
    }

    return false

} catch (error) {
    
}
}