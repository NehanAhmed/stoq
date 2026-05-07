"use client";

import { motion } from "motion/react";
import { IconCheck, IconCircle } from "@tabler/icons-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type InstructionsListProps = {
  instructions: string[];
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

export default function InstructionsList({ instructions }: InstructionsListProps) {
  return (
    <motion.div
      initial={fadeUpVariants.initial}
      animate={fadeUpVariants.animate}
      transition={fadeUpVariants.transition}
      className="space-y-6"
    >
      <Card className="border-0 shadow-none">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl">
            Instructions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-4"
          >
            {instructions.map((instruction, index) => (
              <motion.div
                key={`instruction-${index}`}
                variants={fadeUpVariants}
                whileHover={{ 
                  x: 4,
                  transition: { duration: 0.2 }
                }}
                className="group"
              >
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-200 hover:shadow-md hover:border-primary/20">
                  <CardContent className="flex gap-4 p-4">
                    <motion.div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 mt-0.5"
                      whileHover={{ 
                        scale: 1.1,
                        backgroundColor: "var(--primary)"
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ 
                          duration: 0.3, 
                          delay: index * 0.1 + 0.5,
                          ease: [0.25, 0.1, 0.25, 1] as const
                        }}
                        className="text-sm font-medium text-primary group-hover:text-primary-foreground"
                      >
                        {index + 1}
                      </motion.div>
                    </motion.div>
                    
                    <div className="flex-1 space-y-2">
                      <p className="text-foreground leading-relaxed">
                        {instruction}
                      </p>
                      
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ 
                          duration: 0.3, 
                          delay: index * 0.1 + 0.7,
                          ease: [0.25, 0.1, 0.25, 1] as const
                        }}
                        className="flex items-center gap-2 text-xs text-muted-foreground"
                      >
                        <IconCircle className="h-3 w-3" />
                        <span>Step {index + 1} of {instructions.length}</span>
                      </motion.div>
                    </div>
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
