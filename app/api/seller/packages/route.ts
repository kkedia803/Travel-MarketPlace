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
    is_approved,
    profiles,
    package_features,
    final_price,
    ...payload
  } = input

  return { payload, packageFeatures: package_features }
}

export async function GET(request: Request) {
  const { supabase, user, response } = await requireRole(['seller'])
  if (response || !user) return response
  
  // Get all packages for this seller
  const { data: packages, error } = await supabase
    .from('packages')
    .select('*')
    .eq('seller_id', user.id)
    .order('created_at', { ascending: false })
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json(packages)
}

export async function POST(request: Request) {
  try {
    const { supabase, user, response } = await requireRole(['seller'])
    if (response || !user) return response

    const body = await request.json()
    const { payload: packageData, packageFeatures } = sanitizePackagePayload(body)

    if (!packageData.title || !packageData.description || !packageData.destination || !packageData.category) {
      return jsonError('title, description, destination, and category are required', 400)
    }

    if (!Number.isFinite(packageData.price) || packageData.price < 0) {
      return jsonError('price must be a non-negative number', 400)
    }

    if (!Number.isInteger(packageData.duration) || packageData.duration < 1) {
      return jsonError('duration must be a positive integer', 400)
    }

    if (!Array.isArray(packageData.images)) packageData.images = []

    const roomTypeError = validateRoomType(packageData.room_type)
    if (roomTypeError) return jsonError(roomTypeError, 400)

    // Add seller_id to the package data
    packageData.seller_id = user.id
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

    if (data[0]?.id && packageFeatures) {
      const { error: featuresError } = await supabase
        .from('package_features')
        .upsert({ package_id: data[0].id, ...packageFeatures }, { onConflict: 'package_id' })

      if (featuresError) throw featuresError
    }
    
    return NextResponse.json(data[0])
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
