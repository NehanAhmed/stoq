"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { IconHome, IconSearch } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusPageShell } from "./_components/status-page-shell";

export default function NotFound() {
  return (
    <StatusPageShell>
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="space-y-4 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted"
          >
            <IconSearch className="h-8 w-8 text-muted-foreground" />
          </motion.div>
          <div className="space-y-2">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <CardTitle className="text-2xl font-semibold tracking-tight">
                Page not found
              </CardTitle>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <CardDescription>
                The page you&apos;re looking for doesn&apos;t exist or has been moved.
              </CardDescription>
            </motion.div>
          </div>
        </CardHeader>
        <CardContent>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button asChild className="w-full">
              <Link href="/" className="flex items-center gap-2">
                <IconHome className="h-4 w-4" />
                Go home
              </Link>
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </StatusPageShell>
  );
}
