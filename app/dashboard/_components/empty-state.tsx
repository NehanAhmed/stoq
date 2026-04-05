import React from 'react'
import { Button } from "@/components/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"

const EmptyState = ({
    title,
    description,
    action,
    icon
}: {
    title: string;
    description: string;
    action: React.ReactNode;
    icon?: React.ReactNode;
}) => {
  return (
    <div>
        <Empty className="w-1/2 mx-auto bg-muted/30">
      <EmptyHeader>
        {icon && (
          <EmptyMedia variant="icon">
            {icon}
          </EmptyMedia>
        )}
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>
          {description}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        {action}
      </EmptyContent>
    </Empty>
    </div>
  )
}

export default EmptyState