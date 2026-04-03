"use client";

import { motion } from "motion/react";
import { IconLoader2 } from "@tabler/icons-react";

import { Card, CardContent } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-background">
     

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          delay: 0.1,
          ease: [0.23, 1, 0.32, 1],
        }}
        className="relative z-10 w-full max-w-sm px-6"
      >
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
              className="mb-4"
            >
              <IconLoader2 className="h-8 w-8 text-primary" />
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-sm text-muted-foreground"
            >
              Loading...
            </motion.p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
