import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

const Page = async () => {
const session = await auth.api.getSession({
    headers: await headers() // you need to pass the headers object.
})    

if(!session?.session) {
    redirect('/login')
}
  return (
    <div>Page</div>
  )
}

export default Page