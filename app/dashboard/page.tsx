import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Onboarding from './_components/onboarding'
import { Dashboard } from './_components/dashboard'
import { getHouseIdByUserId } from '@/lib/actions/receipt.actions'
import { getPantryItemsByHouseId } from '@/lib/actions/pantry.actions'

const Page = async () => {
const session = await auth.api.getSession({
    headers: await headers() // you need to pass the headers object.
})    

if(!session?.session) {
    redirect('/login')
}

if(!session?.user?.onboarding) {
    return (
      <Onboarding />
    )
}

const userId = session.user.id
  if (!userId) {
    redirect('/login')
  }
  const houseId = await getHouseIdByUserId(userId)
  if (!houseId) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-semibold">No House Found</h1>
        <p className="text-muted-foreground">You need to create a house to get started.</p>
      </div>
    )
  }

  const result = await getPantryItemsByHouseId(houseId)

  if (!result.data) {
    return <div>Failed to load pantry items</div>
  }

  return (
    <div>
      <Dashboard pantryItems={result.data} user={{ name: session.user.name || '' }} groceryItems={[]} suggestedRecipe={null}  /> 
    </div>
  )
}

export default Page