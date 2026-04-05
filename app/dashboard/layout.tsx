"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  IconLayoutDashboard,
  IconArchive,
  IconShoppingCart,
  IconToolsKitchen2,
  type TablerIcon,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { HouseSwitcher } from "@/components/house-switcher";

// ─── Constants ────────────────────────────────────────────────────────────────

const SPRING = { type: "spring", stiffness: 300, damping: 30 } as const;

const RAIL_WIDTH = { collapsed: 64, expanded: 208 } as const;

interface NavItem {
  label: string;
  href: string;
  icon: TablerIcon;
  action: string;
  actionHref?: string;
  actionHandler?: () => void;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: IconLayoutDashboard, action: "Quick Add" },
  { label: "Pantry",    href: "/dashboard/pantry",    icon: IconArchive,          action: "Add Item",       actionHref: "/dashboard/pantry" },
  { label: "Groceries", href: "/dashboard/groceries", icon: IconShoppingCart,     action: "Upload Receipt", actionHref: "/dashboard/pantry" },
  { label: "Recipes",   href: "/dashboard/recipes",   icon: IconToolsKitchen2,    action: "Find Recipe"     },
] as const;

const DEFAULT_NAV = NAV_ITEMS[0];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface NavItemProps {
  item: NavItem;
  isActive: boolean;
  isExpanded: boolean;
}

function NavItemButton({ item, isActive, isExpanded }: NavItemProps) {
  const Icon = item.icon;

  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <Link href={item.href} className="relative" aria-label={item.label}>
          <Button
            variant={isActive ? "secondary" : "ghost"}
            className="w-full justify-start gap-3 px-3"
          >
            {isActive && (
              <motion.div
                layoutId="activeIndicator"
                className="absolute left-0 top-0 h-full w-0.5 bg-primary"
                transition={SPRING}
              />
            )}
            <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.15 }}>
              <Icon
                className={cn(
                  "h-[18px] w-[18px]",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )}
              />
            </motion.div>
            <AnimatePresence>
              {isExpanded && (
                <motion.span
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -4 }}
                  transition={{ duration: 0.15, delay: 0.05 }}
                  className={cn(
                    "text-sm",
                    isActive ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </Link>
      </TooltipTrigger>
      {!isExpanded && (
        <TooltipContent side="right">
          {item.label}
        </TooltipContent>
      )}
    </Tooltip>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface AppLayoutProps {
  children: React.ReactNode;
}

// ─── Layout ───────────────────────────────────────────────────────────────────

export default function AppLayout({ children }: AppLayoutProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();

  const activeItem = useMemo(
    () => NAV_ITEMS.find((item) => pathname === item.href) ?? DEFAULT_NAV,
    [pathname]
  );

  const userInitials = "U";

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">

      {/* ── Icon Rail ─────────────────────────────────────────────────────── */}
      <motion.aside
        className="flex flex-col overflow-hidden border-r border-border bg-card"
        initial={false}
        animate={{ width: isExpanded ? RAIL_WIDTH.expanded : RAIL_WIDTH.collapsed }}
        transition={SPRING}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        aria-label="Main navigation"
      >
        <HouseSwitcher isExpanded={isExpanded} />

        <Separator />

        {/* Nav Items */}
        <nav className="flex flex-col gap-1 p-2">
          {NAV_ITEMS.map((item) => (
            <NavItemButton
              key={item.href}
              item={item}
              isActive={pathname === item.href}
              isExpanded={isExpanded}
            />
          ))}
        </nav>

        <Separator className="mt-auto" />

        {/* User Section */}
        <motion.div
          className="flex items-center gap-3 p-4"
          whileHover={{ y: -1 }}
          transition={{ duration: 0.15 }}
        >
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="bg-secondary text-xs text-secondary-foreground">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <AnimatePresence>
            {isExpanded && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15, delay: 0.05 }}
                className="truncate text-sm text-muted-foreground"
              >
                User
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.aside>

      {/* ── Content Area ──────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden bg-background">

        {/* Top Bar */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-8">
          <AnimatePresence mode="wait">
            <motion.h1
              key={activeItem.label}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="text-sm font-medium text-foreground"
            >
              {activeItem.label}
            </motion.h1>
          </AnimatePresence>
          {activeItem.actionHref || activeItem.actionHandler ? (
            <Button 
              size="sm" 
              onClick={activeItem.actionHandler}
              asChild={!!activeItem.actionHref}
            >
              {activeItem.actionHref ? (
                <Link href={activeItem.actionHref}>{activeItem.action}</Link>
              ) : (
                activeItem.action
              )}
            </Button>
          ) : null}
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-8">
          {children}
        </main>
      </div>

    </div>
  );
}