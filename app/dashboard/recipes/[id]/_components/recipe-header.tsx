"use client";

import { motion } from "motion/react";
import { IconChefHat } from "@tabler/icons-react";

type RecipeHeaderProps = {
  name: string;
  tagline: string;
};

const fadeUpVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
};

export default function RecipeHeader({ name, tagline }: RecipeHeaderProps) {
  return (
    <motion.div
      initial={fadeUpVariants.initial}
      animate={fadeUpVariants.animate}
      transition={fadeUpVariants.transition}
      className="text-center space-y-4"
    >
      <div className="flex justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            duration: 0.6, 
            ease: [0.25, 0.1, 0.25, 1] as const,
            delay: 0.2 
          }}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"
        >
          <IconChefHat className="h-8 w-8 text-primary" />
        </motion.div>
      </div>
      
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.5, 
          ease: [0.25, 0.1, 0.25, 1] as const,
          delay: 0.3 
        }}
        className="text-4xl font-bold tracking-tight sm:text-5xl"
      >
        {name}
      </motion.h1>
      
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.5, 
          ease: [0.25, 0.1, 0.25, 1] as const,
          delay: 0.4 
        }}
        className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
      >
        {tagline}
      </motion.p>
    </motion.div>
  );
}
