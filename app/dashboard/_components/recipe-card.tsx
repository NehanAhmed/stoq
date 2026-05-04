import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AiRecipeResponse } from '@/lib/schemas/recipe.schemas'
import { RecipeParam } from '@/lib/types/recipe.types'
import { IconChevronRight } from '@tabler/icons-react'
import React from 'react'

const RecipeCard = ({ name, tagline }: RecipeParam) => {
  return (
    <Card>
        <CardContent className='space-y-3'>
            <div>
            <h1 className='text-2xl font-semibold '>{name}</h1>
            <p>{tagline}</p>
            </div>
            <Button>View Recipe <IconChevronRight /></Button>
        </CardContent>
    </Card>
  )
}

export default RecipeCard