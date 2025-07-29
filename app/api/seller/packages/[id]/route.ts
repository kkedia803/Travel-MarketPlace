import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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
  
  // Check if package belongs to this seller
  const { data: packageData } = await supabase
    .from('packages')
    .select('seller_id, is_approved')
    .eq('id', params.id)
    .single()
  
  if (!packageData || packageData.seller_id !== session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    const updatedData = await request.json()

    // Validate room_type field if present
    if (updatedData.room_type) {
      const allowedTypes = ['Single', 'Double', 'Triple', 'Quad'];
      if (typeof updatedData.room_type !== 'object' || Array.isArray(updatedData.room_type)) {
        return NextResponse.json({ error: 'room_type must be an object' }, { status: 400 });
      }
      // Ensure Quad is always present
      if (!('Quad' in updatedData.room_type)) {
        return NextResponse.json({ error: 'room_type must include Quad' }, { status: 400 });
      }
      // Only allow allowedTypes as keys
      for (const key of Object.keys(updatedData.room_type)) {
        if (!allowedTypes.includes(key)) {
          return NextResponse.json({ error: `Invalid room type: ${key}` }, { status: 400 });
        }
        if (typeof updatedData.room_type[key] !== 'number' || updatedData.room_type[key] < 0) {
          return NextResponse.json({ error: `room_type prices must be non-negative numbers` }, { status: 400 });
        }
      }
    }
    
    // Don't allow changing seller_id
    delete updatedData.seller_id
    
    // If package was already approved, set it back to pending
    if (packageData.is_approved) {
      updatedData.is_approved = false
    }
    
    // Update the package
    const { data, error } = await supabase
      .from('packages')
      .update(updatedData)
      .eq('id', params.id)
      .select()
    
    if (error) {
      throw error
    }
    
    return NextResponse.json(data[0])
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
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
  
  // Check if package belongs to this seller
  const { data: packageData } = await supabase
    .from('packages')
    .select('seller_id')
    .eq('id', params.id)
    .single()
  
  if (!packageData || packageData.seller_id !== session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    const { error } = await supabase
      .from('packages')
      .delete()
      .eq('id', params.id)
    
    if (error) {
      throw error
    }
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
