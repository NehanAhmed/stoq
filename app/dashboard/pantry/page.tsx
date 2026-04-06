import { checkIfFirstTime } from '@/lib/actions/pantry.actions'
import EmptyPantryState from '../_components/empty-pantry-state'

const Page = async () => {
  const isFirstTime = await checkIfFirstTime()

  if(isFirstTime){
    return (
      <div>
        <EmptyPantryState />
      </div>
    )
  }
  return (
    <div>
      <h1>Hell</h1>
    </div>
  )
}

export default Page