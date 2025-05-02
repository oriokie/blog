"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion"
import Image from "next/image"

interface ShowcaseSectionProps {
  scrollYProgress: MotionValue<number>
}

export default function ShowcaseSection({ scrollYProgress }: ShowcaseSectionProps) {
  const ref = useRef(null)
  const { scrollYProgress: sectionProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const showcaseItems = [
    {
      title: "Liquid Retina XDR display",
      description: "The best display ever in a notebook features extreme dynamic range and incredible contrast ratio.",
      image: "/placeholder.svg?height=600&width=800",
    },
    {
      title: "Advanced camera system",
      description: "Look sharp and sound clear with the 1080p FaceTime HD camera and studio-quality three-mic array.",
      image: "/placeholder.svg?height=600&width=800",
    },
    {
      title: "Connectivity",
      description: "With Thunderbolt 4, HDMI, SDXC, and MagSafe 3, you're more connected than ever.",
      image: "/placeholder.svg?height=600&width=800",
    },
  ]

  // Create transform values at the top level
  const item0X = useTransform(sectionProgress, [0 * 0.2, 0 * 0.2 + 0.2], [0 % 2 === 0 ? -50 : 50, 0])
  const item0Opacity = useTransform(sectionProgress, [0 * 0.2, 0 * 0.2 + 0.2], [0.5, 1])

  const item1X = useTransform(sectionProgress, [1 * 0.2, 1 * 0.2 + 0.2], [1 % 2 === 0 ? -50 : 50, 0])
  const item1Opacity = useTransform(sectionProgress, [1 * 0.2, 1 * 0.2 + 0.2], [0.5, 1])

  const item2X = useTransform(sectionProgress, [2 * 0.2, 2 * 0.2 + 0.2], [2 % 2 === 0 ? -50 : 50, 0])
  const item2Opacity = useTransform(sectionProgress, [2 * 0.2, 2 * 0.2 + 0.2], [0.5, 1])

  // Group the transforms for each item
  const transforms = [
    { x: item0X, opacity: item0Opacity },
    { x: item1X, opacity: item1Opacity },
    { x: item2X, opacity: item2Opacity },
  ]

  return (
    <section ref={ref} className="py-24 md:py-32 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
            Designed to impress
          </h2>
          <p className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300">
            Every detail has been considered to create the ultimate pro notebook.
          </p>
        </motion.div>

        <div className="space-y-32">
          {showcaseItems.map((item, index) => (
            <motion.div
              key={index}
              className={`flex flex-col ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} items-center gap-8 lg:gap-16`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <motion.div
                className="w-full lg:w-1/2"
                style={{
                  x: transforms[index].x,
                  opacity: transforms[index].opacity,
                }}
              >
                <div className="relative h-[300px] md:h-[400px] rounded-3xl overflow-hidden">
                  <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                </div>
              </motion.div>

              <motion.div
                className="w-full lg:w-1/2"
                style={{
                  x: transforms[index].x,
                  opacity: transforms[index].opacity,
                }}
              >
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">{item.title}</h3>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">{item.description}</p>
                <motion.div
                  className="h-1 w-16 bg-gray-900 dark:bg-gray-100 rounded"
                  initial={{ width: 0 }}
                  whileInView={{ width: 64 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  viewport={{ once: true }}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
