'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Edit, Trash2, ExternalLink } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import { PackageDialog } from './package-dialog'
import { DeletePackageDialog } from './delete-package-dialog'
import Link from 'next/link'
import Image from 'next/image'

interface Package {
  id: string
  title: string
  description: string
  destination: string
  price: number
  duration: number
  category: string
  is_approved: boolean
  images: string[]
}

interface SellerPackagesProps {
  sellerId: string
}

export function SellerPackages({ sellerId }: SellerPackagesProps) {
  const [packages, setPackages] = useState<Package[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isPackageDialogOpen, setIsPackageDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentPackage, setCurrentPackage] = useState<Package | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchPackages()
  }, [])

  const fetchPackages = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/seller/packages')
      
      if (!response.ok) {
        throw new Error('Failed to fetch packages')
      }
      
      const data = await response.json()
      setPackages(data)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load packages',
        variant: 'destructive',
      })
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddPackage = () => {
    setCurrentPackage(null)
    setIsPackageDialogOpen(true)
  }

  const handleEditPackage = (pkg: Package) => {
    setCurrentPackage(pkg)
    setIsPackageDialogOpen(true)
  }

  const handleDeletePackage = (pkg: Package) => {
    setCurrentPackage(pkg)
    setIsDeleteDialogOpen(true)
  }

  const handlePackageSaved = () => {
    fetchPackages()
    setIsPackageDialogOpen(false)
  }

  const handlePackageDeleted = () => {
    fetchPackages()
    setIsDeleteDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Packages</h2>
        <Button onClick={handleAddPackage}>
          <Plus className="mr-2 h-4 w-4" /> Add Package
        </Button>
      </div>
      
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="h-48 bg-muted animate-pulse" />
              <CardContent className="p-4 space-y-2">
                <div className="h-6 bg-muted animate-pulse rounded" />
                <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : packages.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="mb-4 text-muted-foreground">You haven't created any packages yet.</p>
            <Button onClick={handleAddPackage}>
              <Plus className="mr-2 h-4 w-4" /> Create Your First Package
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <Card key={pkg.id} className="overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={pkg.images[0] || '/placeholder.svg?height=192&width=384'}
                  alt={pkg.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant={pkg.is_approved ? 'default' : 'outline'}>
                    {pkg.is_approved ? 'Approved' : 'Pending'}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-1">{pkg.title}</h3>
                <p className="text-muted-foreground mb-2">{pkg.destination}</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-lg">₹{pkg.price}</span>
                  <span className="text-sm text-muted-foreground">{pkg.duration} days</span>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/packages/${pkg.id}`}>
                      <ExternalLink className="mr-1 h-4 w-4" /> View
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEditPackage(pkg)}
                  >
                    <Edit className="mr-1 h-4 w-4" /> Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDeletePackage(pkg)}
                  >
                    <Trash2 className="mr-1 h-4 w-4" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      <PackageDialog 
        open={isPackageDialogOpen} 
        onOpenChange={setIsPackageDialogOpen}
        packageData={currentPackage}
        onSave={handlePackageSaved}
      />
      
      <DeletePackageDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        packageData={currentPackage}
        onDelete={handlePackageDeleted}
      />
    </div>
  )
}
