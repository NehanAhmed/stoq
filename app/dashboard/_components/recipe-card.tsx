import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { RecipeParam } from '@/lib/types/recipe.types'
import { IconChevronRight, IconClock, IconChefHat } from '@tabler/icons-react'
import React from 'react'
import { fadeUpVariants } from '@/lib/animations'

interface RecipeCardProps extends RecipeParam {
  id: string
}

const RecipeCard = ({ id, name, tagline }: RecipeCardProps) => {
  return (
    <motion.div
      variants={fadeUpVariants}
      initial="initial"
      animate="animate"
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm h-full hover:shadow-lg transition-all duration-200">
        <CardContent className="p-6 space-y-4">
          {/* Recipe Icon and Title */}
          <div className="flex items-start gap-3">
            <motion.div
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <IconChefHat className="h-5 w-5 text-primary" />
            </motion.div>
            <div className="flex-1 space-y-1">
              <h3 className="text-lg font-semibold tracking-tight">{name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{tagline}</p>
            </div>
          </div>

          
          {/* Action Button */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.15 }}
          >
            <Button
              asChild
              className="w-full gap-2"
              variant="default"
            >
              <Link href={`/dashboard/recipes/${id}`}>
                View Recipe
                <IconChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  
  )
}


export default RecipeCard