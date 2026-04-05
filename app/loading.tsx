"use client";

import { motion } from "motion/react";
import { IconLoader2 } from "@tabler/icons-react";

import { Card, CardContent } from "@/components/ui/card";
import { StatusPageShell } from "./_components/status-page-shell";

export default function Loading() {
  return (
    <StatusPageShell>
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
    </StatusPageShell>
  );
}
