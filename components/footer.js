'use client';

export default function Footer() {

  return (
    <div >
      
      {/* ===== Footer ===== */}
      <footer className="bg-gradient-to-r from-gray-900 via-blue-900 to-cyan-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* المحتوى الرئيسي للفوتر */}
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            
            {/* القسم الأول - الشعار والوصف */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-300 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-gray-900 font-bold text-lg">أ</span>
                </div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                  أوج
                </h2>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                منصة تعليمية ذكية لترجمة لغة الإشارة باستخدام تقنيات الذكاء الاصطناعي والواقع الافتراضي
              </p>
            </div>

            

            {/* القسم الثالث - وسائل التواصل */}
            
          </div>

          {/* فاصل */}
          <div className="border-t border-white/20 my-8"></div>

          {/* حقوق الطبع والنشر */}
          <div className="flex flex-col md:flex-row items-center justify-between text-center md:text-right text-sm text-gray-400">
            <p className="mb-4 md:mb-0">
              © 2026 <span className="font-bold text-cyan-300">أوج</span> - جميع الحقوق محفوظة
            </p>
            <p>
              تم التطوير بـ ❤️ من قبل فريق <span className="font-semibold text-blue-300">أوج</span>
            </p>
          </div>

          {/* خط إضافي */}
          <div className="mt-6 text-center text-xs text-gray-500">
            سياسة الخصوصية | شروط الاستخدام | اتصل بنا
          </div>
        </div>
      </footer>
    </div>
  );
}