"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface FiltersModalProps {
  isOpen: boolean
  onClose: () => void
  priceRange: number[]
  setPriceRange: (range: number[]) => void
  categories: string[]
  selectedCategories: string[]
  onCategoryChange: (category: string) => void
  onReset: () => void
  onApply: () => void
}

export function FiltersModal({
  isOpen,
  onClose,
  priceRange,
  setPriceRange,
  categories,
  selectedCategories,
  onCategoryChange,
  onReset,
  onApply
}: FiltersModalProps) {
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-background z-50 shadow-xl overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Filters</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Price Range */}
          <div className="mb-8">
            <Label className="text-base font-semibold mb-4 block">Price Range</Label>
            <div className="px-2">
              <Slider
                defaultValue={[0, 100000]}
                max={100000}
                step={1000}
                value={priceRange}
                onValueChange={setPriceRange}
              />
              <div className="flex justify-between mt-4 text-sm text-muted-foreground">
                <span>₹{priceRange[0].toLocaleString()}</span>
                <span>₹{priceRange[1].toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="mb-8">
            <Label className="text-base font-semibold mb-4 block">Categories</Label>
            <div className="space-y-3">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-3">
                  <Checkbox
                    id={`modal-${category}`}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => onCategoryChange(category)}
                  />
                  <Label 
                    htmlFor={`modal-${category}`} 
                    className="text-sm font-normal cursor-pointer flex-1"
                  >
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t sticky bottom-0 bg-background pb-6">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onReset}
            >
              Clear All
            </Button>
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                onApply()
                onClose()
              }}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
