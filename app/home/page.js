"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Camera, Zap } from "lucide-react";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="min-h-screen w-full bg-background overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="h-screen grid grid-cols-1 md:grid-cols-2 gap-0 relative z-10"
      >
        {/* Left Section - Webcam & Analysis */}
        <motion.div variants={itemVariants} className="group">
          <Link href="/webcam" className="block h-full">
            <div className="h-full w-full flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10 border-r border-border hover:border-primary/30 transition-all duration-500 cursor-pointer p-6 md:p-8">
              {/* Animated background elements */}
              <div className="absolute inset-0 overflow-hidden">
                <motion.div
                  animate={{
                    y: [0, -20, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -top-20 -left-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl"
                />
                <motion.div
                  animate={{
                    y: [0, 20, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -bottom-20 -right-20 w-40 h-40 bg-accent/20 rounded-full blur-3xl"
                />
              </div>

              {/* Content */}
              <motion.div
                className="relative z-10 text-center space-y-4"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="flex justify-center"
                >
                  <div className="p-4 bg-primary/20 rounded-2xl">
                    <Camera className="w-16 h-16 text-primary" />
                  </div>
                </motion.div>

                <div>
                  <h2 className="text-3xl md:text-1xl font-bold text-foreground mb-2">
                    كاميرا الويب
                  </h2>
                  <p className="text-muted-foreground text-sm md:text-base max-w-xs mx-auto leading-relaxed">
                    التقاط الحركات باستخدام الكاميرا وتحويلها مباشرة إلى نص
                    مكتوب، مما يساعد الصم والبكم على التواصل بسهولة وفهم
                    الإشارات في الوقت الفعلي.
                  </p>
                </div>

                <motion.div whileHover={{ y: -2 }} className="inline-block">
                  <span className="px-6 py-2 bg-primary text-white rounded-full text-sm font-semibold inline-flex items-center gap-2 group-hover:shadow-lg group-hover:shadow-primary/30 transition-shadow duration-300">
                    ابدأ التحليل
                    <span className="text-lg">→</span>
                  </span>
                </motion.div>
              </motion.div>
            </div>
          </Link>
        </motion.div>

        {/* Right Section - 3D Animations */}
        <motion.div variants={itemVariants} className="group">
          <Link href="/3d-animations" className="block h-full">
            <div className="h-full w-full flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-accent/5 to-accent/10 hover:border-accent/30 transition-all duration-500 cursor-pointer p-6 md:p-8">
              {/* Animated background elements */}
              <div className="absolute inset-0 overflow-hidden">
                <motion.div
                  animate={{
                    x: [0, -20, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -top-20 -right-20 w-40 h-40 bg-accent/20 rounded-full blur-3xl"
                />
                <motion.div
                  animate={{
                    x: [0, 20, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -bottom-20 -left-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl"
                />
              </div>

              {/* Content */}
              <motion.div
                className="relative z-10 text-center space-y-4"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  animate={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="flex justify-center"
                >
                  <div className="p-4 bg-accent/20 rounded-2xl">
                    <Zap className="w-16 h-16 text-accent" />
                  </div>
                </motion.div>

                <div>
                  <h2 className="text-3xl md:text-1xl font-bold text-foreground mb-2">
                    ترجمة النص إلى حركات ثلاثية الأبعاد
                  </h2>
                  <p className="text-muted-foreground text-sm md:text-base max-w-xs mx-auto leading-relaxed">
                    تحويل النصوص إلى حركات ثلاثية الأبعاد توضح حروف الكلمات،
                    لمساعدة المستخدم على تعلم وفهم لغة الإشارة بشكل تفاعلي.
                  </p>
                </div>

                <motion.div whileHover={{ y: -2 }} className="inline-block">
                  <span className="px-6 py-2 bg-accent text-white rounded-full text-sm font-semibold inline-flex items-center gap-2 group-hover:shadow-lg group-hover:shadow-accent/30 transition-shadow duration-300">
                    ابدأ الترجمة
                    <span className="text-lg">→</span>
                  </span>
                </motion.div>
              </motion.div>
            </div>
          </Link>
        </motion.div>
      </motion.div>

      {/* Footer */}
      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center text-xs md:text-sm text-muted-foreground z-20"
      >
        <p>Motion Studio • منصة الحركات والتحليل التفاعلية</p>
      </motion.div> */}
    </div>
  );
}
