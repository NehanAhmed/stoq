"use client";

import { motion } from "motion/react";
import { IconArrowLeft, IconChefHat, IconClock, IconUsers } from "@tabler/icons-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import RecipeHeader from "./recipe-header";
import IngredientsList from "../_components/ingredients-list";
import InstructionsList from "../_components/instructions-list";

type RecipeIngredient = {
  name: string;
  quantity: string;
  unit: string;
};

type Recipe = {
  id: string;
  name: string;
  tagline: string;
  ingredients: RecipeIngredient[];
  instructions: string;
  houseId: string;
  createdAt: Date;
  updatedAt: Date;
};

type RecipeDetailsClientProps = {
  recipe: Recipe;
};

const fadeUpVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function RecipeDetailsClient({ recipe }: RecipeDetailsClientProps) {
  // Parse ingredients and instructions from stored data
  const ingredients = recipe.ingredients;
  
  const instructions = recipe.instructions.split('\n').filter(step => step.trim() !== '');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto px-4 py-8 max-w-4xl"
    >
      {/* Back Navigation */}
      <motion.div
        initial={fadeUpVariants.initial}
        animate={fadeUpVariants.animate}
        transition={{ ...fadeUpVariants.transition, delay: 0 }}
        className="mb-8"
      >
        <Link href="/dashboard/recipes">
          <Button variant="ghost" className="gap-2">
            <IconArrowLeft className="h-4 w-4" />
            Back to Recipes
          </Button>
        </Link>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-12"
      >
        {/* Recipe Header */}
        <motion.div variants={fadeUpVariants}>
          <RecipeHeader name={recipe.name} tagline={recipe.tagline} />
        </motion.div>

        <Separator className="my-8" />

        {/* Quick Stats */}
        <motion.div 
          variants={fadeUpVariants}
          className="flex flex-wrap gap-6 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <IconClock className="h-4 w-4" />
            <span>Ready when you are</span>
          </div>
          <div className="flex items-center gap-2">
            <IconUsers className="h-4 w-4" />
            <span>Serves 4</span>
          </div>
        </motion.div>

        <Separator className="my-8" />

        {/* Ingredients Section */}
        <motion.div variants={fadeUpVariants}>
          <IngredientsList ingredients={ingredients} />
        </motion.div>

        <Separator className="my-8" />

        {/* Instructions Section */}
        <motion.div variants={fadeUpVariants}>
          <InstructionsList instructions={instructions} />
        </motion.div>
        <div  className="w-full">
          <Button className="w-full">Cook <IconChefHat /></Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
