'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SellerOverview } from './seller-overview'
import { SellerPackages } from './seller-packages'
import { SellerBookings } from './seller-bookings'
import { SellerProfile } from './seller-profile'
import { useToast } from '@/components/ui/use-toast'

interface SellerDashboardTabsProps {
  sellerId: string
}

export function SellerDashboardTabs({ sellerId }: SellerDashboardTabsProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [metrics, setMetrics] = useState<any>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/seller/dashboard')
        
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard metrics')
        }
        
        const data = await response.json()
        setMetrics(data)
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load dashboard metrics',
          variant: 'destructive',
        })
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchMetrics()
  }, [toast])

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-4 mb-8">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="packages">Packages</TabsTrigger>
        <TabsTrigger value="bookings">Bookings</TabsTrigger>
        <TabsTrigger value="profile">Profile</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview">
        <SellerOverview metrics={metrics} isLoading={isLoading} />
      </TabsContent>
      
      <TabsContent value="packages">
        <SellerPackages sellerId={sellerId} />
      </TabsContent>
      
      <TabsContent value="bookings">
        <SellerBookings sellerId={sellerId} />
      </TabsContent>
      
      <TabsContent value="profile">
        <SellerProfile sellerId={sellerId} />
      </TabsContent>
    </Tabs>
  )
}
