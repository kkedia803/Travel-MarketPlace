import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // Check if user is a seller
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()
  
  if (!profile || profile.role !== 'seller') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    // Get total packages
    const { count: totalPackages } = await supabase
      .from('packages')
      .select('*', { count: 'exact', head: true })
      .eq('seller_id', session.user.id)
    
    // Get pending approvals
    const { count: pendingApprovals } = await supabase
      .from('packages')
      .select('*', { count: 'exact', head: true })
      .eq('seller_id', session.user.id)
      .eq('is_approved', false)
    
    // Get total bookings
    const { data: bookings, count: totalBookings } = await supabase
      .from('bookings')
      .select(`
        *,
        packages!inner (
          id,
          title,
          price,
          seller_id
        )
      `, { count: 'exact' })
      .eq('packages.seller_id', session.user.id)
    
    // Calculate total revenue
    let totalRevenue = 0
    if (bookings) {
      totalRevenue = bookings.reduce((sum, booking) => {
        return sum + (booking.packages?.price || 0) * booking.travelers
      }, 0)
    }
    
    // Get recent bookings
    const { data: recentBookingsRaw } = await supabase
      .from('bookings')
      .select(`
        id,
        travelers,
        status,
        created_at,
        packages!inner (
          id,
          title,
          seller_id
        ),
        profiles (
          id,
          name,
          email
        )
      `)
      .eq('packages.seller_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(5)
    
    // Define types for bookings and packages
    type Package = { id: string; title: string; price?: number; seller_id: string };
    type Profile = { id: string; name: string; email: string };
    type Booking = {
      id: string;
      travelers: number;
      status: string;
      created_at: string;
      packages: Package | Package[];
      profiles?: Profile | Profile[];
    };

    // Format recent bookings
    const recentBookings = (recentBookingsRaw as Booking[] | undefined)?.map(booking => ({
      id: booking.id,
      packageId: Array.isArray(booking.packages) ? booking.packages[0]?.id : (booking.packages as Package).id,
      packageTitle: Array.isArray(booking.packages) ? booking.packages[0]?.title : (booking.packages as Package).title,
      userName: Array.isArray(booking.profiles) ? booking.profiles[0]?.name : (booking.profiles as Profile | undefined)?.name,
      travelers: booking.travelers,
      status: booking.status,
      createdAt: booking.created_at
    })) || []
    
    return NextResponse.json({
      totalPackages: totalPackages || 0,
      pendingApprovals: pendingApprovals || 0,
      totalBookings: totalBookings || 0,
      totalRevenue: totalRevenue || 0,
      recentBookings
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
