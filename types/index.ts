export interface Model3D {
  id: string
  title: string
  description: string
  price: number
  category: string
  tags: string[]
  images: string[]
  fileUrl: string
  rating: number
  reviews: number
  downloads: number
  likes: number
  author: {
    id: string
    name: string
    avatar: string
    verified: boolean
  }
  materials: string[]
  difficulty: "beginner" | "intermediate" | "advanced" | "expert"
  printTime: string
  supports: boolean
  createdAt: string // ISO date string
  featured: boolean
}

export interface PlatformStats {
  totalModels: number
  totalCreators: number
  totalDownloads: number
  totalUsers: number
  totalPrinters: number
  totalOrders: number
}
