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
    // Get all bookings for packages owned by this seller
    const { data: bookings, error } = await supabase
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
    
    if (error) {
      throw error
    }
    
    // Format bookings
    const formattedBookings = bookings.map(booking => ({
      id: booking.id,
      packageId: booking.packages.id,
      packageTitle: booking.packages.title,
      userId: booking.profiles.id,
      userName: booking.profiles.name,
      userEmail: booking.profiles.email,
      travelers: booking.travelers,
      status: booking.status,
      createdAt: booking.created_at
    }))
    
    return NextResponse.json(formattedBookings)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
