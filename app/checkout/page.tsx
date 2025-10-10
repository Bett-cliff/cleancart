"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft,
  CreditCard,
  Lock,
  MapPin,
  User,
  Phone,
  Mail,
  Truck,
  Shield,
  CheckCircle,
  Package,
  Smartphone,
  Building
} from "lucide-react"
import Link from "next/link"
import { useCart } from "@/app/contexts/CartContext"
import FixedNavbar from "@/app/components/FixedNavbar"
import { useState } from "react"

// Payment method types
type PaymentMethod = 'card' | 'mpesa' | 'paypal'

// Order interface
interface OrderData {
  orderNumber: string
  customerInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
    zipCode: string
  }
  paymentMethod: PaymentMethod
  paymentPhone?: string
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
  }>
  subtotal: number
  deliveryFee: number
  tax: number
  grandTotal: number
  timestamp: Date
}

export default function CheckoutPage() {
  const { state, cartItemsCount, clearCart } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('mpesa')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    mpesaPhone: ''
  })

  // Add safe access to state properties
  const items = state?.items || []
  const total = state?.total || 0

  const deliveryFee = total > 5000 ? 0 : 300
  const tax = total * 0.14 // 14% VAT
  const grandTotal = total + deliveryFee + tax

  // Generate vendor-friendly order number
  const generateOrderNumber = (): string => {
    const timestamp = Date.now().toString().slice(-6) // Last 6 digits of timestamp
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0') // 3 random digits
    const prefix = 'ECO' // Your business prefix
    return `${prefix}-${timestamp}${random}`
  }

  // Store order in localStorage for vendor access
  const storeOrderForVendor = (orderData: OrderData) => {
    try {
      // Get existing orders or initialize empty array
      const existingOrders = JSON.parse(localStorage.getItem('vendorOrders') || '[]')
      
      // Add new order
      const updatedOrders = [orderData, ...existingOrders]
      
      // Store in localStorage (in real app, this would be an API call)
      localStorage.setItem('vendorOrders', JSON.stringify(updatedOrders))
      
      console.log('Order stored for vendor:', orderData.orderNumber)
    } catch (error) {
      console.error('Error storing order for vendor:', error)
    }
  }

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Validate form
  const validateForm = () => {
    // Check required personal info fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      alert('Please fill in all required fields: ' + missingFields.map(field => {
        switch(field) {
          case 'firstName': return 'First Name';
          case 'lastName': return 'Last Name';
          case 'email': return 'Email';
          case 'phone': return 'Phone Number';
          case 'address': return 'Delivery Address';
          case 'city': return 'City';
          default: return field;
        }
      }).join(', '));
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address');
      return false;
    }

    // Kenyan phone number validation for main phone
    const phoneRegex = /^(?:254|\+254|0)?(7[0-9]{8})$/;
    const cleanMainPhone = formData.phone.replace(/\s/g, '');
    
    if (!phoneRegex.test(cleanMainPhone)) {
      alert('Please enter a valid Kenyan phone number (e.g., 0712 345 678 or +254 712 345 678)');
      return false;
    }

    // Payment method specific validation
    if (selectedPayment === 'mpesa') {
      // Use mpesaPhone if provided, otherwise use main phone
      const mpesaNumber = formData.mpesaPhone || formData.phone;
      
      if (!mpesaNumber) {
        alert('Please enter your M-Pesa phone number');
        return false;
      }
      
      // Kenyan phone number validation for M-Pesa
      const cleanMpesaNumber = mpesaNumber.replace(/\s/g, '');
      
      if (!phoneRegex.test(cleanMpesaNumber)) {
        alert('Please enter a valid Kenyan M-Pesa number (e.g., 0712 345 678 or +254 712 345 678)');
        return false;
      }
    }

    if (selectedPayment === 'card') {
      const cardFields = ['cardNumber', 'cardExpiry', 'cardCvc'];
      const missingCardFields = cardFields.filter(field => !formData[field as keyof typeof formData]);
      
      if (missingCardFields.length > 0) {
        alert('Please complete your card details');
        return false;
      }

      // Basic card validation
      const cleanCardNumber = formData.cardNumber.replace(/\s/g, '');
      if (cleanCardNumber.length < 16) {
        alert('Please enter a valid 16-digit card number');
        return false;
      }

      if (formData.cardCvc.length < 3) {
        alert('Please enter a valid 3-digit CVC code');
        return false;
      }
    }

    return true;
  }

  // Simulate M-Pesa payment
  const simulateMpesaPayment = async (phone: string, amount: number) => {
    console.log(`Sending M-Pesa prompt to: ${phone} for KSh ${amount}`)
    
    // Simulate API call to M-Pesa
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Simulate successful payment (in real app, you'd check payment status from API)
    return Math.random() > 0.1 // 90% success rate for demo
  }

  // Simulate card payment
  const simulateCardPayment = async (cardData: any) => {
    console.log('Processing card payment...', cardData)
    
    // Simulate API call to payment gateway
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Simulate successful payment
    return Math.random() > 0.1 // 90% success rate for demo
  }

  // Simulate PayPal payment
  const simulatePaypalPayment = async () => {
    console.log('Redirecting to PayPal...')
    
    // Simulate redirect and callback
    await new Promise(resolve => setTimeout(resolve, 2500))
    
    return Math.random() > 0.1 // 90% success rate for demo
  }

  const handlePlaceOrder = async () => {
    if (!validateForm()) return

    setIsProcessing(true)

    try {
      let paymentSuccess = false
      let paymentPhone = ''

      // Process payment based on selected method
      switch (selectedPayment) {
        case 'mpesa':
          // Use mpesaPhone if provided, otherwise use main phone
          paymentPhone = formData.mpesaPhone || formData.phone
          paymentSuccess = await simulateMpesaPayment(paymentPhone, grandTotal)
          break
        
        case 'card':
          paymentSuccess = await simulateCardPayment({
            number: formData.cardNumber,
            expiry: formData.cardExpiry,
            cvc: formData.cardCvc
          })
          break
        
        case 'paypal':
          paymentSuccess = await simulatePaypalPayment()
          break
        
        default:
          paymentSuccess = false
      }

      if (paymentSuccess) {
        // Generate order data
        const orderNumber = generateOrderNumber()
        const orderData: OrderData = {
          orderNumber,
          customerInfo: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            zipCode: formData.zipCode
          },
          paymentMethod: selectedPayment,
          paymentPhone: selectedPayment === 'mpesa' ? paymentPhone : undefined,
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
          })),
          subtotal: total,
          deliveryFee,
          tax,
          grandTotal,
          timestamp: new Date()
        }

        // Store order for vendor access
        storeOrderForVendor(orderData)

        // Clear cart
        clearCart()

        // Redirect to success page with order number
        window.location.href = `/success?order=${orderNumber}`
      } else {
        alert('Payment failed. Please try again or use a different payment method.')
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert('An error occurred during payment. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    return value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim()
  }

  // Format expiry date
  const formatExpiryDate = (value: string) => {
    return value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').substr(0, 5)
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
        <FixedNavbar cartItemsCount={cartItemsCount} />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
          <Card className="border-emerald-100 bg-emerald-50 max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-600 mb-6">
                Add some eco-friendly products to your cart before checking out
              </p>
              <Link href="/">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  Continue Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <FixedNavbar cartItemsCount={cartItemsCount} />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <Badge className="bg-emerald-600 text-white">1</Badge>
            <span className="ml-2 font-medium text-emerald-600">Cart</span>
          </div>
          <div className="w-8 h-0.5 bg-emerald-600 mx-4"></div>
          <div className="flex items-center">
            <Badge className="bg-emerald-600 text-white">2</Badge>
            <span className="ml-2 font-medium text-emerald-600">Checkout</span>
          </div>
          <div className="w-8 h-0.5 bg-gray-300 mx-4"></div>
          <div className="flex items-center">
            <Badge variant="outline" className="text-gray-400">3</Badge>
            <span className="ml-2 font-medium text-gray-400">Confirmation</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Checkout Form */}
          <div className="space-y-6">
            {/* Delivery Information */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Delivery Information</h2>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 mb-1">
                      First Name *
                    </Label>
                    <Input 
                      id="firstName"
                      placeholder="John" 
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-sm font-medium text-gray-700 mb-1">
                      Last Name *
                    </Label>
                    <Input 
                      id="lastName"
                      placeholder="Doe" 
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </Label>
                    <Input 
                      id="email"
                      type="email" 
                      placeholder="john@example.com" 
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </Label>
                    <Input 
                      id="phone"
                      type="tel" 
                      placeholder="0712 345 678" 
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Format: 0712 345 678 or +254 712 345 678
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="address" className="text-sm font-medium text-gray-700 mb-1">
                      Delivery Address *
                    </Label>
                    <Input 
                      id="address"
                      placeholder="Street address, apartment, suite, etc." 
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city" className="text-sm font-medium text-gray-700 mb-1">
                        City *
                      </Label>
                      <Input 
                        id="city"
                        placeholder="Nairobi" 
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode" className="text-sm font-medium text-gray-700 mb-1">
                        ZIP Code
                      </Label>
                      <Input 
                        id="zipCode"
                        placeholder="00100" 
                        value={formData.zipCode}
                        onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h2>
                
                <RadioGroup value={selectedPayment} onValueChange={(value) => setSelectedPayment(value as PaymentMethod)} className="space-y-3">
                  {/* M-Pesa Option */}
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="mpesa" id="mpesa" />
                    <Label htmlFor="mpesa" className="flex items-center gap-3 cursor-pointer flex-1">
                      <div className="w-10 h-10 bg-orange-500 rounded flex items-center justify-center">
                        <Smartphone className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">M-Pesa</div>
                        <div className="text-xs text-gray-500">Pay via M-Pesa mobile money</div>
                      </div>
                    </Label>
                  </div>

                  {selectedPayment === 'mpesa' && (
                    <div className="ml-7 p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <Label htmlFor="mpesaPhone" className="text-sm font-medium text-gray-700 mb-2 block">
                        M-Pesa Phone Number *
                      </Label>
                      <Input 
                        id="mpesaPhone"
                        placeholder="0712 345 678 or +254 712 345 678" 
                        value={formData.mpesaPhone}
                        onChange={(e) => handleInputChange('mpesaPhone', e.target.value)}
                        className="mb-2"
                      />
                      <p className="text-xs text-orange-700">
                        {formData.phone ? `We'll use ${formData.phone} if left blank. ` : ''}
                        You will receive an M-Pesa prompt to complete payment of KSh {grandTotal.toLocaleString()}
                      </p>
                    </div>
                  )}

                  {/* Card Option */}
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-3 cursor-pointer flex-1">
                      <div className="w-10 h-10 bg-blue-500 rounded flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">Credit/Debit Card</div>
                        <div className="text-xs text-gray-500">Pay with Visa, Mastercard, or American Express</div>
                      </div>
                    </Label>
                  </div>

                  {selectedPayment === 'card' && (
                    <div className="ml-7 p-4 bg-blue-50 rounded-lg border border-blue-200 space-y-3">
                      <div>
                        <Label htmlFor="cardNumber" className="text-sm font-medium text-gray-700 mb-1 block">
                          Card Number *
                        </Label>
                        <Input 
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456" 
                          value={formData.cardNumber}
                          onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                          maxLength={19}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="cardExpiry" className="text-sm font-medium text-gray-700 mb-1 block">
                            Expiry Date *
                          </Label>
                          <Input 
                            id="cardExpiry"
                            placeholder="MM/YY" 
                            value={formData.cardExpiry}
                            onChange={(e) => handleInputChange('cardExpiry', formatExpiryDate(e.target.value))}
                            maxLength={5}
                          />
                        </div>
                        <div>
                          <Label htmlFor="cardCvc" className="text-sm font-medium text-gray-700 mb-1 block">
                            CVC *
                          </Label>
                          <Input 
                            id="cardCvc"
                            placeholder="123" 
                            value={formData.cardCvc}
                            onChange={(e) => handleInputChange('cardCvc', e.target.value.replace(/\D/g, '').substr(0, 3))}
                            maxLength={3}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PayPal Option */}
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Label htmlFor="paypal" className="flex items-center gap-3 cursor-pointer flex-1">
                      <div className="w-10 h-10 bg-blue-500 rounded flex items-center justify-center">
                        <Building className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">PayPal</div>
                        <div className="text-xs text-gray-500">Pay with your PayPal account</div>
                      </div>
                    </Label>
                  </div>

                  {selectedPayment === 'paypal' && (
                    <div className="ml-7 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-700">
                        You will be redirected to PayPal to complete your payment of KSh {grandTotal.toLocaleString()}
                      </p>
                    </div>
                  )}
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                
                {/* Items List */}
                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-100 rounded flex items-center justify-center">
                          <Package className="w-3 h-3 text-emerald-600" />
                        </div>
                        <div>
                          <p className="font-medium line-clamp-1">{item.name}</p>
                          <p className="text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-medium">KSh {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                {/* Pricing */}
                <div className="space-y-2 border-t pt-4">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>KSh {total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Delivery</span>
                    <span className={deliveryFee === 0 ? "text-green-600" : ""}>
                      {deliveryFee === 0 ? "FREE" : `KSh ${deliveryFee}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax (14%)</span>
                    <span>KSh {tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>Total</span>
                    <span className="text-emerald-600">KSh {grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* Place Order Button */}
                <Button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 text-lg font-semibold mt-6"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5 mr-2" />
                      Place Order - KSh {grandTotal.toLocaleString()}
                    </>
                  )}
                </Button>

                {/* Security Notice */}
                <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-500">
                  <Shield className="w-3 h-3" />
                  <span>Secure SSL Encryption • Your data is protected</span>
                </div>

                {/* Back to Cart */}
                <Link href="/cart">
                  <Button variant="outline" className="w-full mt-3">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Cart
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Security Features */}
            <Card className="border-emerald-200 bg-emerald-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-600" />
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-emerald-600" />
                    <span>Free Delivery Over KSh 5,000</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}