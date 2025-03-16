import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'

interface Booking {
  id: string
  packageTitle: string
  userName: string
  travelers: number
  status: 'pending' | 'confirmed' | 'cancelled'
  createdAt: string
}

interface RecentBookingsTableProps {
  bookings: Booking[]
}

export function RecentBookingsTable({ bookings }: RecentBookingsTableProps) {
  if (bookings.length === 0) {
    return <p className="text-center py-4 text-muted-foreground">No recent bookings found.</p>
  }
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Package</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Travelers</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bookings.map((booking) => (
          <TableRow key={booking.id}>
            <TableCell className="font-medium">{booking.packageTitle}</TableCell>
            <TableCell>{booking.userName}</TableCell>
            <TableCell>{booking.travelers}</TableCell>
            <TableCell>
              <StatusBadge status={booking.status} />
            </TableCell>
            <TableCell className="text-muted-foreground">
              {formatDistanceToNow(new Date(booking.createdAt), { addSuffix: true })}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
    confirmed: 'bg-green-100 text-green-800 hover:bg-green-100',
    cancelled: 'bg-red-100 text-red-800 hover:bg-red-100',
  }
  
  return (
    <Badge className={variants[status] || ''} variant="outline">
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}
