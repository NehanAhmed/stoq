
import { auth } from "@/lib/auth"
import RecipesClient from "../_components/recipes-client"
import { fetchAllRecipeByHouseId } from "@/lib/actions/recipe.actions"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { getHouseIdByUserId } from "@/lib/actions/receipt.actions"

const Page = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session?.user.id) {
        redirect("/login")
    }
    const houseId = await getHouseIdByUserId(session.user.id)
    if (!houseId) {
        redirect("/dashboard/onboarding")
    }
    const result = await fetchAllRecipeByHouseId(houseId)
    
    return <RecipesClient recipes={result} />
}

export default Page