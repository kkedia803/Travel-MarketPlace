import { NextResponse } from 'next/server'
import { jsonError, requireRole } from '@/app/api/_utils/auth'

const allowedRoomTypes = ['Single', 'Double', 'Triple', 'Quad']

function validateRoomType(roomType: unknown) {
  if (!roomType) return null
  if (typeof roomType !== 'object' || Array.isArray(roomType)) {
    return 'room_type must be an object'
  }

  const value = roomType as Record<string, unknown>
  if (!('Quad' in value)) {
    return 'room_type must include Quad'
  }

  for (const key of Object.keys(value)) {
    if (!allowedRoomTypes.includes(key)) return `Invalid room type: ${key}`
    if (typeof value[key] !== 'number' || value[key] < 0) {
      return 'room_type prices must be non-negative numbers'
    }
  }

  return null
}

function sanitizePackagePayload(input: any) {
  const {
    id,
    created_at,
    updated_at,
    seller_id,
    profiles,
    package_features,
    final_price,
    ...payload
  } = input

  return { payload, packageFeatures: package_features }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { supabase, user, response } = await requireRole(['seller'])
  if (response || !user) return response
  
  // Check if package belongs to this seller
  const { data: packageData } = await supabase
    .from('packages')
    .select('seller_id, is_approved')
    .eq('id', id)
    .single()
  
  if (!packageData || packageData.seller_id !== user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    const body = await request.json()
    const { payload: updatedData, packageFeatures } = sanitizePackagePayload(body)

    const roomTypeError = validateRoomType(updatedData.room_type)
    if (roomTypeError) return jsonError(roomTypeError, 400)
    
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
      .eq('id', id)
      .select()
    
    if (error) {
      throw error
    }

    if (packageFeatures) {
      const { error: featuresError } = await supabase
        .from('package_features')
        .upsert({ package_id: id, ...packageFeatures }, { onConflict: 'package_id' })

      if (featuresError) throw featuresError
    }
    
    return NextResponse.json(data[0])
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { supabase, user, response } = await requireRole(['seller'])
  if (response || !user) return response
  
  // Check if package belongs to this seller
  const { data: packageData } = await supabase
    .from('packages')
    .select('seller_id')
    .eq('id', id)
    .single()
  
  if (!packageData || packageData.seller_id !== user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    const { error } = await supabase
      .from('packages')
      .delete()
      .eq('id', id)
    
    if (error) {
      throw error
    }
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
