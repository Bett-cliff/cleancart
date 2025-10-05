"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, X, Send, Bot, User, ShoppingCart, Package, CreditCard, Truck } from "lucide-react"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

interface FAQ {
  question: string
  answer: string
  category: string
  icon: any
}

const faqs: FAQ[] = [
  {
    question: "Where's my order?",
    answer:
      "You can track your order status in your account dashboard or use our order tracking feature. We'll also send you SMS updates via M-PESA.",
    category: "Orders",
    icon: Package,
  },
  {
    question: "How do I return a product?",
    answer:
      "Returns are easy! Contact the vendor within 7 days of delivery. Go to your order history and click 'Request Return' for step-by-step instructions.",
    category: "Returns",
    icon: Package,
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept M-PESA, Visa, and MasterCard. M-PESA is our most popular option with instant confirmation and secure transactions.",
    category: "Payments",
    icon: CreditCard,
  },
  {
    question: "How fast is delivery?",
    answer:
      "Delivery times vary by location: Nairobi (1-2 days), major cities (2-3 days), rural areas (3-5 days). Express delivery available for urgent orders.",
    category: "Delivery",
    icon: Truck,
  },
  {
    question: "Suggest eco-friendly soaps under KSh 500",
    answer:
      "Great choice! Check out our Biodegradable Dish Soap (KSh 320) and Eco-Friendly All-Purpose Cleaner (KSh 450). Both are top-rated and environmentally safe.",
    category: "Products",
    icon: ShoppingCart,
  },
  {
    question: "Where do I find floor cleaners?",
    answer:
      "You can browse floor cleaners in our 'Household Cleaners' category or search 'floor cleaner' in the search bar. We have both eco-friendly and industrial options.",
    category: "Products",
    icon: ShoppingCart,
  },
]

export function HelpDesk() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hi! I'm your CleanCart assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [showFAQs, setShowFAQs] = useState(true)

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setShowFAQs(false)

    // Simple AI-like response logic
    setTimeout(() => {
      const botResponse = generateBotResponse(inputValue)
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
    }, 1000)
  }

  const generateBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()

    // Check for FAQ matches
    for (const faq of faqs) {
      if (input.includes(faq.question.toLowerCase().split(" ")[0]) || input.includes(faq.category.toLowerCase())) {
        return faq.answer
      }
    }

    // Product recommendations
    if (input.includes("recommend") || input.includes("suggest")) {
      return "I'd be happy to help! For eco-friendly products under KSh 500, I recommend our Biodegradable Dish Soap (KSh 320) and Organic Glass Cleaner (KSh 380). Both are customer favorites!"
    }

    // Order related
    if (input.includes("order") || input.includes("track")) {
      return "You can track your order in your account dashboard. If you need specific help with an order, please provide your order number and I'll assist you further."
    }

    // Payment related
    if (input.includes("payment") || input.includes("pay") || input.includes("mpesa")) {
      return "We accept M-PESA, Visa, and MasterCard. M-PESA payments are processed instantly. Is there a specific payment issue you're experiencing?"
    }

    // Default response
    return (
      "I understand you're asking about: '" +
      userInput +
      "'. Let me connect you with our human support team for personalized assistance. You can also browse our FAQ section below for common questions."
    )
  }

  const handleFAQClick = (faq: FAQ) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content: faq.question,
      sender: "user",
      timestamp: new Date(),
    }

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: faq.answer,
      sender: "bot",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage, botMessage])
    setShowFAQs(false)
  }

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50"
          size="lg"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[500px] shadow-2xl z-50 flex flex-col animate-in slide-in-from-bottom-4 duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 bg-primary text-primary-foreground rounded-t-lg">
            <CardTitle className="text-lg font-semibold">CleanCart Support</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.sender === "bot" && <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                        <div className="text-sm">{message.content}</div>
                        {message.sender === "user" && <User className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                      </div>
                    </div>
                  </div>
                ))}

                {/* FAQ Quick Actions */}
                {showFAQs && (
                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground text-center">Quick help topics:</div>
                    <div className="grid grid-cols-1 gap-2">
                      {faqs.slice(0, 4).map((faq, index) => {
                        const IconComponent = faq.icon
                        return (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="justify-start text-left h-auto p-3 hover:bg-muted bg-transparent"
                            onClick={() => handleFAQClick(faq)}
                          >
                            <IconComponent className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span className="text-xs">{faq.question}</span>
                          </Button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t p-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Type your message..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} size="sm">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center justify-center mt-2">
                <Badge variant="secondary" className="text-xs">
                  <Bot className="w-3 h-3 mr-1" />
                  AI-powered support
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}
