"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion"
import Image from "next/image"
import { Cpu, Battery, Zap, Maximize } from "lucide-react"

interface FeatureSectionProps {
  scrollYProgress: MotionValue<number>
}

export default function FeatureSection({ scrollYProgress }: FeatureSectionProps) {
  const ref = useRef(null)
  const { scrollYProgress: sectionProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const features = [
    {
      icon: <Cpu className="h-8 w-8" />,
      title: "M2 Pro chip",
      description: "Up to 12-core CPU and 19-core GPU for incredible performance.",
      color: "text-apple-red",
      bgColor: "bg-apple-red/10",
      borderColor: "border-apple-red/30",
      shadowColor: "shadow-apple-red/20",
    },
    {
      icon: <Battery className="h-8 w-8" />,
      title: "Up to 22 hours",
      description: "The longest battery life ever in a Mac.",
      color: "text-apple-green",
      bgColor: "bg-apple-green/10",
      borderColor: "border-apple-green/30",
      shadowColor: "shadow-apple-green/20",
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Blazing-fast SSD",
      description: "Up to 8TB of superfast SSD storage.",
      color: "text-apple-orange",
      bgColor: "bg-apple-orange/10",
      borderColor: "border-apple-orange/30",
      shadowColor: "shadow-apple-orange/20",
    },
    {
      icon: <Maximize className="h-8 w-8" />,
      title: "Liquid Retina XDR",
      description: "The best display ever in a notebook.",
      color: "text-apple-blue",
      bgColor: "bg-apple-blue/10",
      borderColor: "border-apple-blue/30",
      shadowColor: "shadow-apple-blue/20",
    },
  ]

  return (
    <section ref={ref} className="py-24 md:py-32 bg-white dark:bg-gray-950 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute top-0 left-0 w-full h-full animated-gradient"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            <span className="colorful-gradient">Engineered to the extreme</span>
          </h2>
          <p className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300">
            The most advanced systems and technologies in a Mac.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className={`${feature.bgColor} border ${feature.borderColor} p-8 rounded-3xl shadow-lg ${feature.shadowColor} hover:shadow-xl transition-all duration-300`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              whileHover={{ y: -10 }}
            >
              <motion.div
                className={`${feature.color} mb-4`}
                whileInView={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, 0],
                }}
                transition={{
                  duration: 0.8,
                  delay: 0.2 + index * 0.1,
                  ease: "easeInOut",
                }}
                viewport={{ once: true }}
              >
                {feature.icon}
              </motion.div>
              <h3 className={`text-xl font-semibold ${feature.color} mb-2`}>{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="relative h-[500px] md:h-[600px] rounded-3xl overflow-hidden"
          style={{
            scale: useTransform(sectionProgress, [0.3, 0.6], [0.9, 1]),
            opacity: useTransform(sectionProgress, [0.3, 0.6], [0.6, 1]),
          }}
        >
          <Image
            src="/placeholder.svg?height=600&width=1200"
            alt="MacBook Pro Features"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
            <div className="p-8 md:p-16 max-w-lg">
              <motion.h3
                className="text-3xl md:text-4xl font-bold text-white mb-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <span className="bg-gradient-to-r from-apple-yellow to-apple-orange bg-clip-text text-transparent">
                  Designed for performance
                </span>
              </motion.h3>
              <motion.p
                className="text-white/90 text-lg"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Every component has been optimized to deliver unprecedented power and capability.
              </motion.p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
