import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { RecipeParam } from '@/lib/types/recipe.types'
import { IconChevronRight } from '@tabler/icons-react'
import React from 'react'

interface RecipeCardProps extends RecipeParam {
  id: string
}

const RecipeCard = ({ id, name, tagline }: RecipeCardProps) => {
  return (
    <Card>
        <CardContent className='space-y-3'>
            <div>
            <h2 className='text-2xl font-semibold'>{name}</h2>
            <p>{tagline}</p>
            </div>
            <Button asChild>
              <Link href={`/dashboard/recipes/${id}`}>
                View Recipe <IconChevronRight />
              </Link>
            </Button>
        </CardContent>
    </Card>
  )
}

export default RecipeCard