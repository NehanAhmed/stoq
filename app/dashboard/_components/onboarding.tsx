import { Button } from "@/components/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { IconFolderCode } from "@tabler/icons-react"
import EmptyState from "./empty-state"
import Link from "next/link"
import CreateHouseModal from "./create-house-modal"

const CreateHouseButton = () => {
  return (
    <CreateHouseModal>
      <Button >Create House</Button>
    </CreateHouseModal>
  )
}

const Onboarding = () => {
  return (
    <EmptyState
      title="No Houses Added Yet"
      description="You haven't added any houses yet. Get started by adding your first house."
      action={<CreateHouseButton />}
      icon={<IconFolderCode />}
    />
  )
}

export default Onboarding