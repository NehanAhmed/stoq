import { motion } from 'motion/react'
import { RecipeParam } from "@/lib/types/recipe.types"
import RecipeCard from "./recipe-card"
import { AiRecipeResponse } from "@/lib/schemas/recipe.schemas"



const fadeUpVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] as const },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const RecipeGrid = ({ recipes }: { recipes: RecipeParam[] }) => {
  return (
    <motion.div
      initial={fadeUpVariants.initial}
      animate={fadeUpVariants.animate}
      transition={fadeUpVariants.transition}
      variants={staggerContainer}
      className="grid grid-cols-1 gap-6 lg:grid-cols-3 md:grid-cols-2"
    >
      {recipes.map((recipe, index) => (
        <motion.div
          key={recipe.id}
          variants={fadeUpVariants}
          initial="initial"
          animate="animate"
          transition={{ ...fadeUpVariants.transition, delay: index * 0.1 }}
        >
          <RecipeCard {...recipe} />
        </motion.div>
      ))}
    </motion.div>
  )
}

export default RecipeGrid