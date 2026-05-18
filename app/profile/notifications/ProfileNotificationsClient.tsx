"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { 
  ArrowLeft, 
  Bell, 
  BellOff, 
  Check, 
  CheckCheck, 
  Trash2, 
  Clock, 
  ShoppingBag, 
  AlertCircle, 
  Gift, 
  Loader2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { BottomNav } from "@/components/thunder/bottom-nav";

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

export default function ProfileNotificationsClient() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const supabase = createClient();

  // Simulated notification toggle settings
  const [orderNotification, setOrderNotification] = useState(true);
  const [promoNotification, setPromoNotification] = useState(true);
  const [marketingNotification, setMarketingNotification] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      const mapped: NotificationItem[] = (data || []).map((item) => ({
        id: item.id,
        title: item.title || "",
        body: item.body || "",
        type: item.type || "info",
        is_read: !!item.is_read,
        created_at: item.created_at || new Date().toISOString(),
      }));
      setNotifications(mapped);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "ไม่สามารถโหลดการแจ้งเตือนได้",
        description: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Mark a single notification as read
  async function handleMarkAsRead(id: string) {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", id);

      if (error) throw error;

      setNotifications(
        notifications.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      toast({
        title: "อ่านแล้ว",
        description: "ทำเครื่องหมายว่าอ่านแล้วเรียบร้อย",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "เกิดข้อผิดพลาด",
        description: err.message,
      });
    }
  }

  // Mark all as read
  async function handleMarkAllAsRead() {
    if (notifications.filter(n => !n.is_read).length === 0) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", user.id)
        .eq("is_read", false);

      if (error) throw error;

      setNotifications(notifications.map((n) => ({ ...n, is_read: true })));
      toast({
        title: "อ่านข้อความทั้งหมดแล้ว!",
        description: "ทำเครื่องหมายการแจ้งเตือนทั้งหมดว่าอ่านแล้ว",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "เกิดข้อผิดพลาด",
        description: err.message,
      });
    }
  }

  // Clear/Delete all notifications
  async function handleClearAll() {
    if (notifications.length === 0) return;
    if (!confirm("คุณต้องการลบประวัติการแจ้งเตือนทั้งหมดใช่หรือไม่?")) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("user_id", user.id);

      if (error) throw error;

      setNotifications([]);
      toast({
        title: "ลบประวัติแล้ว",
        description: "ประวัติการแจ้งเตือนทั้งหมดถูกทำลายเรียบร้อย",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "ไม่สามารถลบข้อมูลได้",
        description: err.message,
      });
    }
  }

  // Format type icons
  function getNotificationIcon(type: string) {
    switch (type) {
      case "order":
        return <ShoppingBag className="w-5 h-5 text-amber-600" />;
      case "promo":
        return <Gift className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-blue-600" />;
    }
  }

  function getNotificationBg(type: string) {
    switch (type) {
      case "order":
        return "bg-amber-100/70 border border-amber-200/55";
      case "promo":
        return "bg-red-100/70 border border-red-200/55";
      default:
        return "bg-blue-100/70 border border-blue-200/55";
    }
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="min-h-screen bg-[#f9f6f5] pb-36 font-thai">
      {/* Sticky Header */}
      <div className="bg-white sticky top-0 z-50 px-4 py-4 flex items-center justify-between shadow-sm border-b border-gray-150">
        <div className="flex items-center gap-3">
          <Link 
            href="/profile" 
            className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 text-gray-600" />
          </Link>
          <div>
            <h1 className="font-black text-lg text-gray-900 leading-tight">การแจ้งเตือน</h1>
            {unreadCount > 0 && (
              <span className="text-[10px] bg-red-500 text-white font-bold px-1.5 py-0.5 rounded-full mt-0.5 inline-block">
                ยังไม่ได้อ่าน {unreadCount} รายการ
              </span>
            )}
          </div>
        </div>
        
        {notifications.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
              className="text-xs text-amber-600 hover:text-amber-700 font-bold disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
              title="อ่านทั้งหมด"
            >
              <CheckCheck className="w-4 h-4 inline-block mr-1" /> อ่านทั้งหมด
            </button>
            <span className="text-gray-200">|</span>
            <button
              onClick={handleClearAll}
              className="text-xs text-red-500 hover:text-red-600 font-bold transition-colors"
              title="ลบทั้งหมด"
            >
              <Trash2 className="w-4 h-4 inline-block" />
            </button>
          </div>
        )}
      </div>

      {/* Main Container */}
      <div className="max-w-md mx-auto p-4 space-y-6">
        
        {/* Live Notification Inbox Section */}
        <section className="space-y-3">
          <h2 className="text-xs font-bold text-gray-400 tracking-wider uppercase">กล่องข้อความแจ้งเตือน</h2>

          {isLoading ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
              <p className="text-xs text-gray-500 mt-2">กำลังดึงประวัติการแจ้งเตือนล่าสุดของคุณ...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="bg-white rounded-[2rem] p-10 text-center border border-gray-150 shadow-sm flex flex-col items-center justify-center space-y-3">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                <BellOff className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">ไม่มีการแจ้งเตือนใหม่</h3>
                <p className="text-xs text-gray-400 mt-1 max-w-[200px] mx-auto">
                  เมื่อระบบมีการอัปเดตธุรกรรมหรือส่งข้อเสนอพิเศษ ประวัติจะแสดงขึ้นที่นี่สดๆ
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => !notification.is_read && handleMarkAsRead(notification.id)}
                  className={cn(
                    "bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-3 transition-all cursor-pointer relative overflow-hidden group hover:shadow-md hover:border-[#ffd709]/50",
                    !notification.is_read && "border-l-4 border-l-[#ffd709] bg-[#ffd709]/5"
                  )}
                >
                  {/* Badge Icon */}
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                    getNotificationBg(notification.type)
                  )}>
                    {getNotificationIcon(notification.type)}
                  </div>

                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex justify-between items-start gap-1">
                      <h4 className={cn(
                        "font-bold text-sm text-gray-900 leading-snug",
                        !notification.is_read ? "font-black text-gray-950" : "text-gray-700"
                      )}>
                        {notification.title}
                      </h4>
                      {!notification.is_read && (
                        <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0 animate-ping mt-1.5" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed font-medium">{notification.body}</p>
                    
                    <div className="flex items-center gap-1 text-[9px] text-gray-400 pt-1.5">
                      <Clock className="w-3 h-3 text-gray-300" />
                      {new Date(notification.created_at).toLocaleTimeString("th-TH", {
                        hour: "2-digit",
                        minute: "2-digit"
                      })} น.
                      <span className="mx-1">•</span>
                      {new Date(notification.created_at).toLocaleDateString("th-TH", {
                        day: "numeric",
                        month: "short"
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Toggles Panel */}
        <section className="space-y-3">
          <h2 className="text-xs font-bold text-gray-400 tracking-wider uppercase">การตั้งค่าการแจ้งเตือน</h2>
          
          <div className="space-y-2">
            {[
              {
                icon: Bell,
                label: "สถานะออเดอร์จัดส่ง",
                desc: "แจ้งเตือนแบบพุชทันทีเมื่อคำสั่งซื้อมีการอัปเดตสถานะ",
                enabled: orderNotification,
                toggle: () => setOrderNotification(!orderNotification)
              },
              {
                icon: Gift,
                label: "คูปอง & โปรโมชั่นพิเศษ",
                desc: "ดีลส่วนลด ของแจกแถม และแคมเปญใหม่จากทางร้านค้า",
                enabled: promoNotification,
                toggle: () => setPromoNotification(!promoNotification)
              },
              {
                icon: BellOff,
                label: "รับอีเมลการตลาด",
                desc: "ข่าวสารแพลตฟอร์มและแคมเปญแนะนำทางจดหมายอีเมล",
                enabled: marketingNotification,
                toggle: () => setMarketingNotification(!marketingNotification)
              }
            ].map((setting, i) => (
              <div
                key={i}
                onClick={setting.toggle}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between cursor-pointer hover:border-gray-200 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500">
                    <setting.icon className="h-5 w-5" />
                  </div>
                  <div className="pr-2">
                    <p className="font-bold text-gray-800 text-sm">{setting.label}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5 leading-tight">{setting.desc}</p>
                  </div>
                </div>
                <div className={cn(
                  "w-10 h-5 rounded-full transition-all relative border flex items-center",
                  setting.enabled ? "bg-[#ffd709] border-[#ffd709]/80" : "bg-gray-100 border-gray-200"
                )}>
                  <div className={cn(
                    "w-4 h-4 bg-white rounded-full absolute shadow transition-transform",
                    setting.enabled ? "translate-x-5" : "translate-x-0.5"
                  )} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <BottomNav />
    </div>
  );
}
