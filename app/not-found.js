import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, ArrowRight, Phone, Search } from "lucide-react"
import Footer from "@/components/footer"
import Header from "@/components/header"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col ">
      <Header title={""} description={" "} />
      <main className="flex flex-1  items-center justify-center">
        <div className="container mx-auto px-4 py-20 lg:px-8">
          <div className="mx-auto pt-20 max-w-2xl text-center">
            {/* Animated 404 */}
            <div className="relative mb-8">
              <div className="text-[12rem] font-black leading-none text-primary/10 lg:text-[16rem]">404</div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="rounded-2xl bg-primary/10 p-6 backdrop-blur-sm">
                  <Search className="h-16 w-16 text-primary lg:h-20 lg:w-20" />
                </div>
              </div>
            </div>

            {/* Content */}
            <h1 className="mb-4 text-3xl font-bold lg:text-4xl">الصفحة غير موجودة</h1>
            <p className="mb-8 text-lg text-muted-foreground leading-relaxed">
              عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها إلى عنوان آخر.
              <br />
              يمكنك العودة للصفحة الرئيسية أو التواصل معنا للمساعدة.
            </p>

            {/* Actions */}
            
            {/* Quick Links */}
            
              <div className="flex flex-wrap items-center justify-center gap-3">
                
                  <Link
                 
                    href={"/"}
                    className="group flex items-center gap-1 rounded-lg  px-4 py-2 text-sm font-medium shadow-sm transition-all bg-primary text-primary-foreground"
                  >
                    الصفحة الرئيسية
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:-translate-x-1" />
                  </Link>
              
              </div>
          
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
