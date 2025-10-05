import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/hooks/use-toast"

export function useAddToCart() {
  const { dispatch } = useCart()
  const { toast } = useToast()

  const addToCart = (product: {
    id: string
    name: string
    price: number
    image: string
    vendor: string
    category: string
  }) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        ...product,
        quantity: 1
      }
    })

    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart.`,
    })
  }

  return { addToCart }
}