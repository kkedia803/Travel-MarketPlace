import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const cookieStore = await cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
  
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
  
  // Get all packages for this seller
  const { data: packages, error } = await supabase
    .from('packages')
    .select('*')
    .eq('seller_id', session.user.id)
    .order('created_at', { ascending: false })
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json(packages)
}

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
  
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
    const packageData = await request.json()

    // Validate room_type field if present
    if (packageData.room_type) {
      const allowedTypes = ['Single', 'Double', 'Triple', 'Quad'];
      if (typeof packageData.room_type !== 'object' || Array.isArray(packageData.room_type)) {
        return NextResponse.json({ error: 'room_type must be an object' }, { status: 400 });
      }
      // Ensure Quad is always present
      if (!('Quad' in packageData.room_type)) {
        return NextResponse.json({ error: 'room_type must include Quad' }, { status: 400 });
      }
      // Only allow allowedTypes as keys
      for (const key of Object.keys(packageData.room_type)) {
        if (!allowedTypes.includes(key)) {
          return NextResponse.json({ error: `Invalid room type: ${key}` }, { status: 400 });
        }
        if (typeof packageData.room_type[key] !== 'number' || packageData.room_type[key] < 0) {
          return NextResponse.json({ error: `room_type prices must be non-negative numbers` }, { status: 400 });
        }
      }
    }

    // Add seller_id to the package data
    packageData.seller_id = session.user.id
    // Set is_approved to false for new packages
    packageData.is_approved = false

    // If room_type is present, recalculate price in real time (sum base + selected add-ons)
    if (packageData.room_type) {
      let basePrice = typeof packageData.base_price === 'number' ? packageData.base_price : 0;
      let addonTotal = 0;
      for (const key of ['Single', 'Double', 'Triple']) {
        if (typeof packageData.room_type[key] === 'number') {
          addonTotal += packageData.room_type[key];
        }
      }
      // If base_price is not provided, fallback to price minus add-ons (legacy)
      if (!packageData.base_price && typeof packageData.price === 'number') {
        basePrice = packageData.price - addonTotal;
      }
      packageData.price = basePrice + addonTotal;
    }
    
    const { data, error } = await supabase
      .from('packages')
      .insert(packageData)
      .select()
    
    if (error) {
      throw error
    }
    
    return NextResponse.json(data[0])
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
