"use client";

import { motion } from "motion/react";
import { IconShoppingCart } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Ingredient = {
  name: string;
  quantity: string;
  unit: string;
};

type IngredientsListProps = {
  ingredients: Ingredient[];
};

const fadeUpVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

export default function IngredientsList({ ingredients }: IngredientsListProps) {
  return (
    <motion.div
      initial={fadeUpVariants.initial}
      animate={fadeUpVariants.animate}
      transition={fadeUpVariants.transition}
      className="space-y-6"
    >
      <Card className="border-0 shadow-none">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                duration: 0.4, 
                ease: [0.25, 0.1, 0.25, 1] as const,
                delay: 0.1 
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10"
            >
              <IconShoppingCart className="h-5 w-5 text-primary" />
            </motion.div>
            Ingredients
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid gap-3 sm:grid-cols-2"
          >
            {ingredients.map((ingredient, index) => (
              <motion.div
                key={`${ingredient.name}-${index}`}
                variants={fadeUpVariants}
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
                className="group"
              >
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-200 hover:shadow-md hover:border-primary/20">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {ingredient.name}
                      </h3>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge 
                          variant="secondary" 
                          className="text-xs font-medium"
                        >
                          {ingredient.quantity} {ingredient.unit}
                        </Badge>
                      </div>
                    </div>
                    <motion.div
                      className="h-2 w-2 rounded-full bg-muted-foreground/30 group-hover:bg-primary transition-colors"
                      whileHover={{ scale: 1.5 }}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
