'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from "next/link";
import { ArrowRight, Sparkles,Bot,Box,GraduationCap } from 'lucide-react';
import Image from 'next/image';

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-cyan-100 overflow-hidden flex flex-col">
      {/* ===== Header ===== */}
      <header
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* الشعار */}
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
              <img src="/logo.png" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                أوج
              </h1>
              <p className="text-xs text-cyan-600 font-medium">
                لغة بلا حدود
              </p>
            </div>
          </div>

          {/* زر الدخول */}
         
        </nav>
      </header>

      {/* ===== Hero Section - الواجهة الرئيسية ===== */}
      <section className="flex-1 pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          {/* عناصر الخلفية المتحركة */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 -left-32 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl animate-blob"></div>
            <div className="absolute top-1/2 -right-40 w-96 h-96 bg-cyan-300/30 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
          </div>

          {/* المحتوى الرئيسي */}
          <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
            {/* النص والعبارات */}
            <div className="space-y-8">
              {/* الشارة الزرقاء العلوية */}
              <div className="inline-flex items-center gap-2 bg-blue-100/80 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-200 animate-fade-in">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-700">
                  🌟 تقنية ذكاء اصطناعي متقدمة
                </span>
              </div>

              {/* العنوان الرئيسي الكبير */}
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight animate-fade-in-up">
                  <span className="bg-gradient-to-r from-blue-900 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
                    أوج
                  </span>
                  <br />
                  <span className="text-gray-800">لغة بلا حدود</span>
                </h1>

                {/* الوصف */}
                <p className="text-xl md:text-2xl text-gray-700 leading-relaxed animate-fade-in-up animation-delay-200">
                  تعليم معزز بالذكاء الاصطناعي وتقنيات ثلاثية الأبعاد لترجمة
                  <span className="font-bold text-cyan-600"> لغة الإشارة </span>
                  بطريقة احترافية وسهلة
                </p>
              </div>

              {/* وصف إضافي */}
              <p className="text-lg text-gray-600 animate-fade-in-up animation-delay-300">
                منصة تعليمية ذكية تربط بين الصم والبكم والسامعين من خلال ترجمة فورية ودقيقة لـ<span className="font-semibold text-blue-600"> لغة الإشارة</span>
              </p>

              {/* زر البداية */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 animate-fade-in-up animation-delay-400">
                <Link href="/home">
                <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold px-10 py-6 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer w-full sm:w-auto">
                  ابدأ الآن 
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                </Link>

              </div>
            </div>

            {/* الصورة / الرسومات */}
            <div className="relative animate-fade-in animation-delay-500 hidden md:block">
              {/* كرة متحركة بألوان */}
              <div className="relative w-full h-96 md:h-96">
                {/* الخلفية الدائرية الكبيرة */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-2xl animate-blob"></div>

                {/* الكرة الرئيسية */}
                <div className="absolute inset-12 bg-gradient-to-br from-blue-500 via-cyan-400 to-purple-500 rounded-full shadow-2xl animate-float flex items-center justify-center overflow-hidden">
                  {/* عناصر داخل الكرة */}
                  <div className="absolute w-32 h-32 bg-white/20 rounded-full blur-xl animate-pulse"></div>
                  
                  {/* أيقونة وسط */}
                  <div className="relative z-10 text-center">
                    <div className="text-6xl mb-2"><img src="/logo.png" width="200px" /></div>
                    <p className="text-white font-bold text-sm">اتصال بدون حدود</p>
                  </div>
                </div>

                {/* عناصر عائمة حول الكرة */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full shadow-lg animate-float animation-delay-1000 flex items-center justify-center text-3xl">
                  <Bot className="w-16 h-8 text-white" />
                </div>

                <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br from-green-300 to-emerald-400 rounded-full shadow-lg animate-float animation-delay-2000 flex items-center justify-center text-2xl">
                  <Box className="w-16 h-8 text-white" />
                </div>

                <div className="absolute top-1/3 left-0 w-14 h-14 bg-gradient-to-br from-pink-300 to-rose-400 rounded-full shadow-lg animate-float animation-delay-1500 flex items-center justify-center text-xl">
                  <GraduationCap className="w-16 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}