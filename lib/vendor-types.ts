export interface Vendor {
    id: string
    userId: string
    businessName: string
    businessEmail: string
    businessPhone: string
    businessRegistration: string
    kraPin: string
    businessAddress: {
      street: string
      city: string
      county: string
      postalCode: string
    }
    contactPerson: {
      name: string
      email: string
      phone: string
      idNumber: string
    }
    documents: {
      idCopy: string
      businessRegistrationCert: string
      kraPinCert: string
      otherDocuments: string[]
    }
    subscriptionPlan: 'free' | 'basic' | 'pro' | 'premium'
    subscriptionStatus: 'active' | 'inactive' | 'suspended' | 'pending'
    storefront: {
      storeName: string
      storeDescription: string
      logo: string
      banner: string
      theme: string
      socialLinks: {
        website?: string
        facebook?: string
        instagram?: string
        twitter?: string
      }
    }
    payoutDetails: {
      method: 'mpesa' | 'bank'
      mpesaTill?: string
      mpesaPaybill?: string
      bankName?: string
      bankAccount?: string
      bankBranch?: string
    }
    verification: {
      status: 'pending' | 'verified' | 'rejected' | 'under_review'
      verifiedAt?: string
      verifiedBy?: string
      rejectionReason?: string
    }
    stats: {
      totalProducts: number
      totalOrders: number
      totalRevenue: number
      averageRating: number
      totalReviews: number
    }
    settings: {
      autoConfirmOrders: boolean
      lowStockAlerts: boolean
      emailNotifications: boolean
      smsNotifications: boolean
    }
    createdAt: string
    updatedAt: string
  }
  
  export interface VendorSubscription {
    id: string
    vendorId: string
    plan: 'free' | 'basic' | 'pro' | 'premium'
    price: number
    features: string[]
    limits: {
      products: number
      storage: string
      staffAccounts: number
      analytics: boolean
      support: string
    }
    status: 'active' | 'canceled' | 'past_due' | 'unpaid'
    currentPeriodStart: string
    currentPeriodEnd: string
    createdAt: string
  }
  
  export interface VendorDocument {
    id: string
    vendorId: string
    type: 'id_copy' | 'business_registration' | 'kra_pin' | 'other'
    fileName: string
    fileUrl: string
    fileSize: number
    uploadedAt: string
    status: 'pending' | 'approved' | 'rejected'
  }
  
  export interface VendorVerificationStep {
    id: string
    name: string
    description: string
    status: 'pending' | 'completed' | 'failed'
    required: boolean
    order: number
  }