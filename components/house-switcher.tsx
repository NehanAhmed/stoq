"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  IconChevronDown,
  IconHome,
  IconPlus,
  IconSettings,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface House {
  id: string;
  name: string;
  isActive?: boolean;
}

interface HouseSwitcherProps {
  isExpanded: boolean;
}

// Demo data - replace with actual data from your API
const houses: House[] = [
  { id: "1", name: "My House", isActive: true },
  { id: "2", name: "Beach House", isActive: false },
  { id: "3", name: "Mom's Place", isActive: false },
];

export function HouseSwitcher({ isExpanded }: HouseSwitcherProps) {
  const router = useRouter();
  const [activeHouse, setActiveHouse] = useState<House>(
    houses.find((h) => h.isActive) || houses[0]
  );

  const handleCreateHouse = () => {
    router.push("/dashboard/houses/new");
  };

  const handleManageHouses = () => {
    router.push("/dashboard/houses/manage");
  };

  return (
    <div className="flex h-14 items-center px-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 px-2"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-secondary">
              <IconHome className="h-4 w-4 text-secondary-foreground" />
            </div>
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -4 }}
                  transition={{ duration: 0.15, delay: 0.05 }}
                  className="flex flex-1 items-center justify-between"
                >
                  <span className="text-sm font-medium text-foreground">
                    {activeHouse.name}
                  </span>
                  <IconChevronDown className="h-4 w-4 text-muted-foreground" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <div className="px-2 py-1.5">
            <p className="text-xs text-muted-foreground">Select house</p>
          </div>
          <DropdownMenuSeparator />
          {houses.map((house) => (
            <DropdownMenuItem
              key={house.id}
              onClick={() => setActiveHouse(house)}
              className="gap-2"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-secondary">
                <IconHome className="h-3.5 w-3.5 text-secondary-foreground" />
              </div>
              <span className={house.id === activeHouse.id ? "font-medium" : ""}>
                {house.name}
              </span>
              {house.id === activeHouse.id && (
                <motion.div
                  layoutId="activeHouseIndicator"
                  className="ml-auto h-1.5 w-1.5 rounded-full bg-primary"
                />
              )}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem className="gap-2" onClick={handleCreateHouse}>
            <IconPlus className="h-4 w-4" />
            <span>Create house</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2" onClick={handleManageHouses}>
            <IconSettings className="h-4 w-4" />
            <span>Manage houses</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
