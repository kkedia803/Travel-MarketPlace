'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

interface Package {
  id: string
  title: string
}

interface DeletePackageDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  packageData: Package | null
  onDelete: () => void
}

export function DeletePackageDialog({ open, onOpenChange, packageData, onDelete }: DeletePackageDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()
  
  const handleDelete = async () => {
    if (!packageData) return
    
    try {
      setIsDeleting(true)
      
      const response = await fetch(`/api/seller/packages/${packageData.id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete package')
      }
      
      toast({
        title: 'Package Deleted',
        description: 'Your package has been deleted successfully',
      })
      
      onDelete()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete package',
        variant: 'destructive',
      })
      console.error(error)
    } finally {
      setIsDeleting(false)
    }
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Package</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{packageData?.id}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Package'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
