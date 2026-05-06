import { motion } from 'motion/react'
import { RecipeParam } from "@/lib/types/recipe.types"
import RecipeCard from "./recipe-card"
import { AiRecipeResponse } from "@/lib/schemas/recipe.schemas"
import { fadeUpVariants, staggerContainer } from "@/lib/animations"

const RecipeGrid = ({ recipes }: { recipes: RecipeParam[] }) => {
  if (recipes.length === 0) {
    return (
      <motion.div
        initial={fadeUpVariants.initial}
        animate={fadeUpVariants.animate}
        transition={fadeUpVariants.transition}
        className="text-center py-12"
      >
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <svg className="h-8 w-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">No recipes yet</h3>
            <p className="text-sm text-muted-foreground">
              Generate your first recipe above to get started
            </p>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="grid grid-cols-1 gap-6 lg:grid-cols-3 md:grid-cols-2"
    >
      {recipes.map((recipe, index) => (
        <motion.div
          key={recipe.id}
          variants={fadeUpVariants}
          initial="initial"
          animate="animate"
        >
          <RecipeCard {...recipe} />
        </motion.div>
      ))}
    </motion.div>
  )
}

export default RecipeGrid