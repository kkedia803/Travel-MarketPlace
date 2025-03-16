import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Package, Users, DollarSign, Calendar } from 'lucide-react'
import { RecentBookingsTable } from './recent-bookings-table'

interface SellerOverviewProps {
  metrics: any
  isLoading: boolean
}

export function SellerOverview({ metrics, isLoading }: SellerOverviewProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Packages"
          value={metrics?.totalPackages || 0}
          description="Active travel packages"
          icon={<Package className="h-5 w-5 text-muted-foreground" />}
          isLoading={isLoading}
        />
        <MetricCard
          title="Total Bookings"
          value={metrics?.totalBookings || 0}
          description="Across all packages"
          icon={<Users className="h-5 w-5 text-muted-foreground" />}
          isLoading={isLoading}
        />
        <MetricCard
          title="Total Revenue"
          value={`$${metrics?.totalRevenue?.toLocaleString() || 0}`}
          description="Lifetime earnings"
          icon={<DollarSign className="h-5 w-5 text-muted-foreground" />}
          isLoading={isLoading}
        />
        <MetricCard
          title="Pending Approvals"
          value={metrics?.pendingApprovals || 0}
          description="Packages awaiting review"
          icon={<Calendar className="h-5 w-5 text-muted-foreground" />}
          isLoading={isLoading}
        />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
          <CardDescription>
            Your most recent bookings across all packages
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <RecentBookingsTable bookings={metrics?.recentBookings || []} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function MetricCard({ title, value, description, icon, isLoading }: any) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-7 w-1/2" />
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">{description}</p>
          </>
        )}
      </CardContent>
    </Card>
  )
}
