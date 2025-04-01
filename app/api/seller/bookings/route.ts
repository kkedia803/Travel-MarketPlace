import { Database } from '@/app/lib/database.types'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
//import type { Database } from '@/app/database.types' // Adjusted path to match project structure
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient<Database>({ cookies }) // Use Database type
  
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // Check if user is a seller
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single() // Ensure profile is a single object
  
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
        packages (
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
      // Removed .single() to ensure bookings is an array
    
    if (error) {
      throw error
    }
    
    // Format bookings (types now know packages/profiles are single objects)
    interface Booking {
      id: string;
      travelers: number;
      status: string;
      created_at: string;
      packages: {
        id: string;
        title: string;
        seller_id: string;
      };
      profiles: {
        id: string;
        name: string;
        email: string;
      };
    }

    interface FormattedBooking {
      id: string;
      packageId: string;
      packageTitle: string;
      userId: string;
      userName: string;
      userEmail: string;
      travelers: number;
      status: string;
      createdAt: string;
    }

    const formattedBookings: FormattedBooking[] = (bookings || []).map((booking: any) => {
      if ('id' in booking && 'travelers' in booking && 'status' in booking && 'created_at' in booking && booking.packages && booking.profiles) {
        return {
          id: booking.id,
          packageId: booking.packages.id,
          packageTitle: booking.packages.title,
          userId: booking.profiles.id,
          userName: booking.profiles.name,
          userEmail: booking.profiles.email,
          travelers: booking.travelers,
          status: booking.status,
          createdAt: booking.created_at
        };
      }
      throw new Error('Invalid booking data format');
    });
    
    return NextResponse.json(formattedBookings)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}