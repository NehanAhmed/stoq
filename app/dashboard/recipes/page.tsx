import { auth } from "@/lib/auth"
import RecipeGrid from "../_components/recipe-grid"
import RecipeInput from "../_components/recipe-input"
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
  return (
    <div className="w-full">
        <div className="">
            <h1 className="text-2xl font-bold">What are you Craving.</h1>
        </div>
        <div className="mt-10">

        <RecipeInput />
        </div>
        
        <div className="mt-10 space-y-8">
            <h1 className="text-2xl font-bold">Your Existing Recipes.</h1>
            <div>
                <RecipeGrid recipes={result} />
            </div>
        </div>
    </div>
  )
}

export default Page