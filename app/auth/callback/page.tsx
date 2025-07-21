'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Loader from '@/components/loader/loader'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function AuthCallback() {
    const router = useRouter()
    const supabase = createClientComponentClient()

    useEffect(() => {
        const checkProfile = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            const user = session?.user
            if (!user) return

            const { data: profile, error } = await supabase
                .from('profiles')
                .select('id, role, phone_number')
                .eq('id', user.id)
                .single()

            if (error) {
                console.error('Error fetching profile:', error)
                return
            }

            const isIncomplete = !profile?.phone_number || !profile?.role

            if (isIncomplete) {
                router.push('/complete-profile')
            } else {
                router.push(profile.role === 'seller' ? '/seller/dashboard' : '/')
            }
        }

        checkProfile()
    }, [router, supabase])

    return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader />
        </div>
    )
}
