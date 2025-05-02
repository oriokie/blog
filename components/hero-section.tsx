"use client"

import { useRef } from "react"
import { motion, useTransform, type MotionValue } from "framer-motion"
import Image from "next/image"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeroSectionProps {
  scrollYProgress: MotionValue<number>
}

export default function HeroSection({ scrollYProgress }: HeroSectionProps) {
  const ref = useRef(null)

  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.8])
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])
  const y = useTransform(scrollYProgress, [0, 0.3], [0, -50])

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden animated-gradient pt-16"
    >
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />

      <motion.div className="container mx-auto px-4 md:px-6 text-center relative z-10" style={{ scale, opacity, y }}>
        <motion.h1
          className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Introducing the new
          <br />
          <span className="colorful-gradient">MacBook Pro</span>
        </motion.h1>

        <motion.p
          className="max-w-2xl mx-auto text-xl text-white mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Supercharged for pros. The most powerful MacBook Pro ever is here.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row justify-center gap-4 mb-12"
        >
          <Button className="bg-apple-pink hover:bg-apple-pink/90 text-white rounded-full px-8 py-6 text-lg">
            Buy now
          </Button>
          <Button
            variant="outline"
            className="border-white text-white rounded-full px-8 py-6 text-lg bg-white/10 hover:bg-white/20"
          >
            Learn more
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute inset-0 flex items-center justify-center z-0 mt-24"
        style={{ scale: useTransform(scrollYProgress, [0, 0.3], [1, 1.2]) }}
      >
        <Image
          src="/placeholder.svg?height=800&width=1200"
          alt="MacBook Pro"
          width={1200}
          height={800}
          className="max-w-full h-auto object-contain"
          priority
        />
      </motion.div>

      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 1.5,
          ease: "easeInOut",
        }}
      >
        <ChevronDown className="h-8 w-8 text-white" />
      </motion.div>
    </section>
  )
}
