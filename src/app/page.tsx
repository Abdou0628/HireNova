import { headers } from 'next/headers'
import PageClient from './page-client'

// Force dynamic rendering by using request-time headers
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Page() {
  const h = await headers()
  // Reading headers forces dynamic rendering
  const _ = h.get('user-agent')
  return <PageClient />
}
