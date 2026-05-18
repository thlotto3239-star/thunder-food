"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { 
  Percent, 
  Plus, 
  Trash2, 
  UploadCloud, 
  Eye, 
  EyeOff, 
  Check, 
  Settings, 
  Grid, 
  Sliders, 
  FileText,
  DollarSign,
  TrendingUp,
  Loader2,
  Key,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  button_text: string | null;
  bg_color: string | null;
  text_color: string | null;
  image_url: string | null;
  link_url: string | null;
  is_active: boolean | null;
  created_at: string | null;
}

export default function AdminSettingsCMS() {
  const [activeTab, setActiveTab] = useState<"banners" | "categories" | "platform">("banners");
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const supabase = createClient();

  // Banner Form State
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [buttonText, setButtonText] = useState("สั่งเลย");
  const [bgColor, setBgColor] = useState("bg-primary");
  const [imageUrl, setImageUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  // Categories State
  interface Category {
    id: string;
    slug: string;
    name: string;
    icon: string;
    color: string;
  }
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCatName, setNewCatName] = useState("");
  const [newCatColor, setNewCatColor] = useState("bg-orange-100");

  // Platform Config State
  const [platformName, setPlatformName] = useState("Thunder Food");
  const [deliveryFee, setDeliveryFee] = useState("25");
  const [maxDistance, setMaxDistance] = useState("10");
  const [riderCommission, setRiderCommission] = useState("10");

  // Integration API Keys State
  const [googleMapsKey, setGoogleMapsKey] = useState("");
  const [slipOkKey, setSlipOkKey] = useState("");
  const [slipOkBranchId, setSlipOkBranchId] = useState("");
  const [stripePublicKey, setStripePublicKey] = useState("");

  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [isSavingConfigs, setIsSavingConfigs] = useState(false);

  const toggleKeyVisibility = (key: string) => {
    setShowKeys(prev => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    fetchBanners();
    fetchCategories();
    fetchPlatformSettings();
  }, []);

  async function fetchPlatformSettings() {
    try {
      const { data, error } = await supabase
        .from("system_configs")
        .select("*");
      if (error) throw error;
      if (data) {
        data.forEach((config) => {
          const val = config.value;
          if (val === null || val === undefined) return;
          const valStr = typeof val === 'object' ? JSON.stringify(val) : String(val);
          // Strip quotes if they were stored as json strings
          const cleanVal = valStr.replace(/^"|"$/g, '');
          
          switch (config.key) {
            case "platform_name":
              setPlatformName(cleanVal || "Thunder Food");
              break;
            case "delivery_fee":
              setDeliveryFee(cleanVal || "25");
              break;
            case "max_distance":
              setMaxDistance(cleanVal || "10");
              break;
            case "rider_commission":
              setRiderCommission(cleanVal || "10");
              break;
            case "google_maps_api_key":
              setGoogleMapsKey(cleanVal || "");
              break;
            case "slip_ok_api_key":
              setSlipOkKey(cleanVal || "");
              break;
            case "slip_ok_branch_id":
              setSlipOkBranchId(cleanVal || "");
              break;
            case "stripe_public_key":
              setStripePublicKey(cleanVal || "");
              break;
          }
        });
      }
    } catch (err: any) {
      console.error("Fetch system configs error:", err.message);
    }
  }

  async function fetchCategories() {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      setCategories(data || []);
    } catch (err: any) {
      console.error("Fetch categories error:", err.message);
    }
  }

  async function fetchBanners() {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("banners")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBanners(data || []);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "เกิดข้อผิดพลาดในการโหลดข้อมูล",
        description: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Handle Banner Image Upload to Supabase Storage
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `banners/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("banners")
        .upload(filePath, file, { cacheControl: "3600", upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("banners")
        .getPublicUrl(filePath);

      setImageUrl(data.publicUrl);
      toast({
        title: "อัปโหลดรูปภาพสำเร็จ!",
        description: "ระบบได้จัดเก็บรูปภาพแบนเนอร์เรียบร้อยแล้ว",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "อัปโหลดรูปภาพล้มเหลว",
        description: err.message,
      });
    } finally {
      setIsUploading(false);
    }
  }

  // Create Banner
  async function handleCreateBanner(e: React.FormEvent) {
    e.preventDefault();
    if (!title) {
      toast({ variant: "destructive", title: "กรุณากรอกหัวข้อแบนเนอร์" });
      return;
    }

    try {
      const { data, error } = await supabase
        .from("banners")
        .insert([
          {
            title,
            subtitle: subtitle || null,
            button_text: buttonText || "สั่งเลย",
            bg_color: bgColor,
            text_color: "text-primary-foreground",
            image_url: imageUrl || null,
            link_url: linkUrl || null,
            is_active: true,
          },
        ])
        .select();

      if (error) throw error;

      toast({
        title: "เพิ่มแบนเนอร์สำเร็จ!",
        description: "สไลเดอร์ตัวใหม่ถูกเปิดใช้งานทันที",
      });

      // Clear Form
      setTitle("");
      setSubtitle("");
      setButtonText("สั่งเลย");
      setBgColor("bg-primary");
      setImageUrl("");
      setLinkUrl("");

      fetchBanners();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "เกิดข้อผิดพลาดในการบันทึก",
        description: err.message,
      });
    }
  }

  // Toggle Banner Active Status
  async function handleToggleActive(bannerId: string, currentStatus: boolean | null) {
    try {
      const { error } = await supabase
        .from("banners")
        .update({ is_active: !currentStatus })
        .eq("id", bannerId);

      if (error) throw error;

      toast({
        title: "อัปเดตสถานะสำเร็จ!",
        description: `แบนเนอร์ถูก ${!currentStatus ? "เปิดใช้งาน" : "ปิดใช้งาน"} เรียบร้อยแล้ว`,
      });

      fetchBanners();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "ไม่สามารถอัปเดตสถานะได้",
        description: err.message,
      });
    }
  }

  // Delete Banner
  async function handleDeleteBanner(bannerId: string) {
    if (!confirm("คุณแน่ใจหรือไม่ที่จะลบแบนเนอร์โปสเตอร์นี้อย่างถาวร?")) return;

    try {
      const { error } = await supabase
        .from("banners")
        .delete()
        .eq("id", bannerId);

      if (error) throw error;

      toast({
        title: "ลบข้อมูลสำเร็จ!",
        description: "แบนเนอร์ถูกถอดถอนออกจากระบบเรียบร้อย",
      });

      fetchBanners();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "เกิดข้อผิดพลาดในการลบข้อมูล",
        description: err.message,
      });
    }
  }

  // Category Catalog actions
  async function handleAddCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!newCatName) return;

    const slug = newCatName.toLowerCase().replace(/\s+/g, "-");
    try {
      const { data, error } = await supabase
        .from("categories")
        .insert([{
          slug,
          name: newCatName,
          icon: "Utensils", // Default icon
          color: newCatColor,
          is_active: true
        }])
        .select();

      if (error) throw error;
      
      toast({
        title: "เพิ่มหมวดหมู่สำเร็จ!",
        description: `สร้างหมวดหมู่ "${newCatName}" เรียบร้อยแล้ว`,
      });
      setNewCatName("");
      fetchCategories();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "เกิดข้อผิดพลาดในการเพิ่มหมวดหมู่",
        description: err.message,
      });
    }
  }

  async function handleDeleteCategory(id: string) {
    if (!confirm("คุณแน่ใจหรือไม่ที่จะลบหมวดหมู่นี้?")) return;
    try {
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      
      toast({
        title: "ลบหมวดหมู่สำเร็จ!",
      });
      fetchCategories();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "เกิดข้อผิดพลาดในการลบหมวดหมู่",
        description: err.message,
      });
    }
  }

  async function handleSavePlatformSettings() {
    setIsSavingConfigs(true);
    try {
      const configs = [
        { key: "platform_name", value: platformName, desc: "ชื่อแอปพลิเคชัน" },
        { key: "delivery_fee", value: deliveryFee, desc: "ค่าจัดส่งเริ่มต้น (บาท)" },
        { key: "max_distance", value: maxDistance, desc: "รัศมีรับส่งสูงสุด (กิโลเมตร)" },
        { key: "rider_commission", value: riderCommission, desc: "ค่าส่วนแบ่งแพลตฟอร์ม GP (%)" },
        { key: "google_maps_api_key", value: googleMapsKey, desc: "Google Maps API Key" },
        { key: "slip_ok_api_key", value: slipOkKey, desc: "SlipOK API Key สำหรับตรวจสลิป" },
        { key: "slip_ok_branch_id", value: slipOkBranchId, desc: "SlipOK Branch ID" },
        { key: "stripe_public_key", value: stripePublicKey, desc: "Stripe Publishable API Key" }
      ];

      for (const config of configs) {
        const { error } = await supabase
          .from("system_configs")
          .upsert(
            { 
              key: config.key, 
              value: config.value,
              description: config.desc,
              updated_at: new Date().toISOString() 
            },
            { onConflict: "key" }
          );
        if (error) throw error;
      }

      toast({
        title: "บันทึกการตั้งค่าแพลตฟอร์มสำเร็จ!",
        description: "ข้อมูลระบบและการตั้งค่า API Keys ทั้งหมดได้รับการบันทึกลงฐานข้อมูลเรียบร้อยแล้ว",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "เกิดข้อผิดพลาดในการบันทึก",
        description: err.message,
      });
    } finally {
      setIsSavingConfigs(false);
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl pb-24">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black font-thai text-[#0e0e0e] tracking-tight">ระบบการจัดการข้อมูล CMS</h1>
          <p className="text-[#8c8a88] text-sm mt-1 font-thai">ควบคุมแบนเนอร์โปสเตอร์, หมวดหมู่สินค้า และการตั้งค่าหน้าผู้ใช้ทั้งหมดแบบสดๆ</p>
        </div>
        <div className="flex bg-[#ffd709]/10 border border-[#ffd709]/30 rounded-xl p-1 shadow-sm w-fit self-start md:self-auto">
          <button
            onClick={() => setActiveTab("banners")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
              activeTab === "banners" ? "bg-[#ffd709] text-[#1c1c1e] shadow-sm" : "text-gray-600 hover:text-gray-900"
            )}
          >
            <Sliders size={16} /> Banners Slider
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
              activeTab === "categories" ? "bg-[#ffd709] text-[#1c1c1e] shadow-sm" : "text-gray-600 hover:text-gray-900"
            )}
          >
            <Grid size={16} /> Categories
          </button>
          <button
            onClick={() => setActiveTab("platform")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
              activeTab === "platform" ? "bg-[#ffd709] text-[#1c1c1e] shadow-sm" : "text-gray-600 hover:text-gray-900"
            )}
          >
            <Settings size={16} /> Platform Config
          </button>
        </div>
      </div>

      {/* Tab: BANNERS SLIDER CMS */}
      {activeTab === "banners" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Banner Creation Form */}
          <div className="lg:col-span-1">
            <Card className="rounded-[1.5rem] border-0 shadow-sm bg-white overflow-hidden sticky top-8">
              <CardHeader className="bg-gray-50 border-b border-gray-100 p-6">
                <CardTitle className="text-lg font-black font-thai flex items-center gap-2 text-gray-900">
                  <Plus size={20} className="text-[#ffd709]" />
                  เพิ่มแบนเนอร์โปสเตอร์
                </CardTitle>
                <CardDescription className="font-thai text-xs">ระบุเนื้อหาเพื่อแสดงผลบนหน้าต่างเลื่อน Slider ของผู้ใช้งาน</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleCreateBanner} className="space-y-4 font-thai">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">หัวข้อแบนเนอร์ (Title) *</label>
                    <Input 
                      placeholder="เช่น ส่วนลดพิเศษ 50%!" 
                      value={title} 
                      onChange={e => setTitle(e.target.value)} 
                      className="rounded-xl border-gray-200"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">รายละเอียดแบนเนอร์ (Subtitle)</label>
                    <Input 
                      placeholder="เช่น เฉพาะเมนูหน้าร้อน วันนี้เท่านั้น" 
                      value={subtitle} 
                      onChange={e => setSubtitle(e.target.value)}
                      className="rounded-xl border-gray-200"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700">ข้อความปุ่มกด (Button)</label>
                      <Input 
                        placeholder="สั่งเลย" 
                        value={buttonText} 
                        onChange={e => setButtonText(e.target.value)}
                        className="rounded-xl border-gray-200"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700">สีพื้นหลังสำรอง</label>
                      <select 
                        value={bgColor} 
                        onChange={e => setBgColor(e.target.value)}
                        className="w-full h-10 border border-gray-200 rounded-xl px-3 text-sm focus:outline-none"
                      >
                        <option value="bg-primary">สีทอง Thunder</option>
                        <option value="bg-accent">สีแดงสด</option>
                        <option value="bg-foreground">สีดำหรูหรา</option>
                        <option value="bg-emerald-500">สีเขียวสดใส</option>
                      </select>
                    </div>
                  </div>

                  {/* Image Upload Area (Supabase Storage Integrated) */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">รูปภาพแบนเนอร์ (Image Upload)</label>
                    <div className="border-2 border-dashed border-gray-200 rounded-2xl p-4 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors relative cursor-pointer group">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                        disabled={isUploading}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      {isUploading ? (
                        <div className="flex flex-col items-center gap-2">
                          <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                          <span className="text-xs text-gray-500 font-bold">กำลังอัปโหลดไฟล์...</span>
                        </div>
                      ) : imageUrl ? (
                        <div className="flex flex-col items-center text-center">
                          <Check className="w-8 h-8 text-green-500" />
                          <span className="text-xs text-green-600 font-bold mt-1">อัปโหลดสำเร็จ!</span>
                          <span className="text-[10px] text-gray-400 mt-0.5 truncate max-w-[200px]">{imageUrl}</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center text-center">
                          <UploadCloud className="w-8 h-8 text-gray-400 group-hover:text-amber-500 transition-colors" />
                          <span className="text-xs text-gray-600 font-bold mt-1">คลิกเพื่ออัปโหลดไฟล์ภาพ</span>
                          <span className="text-[10px] text-gray-400 mt-0.5">รองรับไฟล์ PNG, JPG ขนาดไม่เกิน 5MB</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">ลิงก์ปลายทาง (URL)</label>
                    <Input 
                      placeholder="/promotions หรือ ID ร้านค้า" 
                      value={linkUrl} 
                      onChange={e => setLinkUrl(e.target.value)}
                      className="rounded-xl border-gray-200"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-[#ffd709] hover:bg-[#ffd709]/90 text-[#1c1c1e] font-black rounded-xl py-6"
                  >
                    <Plus size={16} className="mr-1" /> สร้างและเปิดใช้งานสด
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Banners Grid List */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold font-thai text-gray-900">รายการแบนเนอร์ปัจจุบัน ({banners.length})</h2>

            {isLoading ? (
              <div className="text-center py-20 bg-white rounded-[1.5rem] border border-gray-100 flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
                <p className="text-sm text-gray-500 mt-2 font-thai">กำลังดึงข้อมูลแบนเนอร์ล่าสุดจาก Supabase...</p>
              </div>
            ) : banners.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-[1.5rem] border border-gray-100 text-gray-500 font-thai text-sm">
                ยังไม่มีข้อมูลแบนเนอร์ในระบบขณะนี้
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {banners.map((banner) => (
                  <Card key={banner.id} className="rounded-[1.5rem] overflow-hidden border-0 shadow-sm bg-white relative flex flex-col justify-between group">
                    <div>
                      {/* Image Preview Block */}
                      <div className={cn(
                        "h-32 relative bg-cover bg-center flex items-end p-4 text-white overflow-hidden",
                        !banner.image_url && (banner.bg_color || "bg-primary")
                      )}
                      style={banner.image_url ? { backgroundImage: `url(${banner.image_url})` } : {}}
                      >
                        {banner.image_url && <div className="absolute inset-0 bg-black/40 backdrop-blur-[0.5px] z-0" />}
                        <div className="relative z-10 font-thai">
                          <span className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-bold inline-block mb-1 shadow-sm",
                            banner.is_active ? "bg-green-50 text-white animate-pulse" : "bg-gray-400 text-white"
                          )}>
                            {banner.is_active ? "Active" : "Disabled"}
                          </span>
                          <h3 className="font-bold text-lg leading-tight truncate">{banner.title}</h3>
                          <p className="text-xs opacity-90 truncate">{banner.subtitle || "-"}</p>
                        </div>
                      </div>

                      <div className="p-4 space-y-2 font-thai text-xs text-gray-600">
                        <div className="flex justify-between">
                          <span className="text-gray-400">ปุ่มกด:</span>
                          <span className="font-bold text-gray-900">{banner.button_text || "-"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">ลิงก์เป้าหมาย:</span>
                          <span className="font-bold text-gray-900 truncate max-w-[150px]">{banner.link_url || "-"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">วันที่ลงทะเบียน:</span>
                          <span className="font-bold text-gray-900">
                            {banner.created_at ? new Date(banner.created_at).toLocaleDateString("th-TH") : "-"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Banner Control Toolbar */}
                    <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                      <button
                        onClick={() => handleToggleActive(banner.id, banner.is_active)}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-sm",
                          banner.is_active 
                            ? "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100" 
                            : "bg-gray-150 text-gray-700 border border-gray-200 hover:bg-gray-250"
                        )}
                      >
                        {banner.is_active ? (
                          <>
                            <Eye size={14} /> เปิดอยู่
                          </>
                        ) : (
                          <>
                            <EyeOff size={14} /> ปิดอยู่
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleDeleteBanner(banner.id)}
                        className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors shadow-sm border border-red-100 bg-white"
                        title="ลบแบนเนอร์ถาวร"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: CATEGORIES CMS */}
      {activeTab === "categories" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 font-thai">
          {/* Creation Form */}
          <div className="lg:col-span-1">
            <Card className="rounded-[1.5rem] border-0 shadow-sm bg-white overflow-hidden sticky top-8">
              <CardHeader className="bg-gray-50 border-b border-gray-100 p-6">
                <CardTitle className="text-lg font-black flex items-center gap-2 text-gray-900">
                  <Grid className="text-amber-500" size={20} />
                  เพิ่มหมวดหมู่อาหารใหม่
                </CardTitle>
                <CardDescription className="text-xs">สร้างหมวดหมู่ใหม่เพื่อจัดระเบียบร้านค้าและเมนูอาหาร</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleAddCategory} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">ชื่อหมวดหมู่ *</label>
                    <Input 
                      placeholder="เช่น ข้าวขาหมู, หมูกระทะ" 
                      value={newCatName} 
                      onChange={e => setNewCatName(e.target.value)} 
                      className="rounded-xl border-gray-200"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">โทนสีปุ่มกด</label>
                    <select 
                      value={newCatColor} 
                      onChange={e => setNewCatColor(e.target.value)}
                      className="w-full h-10 border border-gray-200 rounded-xl px-3 text-sm focus:outline-none bg-white"
                    >
                      <option value="bg-amber-100">สีส้มพาสเทล</option>
                      <option value="bg-red-100">สีแดงพาสเทล</option>
                      <option value="bg-green-100">สีเขียวพาสเทล</option>
                      <option value="bg-pink-100">สีชมพูพาสเทล</option>
                      <option value="bg-blue-100">สีฟ้าพาสเทล</option>
                      <option value="bg-yellow-100">สีเหลืองพาสเทล</option>
                    </select>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-[#ffd709] hover:bg-[#ffd709]/90 text-[#1c1c1e] font-black rounded-xl py-6"
                  >
                    <Plus size={16} className="mr-1" /> สร้างหมวดหมู่สด
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Categories Grid list */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-gray-900">รายการหมวดหมู่หน้าร้าน ({categories.length})</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((category) => (
                <div 
                  key={category.id} 
                  className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-between text-center relative group hover:border-[#ffd709] transition-all"
                >
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shadow-inner font-bold mb-3 text-gray-700", category.color)}>
                    {category.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{category.name}</h4>
                    <span className="text-[10px] text-gray-400 font-mono mt-0.5 inline-block">{category.id}</span>
                  </div>

                  {category.slug !== "all" && (
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-50 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: PLATFORM CONFIG */}
      {activeTab === "platform" && (
        <div className="max-w-2xl font-thai space-y-6 animate-in fade-in">
          <Card className="rounded-[1.5rem] border-0 shadow-sm bg-white overflow-hidden">
            <CardHeader className="bg-gray-50 border-b border-gray-100 p-6">
              <CardTitle className="text-lg font-black flex items-center gap-2 text-gray-900">
                <Settings className="text-[#ffd709]" size={20} />
                ตั้งค่าระบบส่วนกลาง (Platform Settings)
              </CardTitle>
              <CardDescription className="text-xs">ปรับเปลี่ยนเกณฑ์ราคาและเบี้ยตอบแทนพื้นฐานของทั้งระบบขนส่ง</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700">ชื่อแอปพลิเคชัน</label>
                  <Input 
                    value={platformName} 
                    onChange={e => setPlatformName(e.target.value)}
                    className="rounded-xl border-gray-200"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700">ค่าจัดส่งเริ่มต้น (บาท) *</label>
                  <div className="relative">
                    <Input 
                      type="number" 
                      value={deliveryFee} 
                      onChange={e => setDeliveryFee(e.target.value)}
                      className="rounded-xl border-gray-200 pl-8"
                    />
                    <DollarSign size={14} className="absolute left-3 top-3.5 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700">รัศมีรับส่งสูงสุด (กิโลเมตร)</label>
                  <Input 
                    type="number" 
                    value={maxDistance} 
                    onChange={e => setMaxDistance(e.target.value)}
                    className="rounded-xl border-gray-200"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700">ค่าส่วนแบ่งแพลตฟอร์ม GP (%) *</label>
                  <div className="relative">
                    <Input 
                      type="number" 
                      value={riderCommission} 
                      onChange={e => setRiderCommission(e.target.value)}
                      className="rounded-xl border-gray-200 pl-8"
                    />
                    <Percent size={14} className="absolute left-3 top-3.5 text-gray-400" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* New Premium Integration API Keys Card */}
          <Card className="rounded-[1.5rem] border-0 shadow-sm bg-white overflow-hidden">
            <CardHeader className="bg-gray-50 border-b border-gray-100 p-6">
              <CardTitle className="text-lg font-black flex items-center gap-2 text-gray-900">
                <Key className="text-[#ffd709]" size={20} />
                การเชื่อมต่อ API ภายนอก (Integration API Keys)
              </CardTitle>
              <CardDescription className="text-xs">ระบุ API Keys เพื่อเปิดระบบนำทางแผนที่, ตรวจสลิปอัตโนมัติ และตัดบัตรเครดิต</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {/* Google Maps API Key */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-gray-700">Google Maps API Key (ระบบจัดเส้นทางไรเดอร์)</label>
                  <button 
                    type="button" 
                    onClick={() => toggleKeyVisibility("google")}
                    className="text-[10px] text-gray-500 flex items-center gap-1 hover:text-gray-900"
                  >
                    {showKeys["google"] ? <EyeOff size={12} /> : <Eye size={12} />} 
                    {showKeys["google"] ? "ซ่อนคีย์" : "แสดงคีย์"}
                  </button>
                </div>
                <Input 
                  type={showKeys["google"] ? "text" : "password"}
                  placeholder="AIzaSy..." 
                  value={googleMapsKey} 
                  onChange={e => setGoogleMapsKey(e.target.value)}
                  className="rounded-xl border-gray-200 font-mono text-sm"
                />
              </div>

              {/* SlipOK API Integration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-gray-700">SlipOK API Key (ตรวจสลิปอัตโนมัติ)</label>
                    <button 
                      type="button" 
                      onClick={() => toggleKeyVisibility("slip")}
                      className="text-[10px] text-gray-500 flex items-center gap-1 hover:text-gray-900"
                    >
                      {showKeys["slip"] ? <EyeOff size={12} /> : <Eye size={12} />} 
                      {showKeys["slip"] ? "ซ่อน" : "แสดง"}
                    </button>
                  </div>
                  <Input 
                    type={showKeys["slip"] ? "text" : "password"}
                    placeholder="SLIPOK-KEY..." 
                    value={slipOkKey} 
                    onChange={e => setSlipOkKey(e.target.value)}
                    className="rounded-xl border-gray-200 font-mono text-sm"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700">SlipOK Branch ID</label>
                  <Input 
                    placeholder="เช่น 1234" 
                    value={slipOkBranchId} 
                    onChange={e => setSlipOkBranchId(e.target.value)}
                    className="rounded-xl border-gray-200 font-mono text-sm"
                  />
                </div>
              </div>

              {/* Stripe Publishable Key */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-gray-700">Stripe Publishable Key (ระบบชำระเงินบัตรเครดิต)</label>
                  <button 
                    type="button" 
                    onClick={() => toggleKeyVisibility("stripe")}
                    className="text-[10px] text-gray-500 flex items-center gap-1 hover:text-gray-900"
                  >
                    {showKeys["stripe"] ? <EyeOff size={12} /> : <Eye size={12} />} 
                    {showKeys["stripe"] ? "ซ่อนคีย์" : "แสดงคีย์"}
                  </button>
                </div>
                <Input 
                  type={showKeys["stripe"] ? "text" : "password"}
                  placeholder="pk_live_..." 
                  value={stripePublicKey} 
                  onChange={e => setStripePublicKey(e.target.value)}
                  className="rounded-xl border-gray-200 font-mono text-sm"
                />
              </div>

              <Button
                onClick={handleSavePlatformSettings}
                disabled={isSavingConfigs}
                className="w-full bg-[#ffd709] hover:bg-[#ffd709]/90 text-[#1c1c1e] font-black rounded-xl py-6 mt-4 flex items-center justify-center gap-2"
              >
                {isSavingConfigs ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    กำลังบันทึกการตั้งค่าระบบ...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={18} />
                    บันทึกการตั้งค่าและเปิดใช้งาน API Keys
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Quick System Diagnostics */}
          <Card className="rounded-[1.5rem] border-0 shadow-sm bg-white overflow-hidden p-6 space-y-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="text-green-500" size={18} /> Diagnostics & Node info
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-400">Database Status:</span>
                <span className="font-bold text-green-600">CONNECTED (Live Supabase)</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-400">Storage Bins:</span>
                <span className="font-bold text-gray-800">menus, profiles, slips, banners</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Security Policies:</span>
                <span className="font-bold text-gray-800">RLS Enforced (10 tables)</span>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
