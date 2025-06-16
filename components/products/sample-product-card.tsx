"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RainbowAddToCart } from "@/components/cart/rainbow-add-to-cart"
import { Star, Download, Printer, Heart, Eye } from "lucide-react"
import { motion } from "framer-motion"

interface ProductCardProps {
  id: string
  name: string
  description: string
  price: number
  image: string
  creatorName: string
  creatorId: string
  category: string
  tags: string[]
  type: "download" | "printed"
  rating?: number
  downloads?: number
}

export function SampleProductCard({
  id,
  name,
  description,
  price,
  image,
  creatorName,
  creatorId,
  category,
  tags,
  type,
  rating = 4.5,
  downloads = 0,
}: ProductCardProps) {
  const product = {
    id,
    name,
    description,
    price,
    image,
    creatorName,
    creatorId,
    category,
    tags,
    type,
  }

  return (
    <motion.div whileHover={{ y: -8, scale: 1.02 }} transition={{ duration: 0.3, type: "spring", stiffness: 200 }}>
      <Card className="group hover:shadow-2xl transition-all duration-500 overflow-hidden bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20 border-2 border-purple-100/50 dark:border-purple-700/30">
        <div className="relative aspect-square overflow-hidden">
          <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.4 }}>
            <Image src={image || "/placeholder.svg"} alt={name} fill className="object-cover" />
          </motion.div>

          {/* Overlay con gradiente */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="absolute top-3 left-3">
            <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ duration: 0.2 }}>
              <Badge
                variant={type === "printed" ? "default" : "secondary"}
                className={`text-xs font-bold ${
                  type === "printed"
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                    : "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                }`}
              >
                {type === "printed" ? (
                  <>
                    <Printer className="h-3 w-3 mr-1" />
                    Impreso
                  </>
                ) : (
                  <>
                    <Download className="h-3 w-3 mr-1" />
                    Digital
                  </>
                )}
              </Badge>
            </motion.div>
          </div>

          <div className="absolute top-3 right-3">
            <motion.div whileHover={{ scale: 1.1, rotate: -5 }} transition={{ duration: 0.2 }}>
              <Badge variant="outline" className="bg-white/90 text-purple-700 border-purple-200 font-semibold text-xs">
                {category}
              </Badge>
            </motion.div>
          </div>

          {/* Botón de vista rápida */}
          <motion.div
            className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100"
            initial={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <button className="bg-white/90 hover:bg-white text-purple-600 p-2 rounded-full shadow-lg">
              <Eye className="h-4 w-4" />
            </button>
          </motion.div>
        </div>

        <CardContent className="p-5">
          <div className="space-y-4">
            <div>
              <motion.h3
                className="font-bold text-lg line-clamp-1 text-purple-800 dark:text-purple-200"
                whileHover={{ scale: 1.02 }}
              >
                {name}
              </motion.h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mt-1">{description}</p>
              <motion.p
                className="text-sm bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mt-2 font-semibold flex items-center gap-1"
                whileHover={{ scale: 1.05 }}
              >
                <Heart className="h-3 w-3 text-pink-500" />
                por {creatorName}
              </motion.p>
            </div>

            <div className="flex items-center gap-3">
              <motion.div className="flex items-center gap-1" whileHover={{ scale: 1.1 }}>
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-semibold text-yellow-600">{rating}</span>
              </motion.div>
              {downloads > 0 && (
                <motion.div className="flex items-center gap-1 text-purple-500" whileHover={{ scale: 1.1 }}>
                  <Download className="h-3 w-3" />
                  <span className="text-xs font-medium">{downloads}</span>
                </motion.div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div>
                <motion.span
                  className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                >
                  ${price}
                </motion.span>
                {type === "printed" && <span className="text-xs text-purple-500 ml-2 font-medium">+ envío</span>}
              </div>
              <RainbowAddToCart product={product} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
