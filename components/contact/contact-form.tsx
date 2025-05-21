'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { supabase } from '@/lib/supabase'
import { z } from 'zod'

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  subject: z.string().min(1, { message: "Please select a subject" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" })
});

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }
  
  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      subject: value
    }))
    
    // Clear error when field is edited
    if (errors.subject) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors.subject
        return newErrors
      })
    }
  }
  
  const validateForm = () => {
    try {
      formSchema.parse(formData)
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        error.errors.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message
          }
        })
        setErrors(newErrors)
      }
      return false
    }
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please check the form for errors.',
        variant: 'destructive',
      })
      return
    }
    
    try {
      setIsSubmitting(true)
      
      // Insert data into Supabase
      const { data, error } = await supabase
        .from('contact_submissions')
        .insert([
          { 
            name: formData.name,
            email: formData.email,
            subject: formData.subject,
            message: formData.message,
            created_at: new Date().toISOString()
          }
        ])
      
      if (error) {
        throw new Error(error.message)
      }
      
      toast({
        title: 'Message Sent',
        description: 'Thank you for contacting us. We will get back to you soon!',
      })
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to send message. Please try again later.',
        variant: 'destructive',
      })
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className={errors.name ? "border-destructive" : ""}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          className={errors.email ? "border-destructive" : ""}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Select 
          value={formData.subject} 
          onValueChange={handleSelectChange} 
          required
        >
          <SelectTrigger 
            id="subject"
            className={errors.subject ? "border-destructive" : ""}
          >
            <SelectValue placeholder="Select a subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="general">General Inquiry</SelectItem>
            <SelectItem value="booking">Booking Question</SelectItem>
            <SelectItem value="seller">Become a Seller</SelectItem>
            <SelectItem value="support">Technical Support</SelectItem>
            <SelectItem value="feedback">Feedback</SelectItem>
          </SelectContent>
        </Select>
        {errors.subject && (
          <p className="text-sm text-destructive">{errors.subject}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={6}
          className={errors.message ? "border-destructive" : ""}
        />
        {errors.message && (
          <p className="text-sm text-destructive">{errors.message}</p>
        )}
      </div>
      
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  )
}
