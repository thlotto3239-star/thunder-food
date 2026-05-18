export const dynamic = "force-dynamic";

import Link from "next/link";
import { MoveLeft, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f9f6f5] flex flex-col items-center justify-center p-4 font-thai text-center">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100 flex flex-col items-center space-y-6 relative overflow-hidden">
        {/* Decorative dynamic circles */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#ffd709]/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl" />

        {/* Brand Icon & Error Code */}
        <div className="relative">
          <div className="w-24 h-24 bg-[#ffd709]/20 rounded-full flex items-center justify-center text-[#ffd709] animate-bounce">
            <span className="text-4xl">⚡</span>
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-amber-500 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white">
            <HelpCircle className="h-5 w-5" />
          </div>
        </div>

        {/* Text Details */}
        <div className="space-y-2">
          <h1 className="text-5xl font-black text-gray-900 tracking-tight">404</h1>
          <h2 className="text-lg font-bold text-gray-800 leading-snug">ไม่พบหน้าเว็บที่คุณค้นหา</h2>
          <p className="text-xs text-gray-400 max-w-[280px] mx-auto leading-relaxed">
            หน้าเว็บนี้อาจถูกลบไปแล้ว เปลี่ยนแปลงลิงก์ หรือไม่มีอยู่จริงในระบบของ Thunder Food
          </p>
        </div>

        {/* Actions */}
        <div className="w-full pt-2">
          <Link href="/">
            <Button className="w-full bg-[#ffd709] hover:bg-yellow-500 text-gray-900 font-bold rounded-2xl py-6 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.98]">
              <MoveLeft className="h-4 w-4" />
              <span>กลับสู่หน้าหลัก</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
