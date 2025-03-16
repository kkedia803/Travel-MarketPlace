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
