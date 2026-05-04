import { RecipeParam } from "@/lib/types/recipe.types"
import RecipeCard from "./recipe-card"
import { AiRecipeResponse } from "@/lib/schemas/recipe.schemas"



const RecipeGrid = ({ recipes }: { recipes: RecipeParam[] }) => {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 md:grid-cols-2  ">
      {recipes.map((val) => (
        <RecipeCard key={val.id} {...val} />
      ))}

    </div>
  )
}

export default RecipeGrid