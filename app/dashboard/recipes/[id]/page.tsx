import { auth } from "@/lib/auth"
import { fetchRecipeByRecipeId } from "@/lib/actions/recipe.actions"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import RecipeDetailsClient from "./_components/recipe-details-client"

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session?.user.id) {
        redirect("/login")
    }

    const result = await fetchRecipeByRecipeId(id)
    
    if (!result.success || !result.data || result.data.length === 0) {
        redirect("/dashboard/recipes")
    }

    const recipe = result.data[0]

    return <RecipeDetailsClient recipe={recipe} />
}

export default Page