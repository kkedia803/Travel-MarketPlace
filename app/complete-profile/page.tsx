'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

export default function CompleteProfilePage() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  const [role, setRole] = useState('user')
  const [phone, setPhone] = useState('')
  const [company, setCompany] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)


    const { data: { session } } = await supabase.auth.getSession()
    const user = session?.user

    if (!user) {
      alert('No user session found.')
      return
    }

    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      role,
      phone_number: phone,
      company_name: role === 'seller' ? company : null,
      //   updated_at: new Date().toISOString(),
    })

    if (error) {
      alert('Error saving profile: ' + error.message)
    } else {
      await supabase.auth.refreshSession()
      router.push(role === 'seller' ? '/seller/dashboard' : '/')
    }

    setIsLoading(false)
  }

  return (
    <div className="max-w-md mx-auto mt-16 space-y-6 px-4">
      <h1 className="text-2xl font-semibold text-center">Complete Your Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>Role</Label>
          <RadioGroup defaultValue="user" onValueChange={setRole}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="user" id="user" />
              <Label htmlFor="user">Traveler</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="seller" id="seller" />
              <Label htmlFor="seller">Seller</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        {role === 'seller' && (
          <div className="space-y-2">
            <Label htmlFor="company">Company Name</Label>
            <Input
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            />
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Continue'}
        </Button>
      </form>
    </div>
  )
}
