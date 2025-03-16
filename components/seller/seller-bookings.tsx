'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Search, Calendar, Filter } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { format } from 'date-fns'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'

interface Booking {
  id: string
  packageId: string
  packageTitle: string
  userId: string
  userName: string
  userEmail: string
  travelers: number
  status: 'pending' | 'confirmed' | 'cancelled'
  createdAt: string
}

interface SellerBookingsProps {
  sellerId: string
}

export function SellerBookings({ sellerId }: SellerBookingsProps) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [packages, setPackages] = useState<{id: string, title: string}[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [packageFilter, setPackageFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined)
  const { toast } = useToast()

  useEffect(() => {
    fetchBookings()
    fetchPackages()
  }, [])

  useEffect(() => {
    filterBookings()
  }, [bookings, searchTerm, packageFilter, statusFilter, dateFilter])

  const fetchBookings = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/seller/bookings')
      
      if (!response.ok) {
        throw new Error('Failed to fetch bookings')
      }
      
      const data = await response.json()
      setBookings(data)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load bookings',
        variant: 'destructive',
      })
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchPackages = async () => {
    try {
      const response = await fetch('/api/seller/packages')
      
      if (!response.ok) {
        throw new Error('Failed to fetch packages')
      }
      
      const data = await response.json()
      setPackages(data.map((pkg: any) => ({ id: pkg.id, title: pkg.title })))
    } catch (error) {
      console.error(error)
    }
  }

  const filterBookings = () => {
    let filtered = [...bookings]
    
    if (searchTerm) {
      filtered = filtered.filter(
        booking => 
          booking.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.packageTitle.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    if (packageFilter && packageFilter !== 'all') {
      filtered = filtered.filter(booking => booking.packageId === packageFilter)
    }
    
    if (statusFilter) {
      filtered = filtered.filter(booking => booking.status === statusFilter)
    }
    
    if (dateFilter) {
      const filterDate = format(dateFilter, 'yyyy-MM-dd')
      filtered = filtered.filter(booking => {
        const bookingDate = format(new Date(booking.createdAt), 'yyyy-MM-dd')
        return bookingDate === filterDate
      })
    }
    
    setFilteredBookings(filtered)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setPackageFilter('')
    setStatusFilter('')
    setDateFilter(undefined)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Booking Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by customer or package"
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={packageFilter} onValueChange={setPackageFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="All packages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All packages</SelectItem>
                {packages.map((pkg) => (
                  <SelectItem key={pkg.id} value={pkg.id}>
                    {pkg.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full md:w-auto">
                  <Calendar className="mr-2 h-4 w-4" />
                  {dateFilter ? format(dateFilter, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={dateFilter}
                  onSelect={setDateFilter}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            
            <Button variant="ghost" onClick={clearFilters} className="w-full md:w-auto">
              <Filter className="mr-2 h-4 w-4" /> Clear Filters
            </Button>
          </div>
          
          {isLoading ? (
            <div className="space-y-2">
              <div className="h-10 bg-muted animate-pulse rounded" />
              <div className="h-10 bg-muted animate-pulse rounded" />
              <div className="h-10 bg-muted animate-pulse rounded" />
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No bookings found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Package</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Travelers</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">{booking.packageTitle}</TableCell>
                    <TableCell>
                      <div>{booking.userName}</div>
                      <div className="text-sm text-muted-foreground">{booking.userEmail}</div>
                    </TableCell>
                    <TableCell>{booking.travelers}</TableCell>
                    <TableCell>
                      <StatusBadge status={booking.status} />
                    </TableCell>
                    <TableCell>{format(new Date(booking.createdAt), 'PPP')}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
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
