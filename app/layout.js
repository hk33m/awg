import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/next";

export const metadata = {
  title: " اوج ",
  description:
    "اوج هي لغة برمجة جديدة تهدف إلى تبسيط عملية تطوير البرمجيات وجعلها أكثر متعة وإنتاجية. تم تصميم اوج لتكون سهلة التعلم والاستخدام، مع التركيز على توفير تجربة تطوير سلسة وممتعة للمبرمجين من جميع المستويات.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      {
        url: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
      },
    ],
  },

  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body dir="rtl">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
