'use client'

import { motion } from 'motion/react'
import RecipeGrid from "./recipe-grid"
import RecipeInput from "./recipe-input"
import { RecipeParam } from "@/lib/types/recipe.types"

const fadeUpVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] as const },
}

interface RecipesClientProps {
  recipes: RecipeParam[]
}

const RecipesClient = ({ recipes }: RecipesClientProps) => {
  return (
    <motion.div
      initial={fadeUpVariants.initial}
      animate={fadeUpVariants.animate}
      transition={fadeUpVariants.transition}
      className="space-y-10"
    >
        {/* Header Section */}
        <motion.div
          initial={fadeUpVariants.initial}
          animate={fadeUpVariants.animate}
          transition={{ ...fadeUpVariants.transition, delay: 0.1 }}
          className="text-center space-y-2"
        >
            <h1 className="text-2xl font-semibold tracking-tight">
              What are you Craving?
            </h1>
            <p className="text-sm text-muted-foreground">
              Generate personalized recipes based on your pantry items
            </p>
        </motion.div>
        
        {/* Recipe Input Section */}
        <motion.div
          initial={fadeUpVariants.initial}
          animate={fadeUpVariants.animate}
          transition={{ ...fadeUpVariants.transition, delay: 0.2 }}
        >
            <RecipeInput />
        </motion.div>
        
        {/* Existing Recipes Section */}
        <motion.div
          initial={fadeUpVariants.initial}
          animate={fadeUpVariants.animate}
          transition={{ ...fadeUpVariants.transition, delay: 0.3 }}
          className="space-y-6"
        >
            <div className="text-center space-y-2">
              <h2 className="text-xl font-semibold tracking-tight">
                Your Existing Recipes
              </h2>
              <p className="text-sm text-muted-foreground">
                Browse and manage your saved recipes
              </p>
            </div>
            <motion.div
              initial={fadeUpVariants.initial}
              animate={fadeUpVariants.animate}
              transition={{ ...fadeUpVariants.transition, delay: 0.4 }}
            >
                <RecipeGrid recipes={recipes} />
            </motion.div>
        </motion.div>
    </motion.div>
  )
}

export default RecipesClient
