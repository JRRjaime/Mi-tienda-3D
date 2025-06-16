"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BarChart3, TrendingUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function AnalyticsFAB() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200 }}
    >
      <Link href="/analytics">
        <Button
          size="lg"
          className="h-14 w-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-300 group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <AnimatePresence mode="wait">
            {isHovered ? (
              <motion.div
                key="trending"
                initial={{ rotate: -180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 180, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <TrendingUp className="h-6 w-6" />
              </motion.div>
            ) : (
              <motion.div
                key="chart"
                initial={{ rotate: -180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 180, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <BarChart3 className="h-6 w-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </Link>

      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="absolute right-16 top-1/2 -translate-y-1/2 bg-black/80 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap"
          >
            📊 Ver Analytics
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-2 h-2 bg-black/80 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
