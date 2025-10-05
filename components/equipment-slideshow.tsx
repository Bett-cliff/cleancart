"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Star, Heart, ShoppingCart } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

interface Equipment {
  id: string
  name: string
  price: string
  originalPrice?: string
  image: string
  rating: number
  reviews: number
  badge: string
  vendor: string
}

interface EquipmentSlideshowProps {
  title: string
  subtitle: string
  equipment: Equipment[]
  autoPlay?: boolean
}

export function EquipmentSlideshow({ title, subtitle, equipment, autoPlay = true }: EquipmentSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const { toast } = useToast()
  const itemsPerView = 3

  const addToCart = (equipmentName: string) => {
    toast({
      title: "Added to cart!",
      description: `${equipmentName} has been added to your cart.`,
    })
  }

  const addToWishlist = (equipmentName: string) => {
    toast({
      title: "Added to wishlist!",
      description: `${equipmentName} has been saved to your wishlist.`,
    })
  }

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + itemsPerView >= equipment.length ? 0 : prevIndex + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? Math.max(0, equipment.length - itemsPerView) : prevIndex - 1))
  }

  useEffect(() => {
    if (autoPlay) {
      const interval = setInterval(nextSlide, 4000)
      return () => clearInterval(interval)
    }
  }, [autoPlay])

  const visibleEquipment = equipment.slice(currentIndex, currentIndex + itemsPerView)

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold mb-2">{title}</h3>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className="h-8 w-8 p-0 bg-transparent"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={nextSlide}
            disabled={currentIndex + itemsPerView >= equipment.length}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {visibleEquipment.map((item) => (
          <Card
            key={item.id}
            className="group hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1"
          >
            <div className="relative overflow-hidden rounded-t-lg">
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                width={300}
                height={200}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <Badge className="absolute top-2 left-2 text-xs">{item.badge}</Badge>
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                onClick={() => addToWishlist(item.name)}
              >
                <Heart className="w-4 h-4" />
              </Button>
            </div>
            <CardContent className="p-4">
              <h4 className="font-semibold text-sm mb-1 line-clamp-2">{item.name}</h4>
              <p className="text-xs text-muted-foreground mb-2">by {item.vendor}</p>
              <div className="flex items-center mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < Math.floor(item.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground ml-1">({item.reviews})</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-primary text-sm">{item.price}</span>
                  {item.originalPrice && (
                    <span className="text-xs text-muted-foreground line-through">{item.originalPrice}</span>
                  )}
                </div>
                <Button
                  size="sm"
                  className="text-xs hover:scale-105 transition-transform duration-200"
                  onClick={() => addToCart(item.name)}
                >
                  <ShoppingCart className="w-3 h-3 mr-1" />
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: Math.ceil(equipment.length / itemsPerView) }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index * itemsPerView)}
            className={`w-2 h-2 rounded-full transition-colors duration-200 ${
              Math.floor(currentIndex / itemsPerView) === index ? "bg-primary" : "bg-muted-foreground/30"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
