"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  IconAlertCircle,
  IconAlertTriangle,
  IconCheck,
  IconChefHat,
  IconCircle,
  IconClock,
  IconExternalLink,
  IconLeaf,
  IconPlus,
  IconShoppingCart,
  IconSparkles,
  IconX,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PantryItem } from "@/lib/schemas/pantry.schema";

// Types matching DB schema
type StockStatus = "IN_STOCK" | "LOW" | "OUT";
type Category =
  | "PRODUCE"
  | "DAIRY"
  | "DRY_GOODS"
  | "BEVERAGES"
  | "CONDIMENTS"
  | "OTHER";
type AddedVia = "RECEIPT" | "MANUAL";



type GroceryItem = {
  name: string;
};

type Recipe = {
  name: string;
  imageUrl: string;
  matchedIngredients: number;
  totalIngredients: number;
  missingIngredients: string[];
};

type User = {
  name: string;
};

type DashboardProps = {
  user: User;
  pantryItems: PantryItem[];
  groceryItems: GroceryItem[];
  suggestedRecipe: Recipe | null;
  onCookedThis?: () => void;
  onAddGroceryItem?: () => void;
};

// Animation constants from auth pages
const fadeUpVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] as const },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const statusConfig: Record<
  StockStatus,
  { dotClass: string; icon: typeof IconX }
> = {
  OUT: {
    dotClass: "text-destructive",
    icon: IconX,
  },
  LOW: {
    dotClass: "text-warning",
    icon: IconAlertTriangle,
  },
  IN_STOCK: {
    dotClass: "text-success",
    icon: IconCheck,
  },
};

function StatusDot({ status }: { status: StockStatus }) {
  return (
    <span
      className={`h-2 w-2 rounded-full ${statusConfig[status].dotClass} bg-current`}
    />
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function formatDate(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

// Header Strip Component
function HeaderStrip({
  user,
  pantryItems,
}: {
  user: User;
  pantryItems: PantryItem[];
}) {
  const { outCount, lowCount, statusMessage } = useMemo(() => {
    const outItems = pantryItems.filter((item) => item.stockStatus === "OUT");
    const lowItems = pantryItems.filter((item) => item.stockStatus === "LOW");

    let message: string;
    if (outItems.length > 0) {
      message = `${outItems.length} item${outItems.length === 1 ? "" : "s"} need${outItems.length === 1 ? "s" : ""} restocking`;
    } else if (lowItems.length > 0) {
      message = `${lowItems.length} item${lowItems.length === 1 ? "" : "s"} are running low`;
    } else {
      message = "Pantry looks good";
    }

    return {
      outCount: outItems.length,
      lowCount: lowItems.length,
      statusMessage: message,
    };
  }, [pantryItems]);

  return (
    <motion.header
      initial={fadeUpVariants.initial}
      animate={fadeUpVariants.animate}
      transition={{ ...fadeUpVariants.transition, delay: 0 }}
      className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"
    >
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          {getGreeting()}, {user.name}
        </h1>
        <p className="text-sm text-muted-foreground">{statusMessage}</p>
      </div>
      <p className="text-sm text-muted-foreground">{formatDate()}</p>
    </motion.header>
  );
}

// Pantry Health Panel Component
function PantryHealthPanel({
  pantryItems,
}: {
  pantryItems: PantryItem[];
}) {
  const healthItems = useMemo(() => {
    const filtered = pantryItems.filter(
      (item) => item.stockStatus !== "IN_STOCK"
    );
    const sorted = filtered.sort((a, b) => {
      // OUT before LOW
      if (a.stockStatus === "OUT" && b.stockStatus === "LOW") return -1;
      if (a.stockStatus === "LOW" && b.stockStatus === "OUT") return 1;
      // Alphabetical within same status
      return a.name.localeCompare(b.name);
    });
    return sorted;
  }, [pantryItems]);

  const displayItems = healthItems.slice(0, 5);
  const remainingCount = healthItems.length - 5;

  return (
    <motion.section
      initial={fadeUpVariants.initial}
      animate={fadeUpVariants.animate}
      transition={{ ...fadeUpVariants.transition, delay: 0.1 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2">
        <IconAlertCircle className="h-4 w-4 text-muted-foreground" />
        <h2 className="text-sm font-medium">Pantry Health</h2>
      </div>

      <div className="space-y-3">
        {healthItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center gap-3 py-8"
          >
            <IconCheck className="h-8 w-8 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">All stocked up</p>
          </motion.div>
        ) : (
          <>
            {displayItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
        whileHover={{ backgroundColor: "var(--muted)" }}
                className="flex items-center gap-3 rounded-md px-2 py-2.5 transition-colors"
              >
                <StatusDot status={item.stockStatus} />
                <span className="flex-1 text-sm font-medium">{item.name}</span>
                <span className="text-sm text-muted-foreground">
                  {item.quantity} {item.unit}
                </span>
              </motion.div>
            ))}
            {remainingCount > 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="px-2 text-xs text-muted-foreground"
              >
                +{remainingCount} more
              </motion.p>
            )}
          </>
        )}
      </div>

      <Link
        href="/pantry"
        className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        View pantry
        <IconExternalLink className="h-3 w-3" />
      </Link>
    </motion.section>
  );
}

// Cook Tonight Panel Component
function CookTonightPanel({
  suggestedRecipe,
  onCookedThis,
}: {
  suggestedRecipe: Recipe | null;
  onCookedThis: () => void;
}) {
  return (
    <motion.section
      initial={fadeUpVariants.initial}
      animate={fadeUpVariants.animate}
      transition={{ ...fadeUpVariants.transition, delay: 0.2 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2">
        <IconChefHat className="h-4 w-4 text-muted-foreground" />
        <h2 className="text-sm font-medium">Cook Tonight</h2>
      </div>

      <AnimatePresence mode="wait">
        {suggestedRecipe === null ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center gap-3 py-8"
          >
            <IconSparkles className="h-8 w-8 text-muted-foreground/50" />
            <p className="text-center text-sm text-muted-foreground">
              No suggestions yet.
              <br />
              Add more pantry items.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="recipe"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <div className="space-y-1">
              <h3 className="text-base font-medium">{suggestedRecipe.name}</h3>
              <p className="text-sm text-muted-foreground">
                You have {suggestedRecipe.matchedIngredients} of{" "}
                {suggestedRecipe.totalIngredients} ingredients
              </p>
            </div>

            {suggestedRecipe.missingIngredients.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {suggestedRecipe.missingIngredients.slice(0, 4).map((ing) => (
                  <Badge key={ing} variant="outline" className="text-xs">
                    {ing}
                  </Badge>
                ))}
                {suggestedRecipe.missingIngredients.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{suggestedRecipe.missingIngredients.length - 4} more
                  </Badge>
                )}
              </div>
            )}

            <div className="flex gap-2">
              <Button size="sm" onClick={onCookedThis}>
                <IconCheck className="mr-1.5 h-3.5 w-3.5" />
                I cooked this
              </Button>
              <Link href="/recipes">
                <Button variant="ghost" size="sm">
                  See more recipes
                  <IconExternalLink className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

// Grocery List Strip Component
function GroceryListStrip({
  groceryItems,
  onAddGroceryItem,
}: {
  groceryItems: GroceryItem[];
  onAddGroceryItem: () => void;
}) {
  return (
    <motion.section
      initial={fadeUpVariants.initial}
      animate={fadeUpVariants.animate}
      transition={{ ...fadeUpVariants.transition, delay: 0.3 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2">
        <IconShoppingCart className="h-4 w-4 text-muted-foreground" />
        <h2 className="text-sm font-medium">Grocery List</h2>
      </div>

      <div className="flex items-center gap-3">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-2 pb-2">
            {groceryItems.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Your grocery list is empty
              </p>
            ) : (
              groceryItems.map((item, index) => (
                <motion.div
                  key={`${item.name}-${index}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.2,
                    delay: Math.min(index * 0.03, 0.2),
                  }}
                >
                  <Badge
                    variant="outline"
                    className="cursor-pointer gap-1 pr-1.5"
                    onClick={onAddGroceryItem}
                  >
                    <span className="max-w-[120px] truncate">{item.name}</span>
                    <IconCheck className="h-3 w-3 text-muted-foreground transition-colors hover:text-foreground" />
                  </Badge>
                </motion.div>
              ))
            )}
          </div>
        </ScrollArea>

        <Button
          variant="ghost"
          size="sm"
          className="shrink-0 gap-1"
          onClick={onAddGroceryItem}
        >
          <IconPlus className="h-4 w-4" />
          Add item
        </Button>
      </div>
    </motion.section>
  );
}

// Loading Skeleton
export function DashboardSkeleton() {
  return (
    <div className="space-y-10">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
      </div>

      {/* Two Column Skeleton */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Pantry Health Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-4 w-28" />
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 py-2">
                <Skeleton className="h-2 w-2 rounded-full" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
          <Skeleton className="h-3 w-20" />
        </div>

        {/* Cook Tonight Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-4 w-28" />
          <div className="space-y-3">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-40" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-14 rounded-full" />
            </div>
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-8 w-28" />
              <Skeleton className="h-8 w-32" />
            </div>
          </div>
        </div>
      </div>

      {/* Grocery Strip Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-4 w-24" />
        <div className="flex gap-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-5 w-20 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

// Main Dashboard Component
export function Dashboard({
  user,
  pantryItems,
  groceryItems,
  suggestedRecipe,
  onCookedThis,
  onAddGroceryItem,
}: DashboardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const }}
      className="space-y-10"
    >
      <HeaderStrip user={user} pantryItems={pantryItems} />

      <div className="grid gap-10 md:grid-cols-2">
        <PantryHealthPanel pantryItems={pantryItems} />
        <CookTonightPanel
          suggestedRecipe={suggestedRecipe}
          onCookedThis={onCookedThis || (() => {})}
        />
      </div>

      <Separator />

      <GroceryListStrip
        groceryItems={groceryItems}
        onAddGroceryItem={onAddGroceryItem || (() => {})}
      />
    </motion.div>
  );
}
