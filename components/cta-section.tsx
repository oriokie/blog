"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Check, Shield, Clock } from "lucide-react"

export default function CtaSection() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 animated-gradient"></div>
      <div className="absolute inset-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2
            className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            Ready to experience the new <span className="colorful-gradient">MacBook Pro</span>?
          </motion.h2>

          <motion.p
            className="text-xl text-gray-600 dark:text-gray-300 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            Supercharged for pros. From $1999.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <Button className="bg-gradient-to-r from-apple-purple to-apple-pink hover:opacity-90 text-white rounded-full px-8 py-6 text-lg shadow-lg shadow-apple-purple/20">
              Buy now
            </Button>
            <Button
              variant="outline"
              className="border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-full px-8 py-6 text-lg bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-gray-900/80"
            >
              Learn more
            </Button>
          </motion.div>

          <motion.div
            className="mt-12 flex flex-wrap items-center justify-center gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="flex items-center">
              <div className="mr-2 h-12 w-12 rounded-full bg-apple-green/10 flex items-center justify-center text-apple-green border border-apple-green/30 shadow-lg shadow-apple-green/20">
                <Check className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Free delivery</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Or pickup in store</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="mr-2 h-12 w-12 rounded-full bg-apple-blue/10 flex items-center justify-center text-apple-blue border border-apple-blue/30 shadow-lg shadow-apple-blue/20">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">1-year warranty</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">AppleCare+ available</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="mr-2 h-12 w-12 rounded-full bg-apple-purple/10 flex items-center justify-center text-apple-purple border border-apple-purple/30 shadow-lg shadow-apple-purple/20">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Fast processing</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Ships within 24 hours</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute -top-[40%] -right-[30%] w-[70%] h-[70%] rounded-full bg-gradient-to-b from-apple-pink/30 to-transparent opacity-50"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.5, 0.6, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-[40%] -left-[30%] w-[70%] h-[70%] rounded-full bg-gradient-to-t from-apple-blue/30 to-transparent opacity-50"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.5, 0.6, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 4,
          }}
        />
      </div>
    </section>
  )
}
