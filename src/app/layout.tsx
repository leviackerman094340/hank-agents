import { NextSSRPlugin } from "@next/ssr-plugin";
import "./globals.css";

export const metadata = { 
  title: "HANK - Multi-Agent Money System", 
  description: "AI agents working together to make money" 
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen">
        <NextSSRPlugin />
        {children}
      </body>
    </html>
  );
}
