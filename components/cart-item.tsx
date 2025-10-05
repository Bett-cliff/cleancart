"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Plus, Minus } from "lucide-react"
import Image from "next/image"
import { CartItem as CartItemType } from "@/contexts/cart-context"
import { useCart } from "@/contexts/cart-context"

interface CartItemProps {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const { dispatch } = useCart()

  const updateQuantity = (newQuantity: number) => {
    if (newQuantity < 1) return
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { id: item.id, quantity: newQuantity }
    })
  }

  const removeItem = () => {
    dispatch({
      type: 'REMOVE_ITEM',
      payload: item.id
    })
  }

  return (
    <div className="flex items-center gap-4 py-6 border-b animate-in fade-in duration-300">
      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted">
        <Image
          src={item.image || "/placeholder.svg"}
          alt={item.name}
          fill
          className="object-cover"
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm md:text-base truncate">{item.name}</h3>
        <p className="text-sm text-muted-foreground">Vendor: {item.vendor}</p>
        <p className="text-sm text-muted-foreground">Category: {item.category}</p>
        <p className="text-lg font-bold text-primary mt-1">
          KSh {item.price.toLocaleString()}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => updateQuantity(item.quantity - 1)}
          disabled={item.quantity <= 1}
        >
          <Minus className="h-3 w-3" />
        </Button>
        
        <Input
          type="number"
          value={item.quantity}
          onChange={(e) => updateQuantity(parseInt(e.target.value) || 1)}
          className="w-16 h-8 text-center"
          min="1"
        />
        
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => updateQuantity(item.quantity + 1)}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>

      <div className="text-right min-w-20">
        <p className="font-bold text-lg">
          KSh {(item.price * item.quantity).toLocaleString()}
        </p>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={removeItem}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}