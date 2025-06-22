'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from '@/hooks/use-toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { ImageUpload } from "@/components/ui/image-upload";
import { useAuth } from "@/app/contexts/auth-context"
import { Eye, EyeClosed } from "lucide-react";

interface ProfileFormProps {
  initialProfile: any
}

export function ProfileForm({ initialProfile }: ProfileFormProps) {
  const [profile, setProfile] = useState(initialProfile)
  const [isSaving, setIsSaving] = useState(false)
  const [showUploader, setShowUploader] = useState(false);
  const { reAuthenticate } = useAuth()


  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordChanging, setIsPasswordChanging] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const supabase = createClientComponentClient()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfile((prev: any) => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: 'Error',
        description: 'Please fill in all password fields',
        variant: 'destructive',
      })

      return;
    }

    if (newPassword != confirmPassword) {
      toast({
        title: 'Error',
        description: 'New Password and Confirm Password do not match',
        variant: 'destructive'
      })

      return;
    }

    try {
      const { error: authenticateError } = await reAuthenticate(profile.name, currentPassword);

      //Authenticate current password
      if (authenticateError) {
        toast({
          title: 'Error',
          description: 'Current Password is wrong!',
          variant: 'destructive'
        })

        return;
      }

      toast({
        title: 'Success',
        description: 'Current Password is correct, updating password...',
        variant: 'success'
      })
      setIsPasswordChanging(true)

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        toast({
          title: 'Error',
          description: 'Error changing password, try again later!',
          variant: 'destructive'
        })
        throw updateError;
      }

      toast({
        title: 'Success',
        description: 'Password changed successfully',
        variant: 'success'
      })
      setIsPasswordChanging(false)
      setNewPassword("");
      setConfirmPassword("");
      setCurrentPassword("");
    }
    catch (error) {
      toast({
        title: 'Error',
        description: 'Error changing password',
        variant: 'destructive'
      })
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)

      const { error } = await supabase
        .from('profiles')
        .update({
          user_name: profile.user_name,
          bio: profile.bio,
          avatar_url: profile.avatar_url
        })
        .eq('id', profile.id)

      if (error) throw error

      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully',
        variant: 'success',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      })
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Tabs defaultValue="personal">
      <TabsList className="mb-6">
        <TabsTrigger value="personal">Personal Information</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="preferences">Preferences</TabsTrigger>
      </TabsList>

      <TabsContent value="personal">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Update your personal information and how others see you on the platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center space-y-2">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile.avatar_url} alt={profile.name} />
                  <AvatarFallback>{profile.name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>

                {/* Toggle Uploader */}
                {showUploader ? (
                  <ImageUpload
                    currentImages={profile.avatar_url ? [profile.avatar_url] : []}
                    maxImages={1}
                    onUploadComplete={(urls) => {
                      const newAvatar = urls[0];
                      setProfile((prev: any) => ({
                        ...prev,
                        avatar_url: newAvatar,
                      }));
                      setShowUploader(false);
                      toast({
                        title: "Avatar uploaded",
                        description: "New avatar has been added. Don’t forget to save.",
                        variant: "success",
                      });
                    }}
                  />
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowUploader(true)}
                  >
                    Change Avatar
                  </Button>
                )}
              </div>


              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Username</Label>
                    <Input
                      id="user_name"
                      name="user_name"
                      value={profile.user_name || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={profile.name || ''}
                      disabled
                    />
                    <p className="text-xs text-muted-foreground">
                      Your email cannot be changed
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={profile.bio || ''}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tell us about yourself"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="security">
        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>
              Manage your account security settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Change Password</h3>
                <p className="text-sm text-muted-foreground">
                  Update your password to keep your account secure
                </p>
              </div>
              <Separator />
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current_password">Current Password</Label>
                  <div className='relative max-w-full md:max-w-xs'>
                    <Input
                      id="current_password"
                      type={showCurrentPassword ? 'text' : 'password'}
                      className=''
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className='absolute top-2.5 right-3 text-muted-foreground'
                      aria-label="Toggle password visibility"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeClosed className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                </div>
                <div className="space-y-2">
                  <Label htmlFor="new_password">New Password</Label>
                  <div className='relative max-w-full md:max-w-xs'>
                    <Input
                      id="new_password"
                      type={showNewPassword ? 'text' : 'password'}
                      className=''
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className='absolute top-2.5 right-3 text-muted-foreground'
                      aria-label="Toggle password visibility"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeClosed className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm_password">Confirm New Password</Label>
                  <div className='relative max-w-full md:max-w-xs'>
                    <Input
                      id="confirm_password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      className=''
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className='absolute top-2.5 right-3 text-muted-foreground'
                      aria-label="Toggle password visibility"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeClosed className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <Button onClick={() => handlePasswordChange()}>
                  {isPasswordChanging ? "Updating" : "Update password"}
                </Button>
              </div>
            </div>

            {/* <div className="space-y-4 pt-6">
              <div>
                <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
              </div>
              <Separator />
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Two-factor authentication is not enabled yet. Enable two-factor authentication to add an extra layer of security to your account.
                </p>
                <Button variant="outline">Enable 2FA</Button>
              </div>
            </div> */}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="preferences">
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>
              Manage your notification and communication preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Email Notifications</h3>
                <p className="text-sm text-muted-foreground">
                  Choose what types of emails you want to receive
                </p>
              </div>
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Booking Confirmations</p>
                    <p className="text-sm text-muted-foreground">
                      Receive emails when your booking is confirmed
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="booking_confirmations" className="sr-only">
                      Booking Confirmations
                    </Label>
                    <Input
                      id="booking_confirmations"
                      type="checkbox"
                      className="h-4 w-4"
                      defaultChecked
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Marketing Emails</p>
                    <p className="text-sm text-muted-foreground">
                      Receive emails about new features and special offers
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="marketing_emails" className="sr-only">
                      Marketing Emails
                    </Label>
                    <Input
                      id="marketing_emails"
                      type="checkbox"
                      className="h-4 w-4"
                      defaultChecked
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Travel Tips & Guides</p>
                    <p className="text-sm text-muted-foreground">
                      Receive emails with travel tips and destination guides
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="travel_tips" className="sr-only">
                      Travel Tips & Guides
                    </Label>
                    <Input
                      id="travel_tips"
                      type="checkbox"
                      className="h-4 w-4"
                      defaultChecked
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button>Save Preferences</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
