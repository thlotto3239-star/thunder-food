"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, Phone, Lock, Bell, Moon, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { updateUserProfile } from "@/app/actions/customer";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/thunder/bottom-nav";

export default function ProfileSettingsClient() {
  const router = useRouter();
  const supabase = createClient();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Notification states
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [promoAlerts, setPromoAlerts] = useState(false);

  // Dark mode dummy toggle state
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/login");
          return;
        }
        setEmail(user.email || "");

        const { data: profile } = await supabase
          .from("users")
          .select("full_name, phone")
          .eq("id", user.id)
          .single();

        if (profile) {
          setFullName(profile.full_name || "");
          setPhone(profile.phone || "");
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [supabase, router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      const res = await updateUserProfile(fullName, phone);
      if (res.error) {
        setError(res.error);
      } else {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f9f6f5] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#ffd709] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f6f5] pb-36">
      {/* Header */}
      <div className="bg-white sticky top-0 z-50 px-4 py-4 flex items-center gap-3 shadow-sm border-b">
        <Link href="/profile" className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
          <ArrowLeft className="h-4 w-4 text-gray-600" />
        </Link>
        <h1 className="font-bold text-lg text-gray-900 font-thai">ตั้งค่าบัญชี</h1>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Profile Info Form */}
        <form onSubmit={handleSave} className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 space-y-4">
          <h2 className="font-bold text-gray-900 text-sm border-b pb-2 font-thai">ข้อมูลส่วนตัว</h2>

          {success && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-3 flex items-center gap-2 text-xs font-medium font-thai">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
              <span>บันทึกข้อมูลส่วนตัวเรียบร้อยแล้ว!</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-3 flex items-center gap-2 text-xs font-medium font-thai">
              <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 font-thai">ชื่อ - นามสกุล</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="กรอกชื่อ-นามสกุลของคุณ"
                className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:border-[#ffd709] focus:ring-2 focus:ring-[#ffd709]/20 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 font-thai">เบอร์โทรศัพท์</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="กรอกเบอร์โทรศัพท์"
                className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:border-[#ffd709] focus:ring-2 focus:ring-[#ffd709]/20 outline-none transition-all"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={saving}
            className="w-full bg-[#ffd709] hover:bg-yellow-500 text-gray-900 font-bold rounded-xl py-3 shadow-sm transition-all"
          >
            {saving ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
          </Button>
        </form>

        {/* Notification Settings */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 space-y-4">
          <h2 className="font-bold text-gray-900 text-sm border-b pb-2 font-thai">การแจ้งเตือน</h2>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-800 text-sm font-thai">สถานะคำสั่งซื้อ</p>
              <p className="text-xs text-gray-500">แจ้งเตือนสถานะเมื่อส่งอาหาร</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={orderUpdates}
                onChange={(e) => setOrderUpdates(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ffd709]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-800 text-sm font-thai">โปรโมชั่นและส่วนลด</p>
              <p className="text-xs text-gray-500">รับข่าวสารข้อเสนอที่ดีที่สุด</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={promoAlerts}
                onChange={(e) => setPromoAlerts(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ffd709]"></div>
            </label>
          </div>
        </div>

        {/* Display Settings */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 space-y-4">
          <h2 className="font-bold text-gray-900 text-sm border-b pb-2 font-thai">การแสดงผล</h2>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Moon className="h-4 w-4 text-gray-600" />
              <div>
                <p className="font-semibold text-gray-800 text-sm font-thai">โหมดกลางคืน (Dark Mode)</p>
                <p className="text-xs text-gray-500">ปรับความสว่างหน้าจอ</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ffd709]"></div>
            </label>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
