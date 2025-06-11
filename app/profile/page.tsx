import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { ProfileForm } from '@/components/profile/profile-form'

export const metadata: Metadata = {
  title: 'Profile | TravelMarketplace',
  description: 'Manage your profile and account settings',
}

export default async function ProfilePage() {

  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })


  const {
    data: { session: session },
    error: sessionError,
  } = await supabase.auth.getSession()

  if (sessionError) {
    console.error('Session fetch error:', sessionError.message)
  }

  if (!session) {
    redirect('/auth/login');
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session?.user.id)
    .single();

  if (error) {
    return <div>Error loading profile: {error.message}</div>;
  }

  if (!profile) {
    return <div>No profile found.</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      <ProfileForm initialProfile={profile} />
    </div>
  );
}
