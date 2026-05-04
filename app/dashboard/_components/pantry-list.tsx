"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  IconCircle,
  IconDots,
  IconPackage,
  IconCheck,
  IconAlertTriangle,
  IconX,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";

type StockStatus = "IN_STOCK" | "LOW" | "OUT";

type PantryItem = {
  id: string;
  name: string;
  quantity: string | null;
  unit: string | null;
  stockStatus: StockStatus;
  category: string | null;
};

type PantryListProps = {
  items: PantryItem[];
  onStatusChange?: (id: string, newStatus: StockStatus) => void;
};

type FilterType = "ALL" | StockStatus | `CATEGORY:${string}`;

const statusOrder: StockStatus[] = ["OUT", "LOW", "IN_STOCK"];

const statusConfig: Record<
  StockStatus,
  { label: string; dotClass: string; icon: typeof IconX }
> = {
  OUT: {
    label: "Out",
    dotClass: "text-destructive",
    icon: IconX,
  },
  LOW: {
    label: "Low",
    dotClass: "text-warning",
    icon: IconAlertTriangle,
  },
  IN_STOCK: {
    label: "In Stock",
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

function FilterBar({
  activeFilter,
  onFilterChange,
  categories,
  counts,
}: {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  categories: string[];
  counts: Record<FilterType, number>;
}) {
  const filters: { type: FilterType; label: string }[] = [
    { type: "ALL", label: `All (${counts.ALL})` },
    { type: "OUT", label: `Out (${counts.OUT})` },
    { type: "LOW", label: `Low (${counts.LOW})` },
    { type: "IN_STOCK", label: `In Stock (${counts.IN_STOCK})` },
    ...categories.map((cat) => ({
      type: `CATEGORY:${cat}` as FilterType,
      label: `${cat} (${counts[`CATEGORY:${cat}`] ?? 0})`,
    })),
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {filters.map((filter) => {
        const isActive = activeFilter === filter.type;
        return (
          <motion.div
            key={filter.type}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.15 }}
          >
            <Badge
              variant={isActive ? "default" : "outline"}
              className="cursor-pointer whitespace-nowrap"
              onClick={() => onFilterChange(filter.type)}
            >
              {filter.type.startsWith("CATEGORY:") && (
                <IconPackage className="mr-1 h-3 w-3" />
              )}
              {!filter.type.startsWith("CATEGORY:") &&
                filter.type !== "ALL" && (
                  <StatusDot status={filter.type as StockStatus} />
                )}
              <span className="ml-1">{filter.label}</span>
            </Badge>
          </motion.div>
        );
      })}
    </div>
  );
}

function PantryRow({
  item,
  onStatusChange,
  index,
}: {
  item: PantryItem;
  onStatusChange?: (id: string, status: StockStatus) => void;
  index: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.2,
        delay: Math.min(index * 0.03, 0.35),
        ease: [0.25, 0.1, 0.25, 1],
      }}
      whileHover={{ backgroundColor: "var(--muted)" }}
      className="flex items-center gap-3 rounded-md px-2 py-3 transition-colors"
    >
      <StatusDot status={item.stockStatus} />

      <span className="flex-1 text-sm font-medium">{item.name}</span>

      <span className="text-sm text-muted-foreground">
        {item.quantity && item.unit
          ? `${item.quantity} ${item.unit}`
          : item.quantity || item.unit || "—"}
      </span>

      {onStatusChange && (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <IconDots className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-40 p-0" align="end">
            <Command>
              <CommandList>
                <CommandEmpty>No status found.</CommandEmpty>
                <CommandGroup>
                  {statusOrder.map((status) => {
                    const config = statusConfig[status];
                    const Icon = config.icon;
                    return (
                      <CommandItem
                        key={status}
                        onSelect={() => {
                          onStatusChange(item.id, status);
                          setOpen(false);
                        }}
                        className="flex items-center gap-2"
                      >
                        <Icon className={`h-4 w-4 ${config.dotClass}`} />
                        <span>{config.label}</span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    </motion.div>
  );
}

function StockGroup({
  status,
  items,
  onStatusChange,
  startIndex,
}: {
  status: StockStatus;
  items: PantryItem[];
  onStatusChange?: (id: string, status: StockStatus) => void;
  startIndex: number;
}) {
  const config = statusConfig[status];

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 px-2">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {config.label}
        </span>
        <Badge variant="outline" className="text-xs">
          {items.length}
        </Badge>
      </div>
      <Separator className="mb-3" />
      <div className="space-y-0.5">
        {items.map((item, idx) => (
          <PantryRow
            key={item.id}
            item={item}
            onStatusChange={onStatusChange}
            index={startIndex + idx}
          />
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
      className="flex flex-col items-center justify-center gap-3 py-16"
    >
      <IconPackage className="h-10 w-10 text-muted-foreground/50" />
      <p className="text-sm text-muted-foreground">
        No items match your filter
      </p>
    </motion.div>
  );
}

export function PantryList({ items, onStatusChange }: PantryListProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>("ALL");

  const categories = useMemo(() => {
    const cats = new Set<string>();
    items.forEach((item) => {
      if (item.category) cats.add(item.category);
    });
    return Array.from(cats).sort();
  }, [items]);

  const counts = useMemo(() => {
    const result: Record<FilterType, number> = {
      ALL: items.length,
      OUT: 0,
      LOW: 0,
      IN_STOCK: 0,
    };

    items.forEach((item) => {
      result[item.stockStatus]++;
      if (item.category) {
        const key = `CATEGORY:${item.category}` as FilterType;
        result[key] = (result[key] || 0) + 1;
      }
    });

    return result;
  }, [items]);

  const filteredItems = useMemo(() => {
    if (activeFilter === "ALL") return items;
    if (activeFilter.startsWith("CATEGORY:")) {
      const cat = activeFilter.replace("CATEGORY:", "");
      return items.filter((item) => item.category === cat);
    }
    return items.filter((item) => item.stockStatus === activeFilter);
  }, [items, activeFilter]);

  const groupedItems = useMemo(() => {
    const groups: Record<StockStatus, PantryItem[]> = {
      OUT: [],
      LOW: [],
      IN_STOCK: [],
    };

    filteredItems.forEach((item) => {
      groups[item.stockStatus].push(item);
    });

    // Sort alphabetically within each group
    statusOrder.forEach((status) => {
      groups[status].sort((a, b) => a.name.localeCompare(b.name));
    });

    return groups;
  }, [filteredItems]);

  let itemIndex = 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
      className="w-full space-y-6"
    >
      <FilterBar
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        categories={categories}
        counts={counts}
      />

      <ScrollArea className="h-[calc(100vh-280px)]">
        <AnimatePresence mode="wait">
          {filteredItems.length === 0 ? (
            <EmptyState key="empty" />
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-8 pr-4"
            >
              {statusOrder.map((status) => {
                const groupItems = groupedItems[status];
                if (groupItems.length === 0) return null;
                const startIdx = itemIndex;
                itemIndex += groupItems.length;
                return (
                  <StockGroup
                    key={status}
                    status={status}
                    items={groupItems}
                    onStatusChange={onStatusChange}
                    startIndex={startIdx}
                  />
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </ScrollArea>
    </motion.div>
  );
}

export function PantryListSkeleton() {
  return (
    <div className="w-full space-y-6">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-5 w-20 rounded-full" />
        ))}
      </div>

      <div className="space-y-8">
        {[...Array(3)].map((_, groupIdx) => (
          <div key={groupIdx} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Separator />
            <div className="space-y-0.5">
              {[...Array(4)].map((_, rowIdx) => (
                <div key={rowIdx} className="flex items-center gap-3 px-2 py-3">
                  <Skeleton className="h-2 w-2 rounded-full" />
                  <Skeleton className="h-4 w-32 flex-1" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
