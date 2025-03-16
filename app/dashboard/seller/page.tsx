import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { SellerDashboardTabs } from '@/components/seller/seller-dashboard-tabs'

export const metadata: Metadata = {
  title: 'Seller Dashboard | TravelMarketplace',
  description: 'Manage your travel packages and track your performance',
}

export default async function SellerDashboardPage() {
  const supabase = createServerComponentClient({ cookies })
  
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    redirect('/login')
  }
  
  // Check if user is a seller
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()
  
  if (!profile || profile.role !== 'seller') {
    redirect('/dashboard')
  }
  
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Seller Dashboard</h1>
      <SellerDashboardTabs sellerId={session.user.id} />
    </div>
  )
}
