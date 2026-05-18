"use client";

import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Search, 
  UserCheck, 
  UserX, 
  Edit3, 
  Phone, 
  Calendar, 
  Shield, 
  Truck, 
  Store, 
  X, 
  Loader2,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface UserRecord {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: "customer" | "rider" | "restaurant" | "admin";
  avatar_url: string | null;
  created_at: string;
}

export default function AdminUsersClient({ initialUsers }: { initialUsers: UserRecord[] }) {
  const [users, setUsers] = useState<UserRecord[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "customer" | "rider" | "restaurant" | "admin">("all");
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Edit Form State
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editRole, setEditRole] = useState<"customer" | "rider" | "restaurant" | "admin">("customer");
  
  // Rider specific state
  const [vehicleInfo, setVehicleInfo] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [isRiderVerified, setIsRiderVerified] = useState(true);

  const { toast } = useToast();
  const supabase = createClient();

  const roleColors: Record<string, string> = {
    customer: "bg-blue-100 text-blue-800 border border-blue-200",
    rider: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    restaurant: "bg-amber-100 text-amber-800 border border-amber-200",
    admin: "bg-purple-100 text-purple-800 border border-purple-200",
  };

  const roleIcons: Record<string, React.ReactNode> = {
    customer: <Users className="w-3.5 h-3.5" />,
    rider: <Truck className="w-3.5 h-3.5" />,
    restaurant: <Store className="w-3.5 h-3.5" />,
    admin: <Shield className="w-3.5 h-3.5" />,
  };

  // Filter users based on search and role
  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      (user.full_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (user.phone || "").includes(searchTerm);
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Open Edit Modal & Fetch optional Rider Profile Details
  async function handleOpenEdit(user: UserRecord) {
    setSelectedUser(user);
    setEditName(user.full_name || "");
    setEditPhone(user.phone || "");
    setEditRole(user.role);
    setVehicleInfo("");
    setLicensePlate("");

    if (user.role === "rider") {
      // Fetch Rider Profile from public.rider_profiles
      const { data, error } = await supabase
        .from("rider_profiles")
        .select("vehicle_info, license_plate")
        .eq("id", user.id)
        .maybeSingle();

      if (data) {
        setVehicleInfo(data.vehicle_info || "");
        setLicensePlate(data.license_plate || "");
      }
    }
  }

  // Save User Updates (Live Sync to Supabase)
  async function handleSaveUser(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedUser) return;

    setIsUpdating(true);
    try {
      // 1. Update public.users table
      const { error: userError } = await supabase
        .from("users")
        .update({
          full_name: editName || undefined,
          phone: editPhone || undefined,
          role: editRole,
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedUser.id);

      if (userError) throw userError;

      // 2. If role is/changed to Rider, upsert rider_profiles details
      if (editRole === "rider") {
        const { error: riderError } = await supabase
          .from("rider_profiles")
          .upsert({
            id: selectedUser.id,
            vehicle_info: vehicleInfo || "มอเตอร์ไซค์รับจ้าง",
            license_plate: licensePlate || "กข 123",
            updated_at: new Date().toISOString(),
          });

        if (riderError) throw riderError;
      }

      toast({
        title: "อัปเดตข้อมูลสำเร็จ!",
        description: `บันทึกข้อมูลของ "${editName}" เรียบร้อยแล้ว`,
      });

      // Update Local State
      setUsers(
        users.map((u) => 
          u.id === selectedUser.id 
            ? { ...u, full_name: editName, phone: editPhone, role: editRole } 
            : u
        )
      );

      setSelectedUser(null);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "เกิดข้อผิดพลาดในการอัปเดต",
        description: err.message,
      });
    } finally {
      setIsUpdating(false);
    }
  }

  // Delete / Suspend User Toggle
  async function handleToggleStatus(user: UserRecord) {
    const newRole = user.role === "customer" ? "admin" : "customer"; // Just a mock or direct toggler
    toast({
      title: "ปรับสถานะสำเร็จ",
      description: `ปรับสิทธิ์ผู้ใช้งาน "${user.full_name}" เรียบร้อย`,
    });
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl pb-24 font-thai">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#0e0e0e] tracking-tight">จัดการผู้ใช้งาน & ไรเดอร์</h1>
          <p className="text-[#8c8a88] text-sm mt-1">สืบค้น คัดกรอง แก้ไขข้อมูลสิทธิ์บทบาท และตรวจสอบเอกสารคนขับรถได้ทันที</p>
        </div>
        
        {/* Role Filters */}
        <div className="flex bg-[#ffd709]/10 border border-[#ffd709]/30 rounded-xl p-1 shadow-sm w-fit self-start md:self-auto flex-wrap">
          {(["all", "customer", "rider", "restaurant", "admin"] as const).map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={cn(
                "px-4 py-2 rounded-lg text-xs font-bold transition-all uppercase",
                roleFilter === role ? "bg-[#ffd709] text-[#1c1c1e] shadow-sm" : "text-gray-600 hover:text-gray-900"
              )}
            >
              {role === "all" ? "ทั้งหมด" : role}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Board */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "จำนวนผู้ใช้ทั้งหมด", value: users.length, color: "border-l-4 border-l-blue-500" },
          { label: "ลูกค้า (Customers)", value: users.filter(u => u.role === "customer").length, color: "border-l-4 border-l-cyan-500" },
          { label: "ไรเดอร์ (Riders)", value: users.filter(u => u.role === "rider").length, color: "border-l-4 border-l-emerald-500" },
          { label: "ร้านอาหาร (Restaurants)", value: users.filter(u => u.role === "restaurant").length, color: "border-l-4 border-l-amber-500" },
        ].map((stat, i) => (
          <Card key={i} className={cn("rounded-2xl border-gray-150 shadow-sm bg-white overflow-hidden", stat.color)}>
            <CardContent className="p-4">
              <span className="text-xs text-gray-400 font-bold">{stat.label}</span>
              <p className="text-2xl font-black mt-1 text-gray-900">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Input
          placeholder="ค้นหาด้วยชื่อผู้ใช้ หรือเบอร์โทรศัพท์..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="rounded-2xl border-gray-200 pl-10 pr-4 h-12 shadow-sm font-medium bg-white"
        />
        <Search className="absolute left-3.5 top-4 text-gray-400 w-5 h-5" />
      </div>

      {/* Main Users Table */}
      <Card className="rounded-[1.5rem] border-0 shadow-sm bg-white overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 border-b border-gray-150 font-bold">
                <tr>
                  <th className="p-4 font-bold">ชื่อ-นามสกุล</th>
                  <th className="p-4 font-bold">เบอร์โทรศัพท์</th>
                  <th className="p-4 font-bold">บทบาท (Role)</th>
                  <th className="p-4 font-bold">วันที่สมัครสมาชิก</th>
                  <th className="p-4 text-right font-bold">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-700 shadow-inner">
                          {user.full_name?.[0] || "U"}
                        </div>
                        <div>
                          <p className="text-gray-950 font-bold">{user.full_name || "ผู้ใช้ไม่ระบุนาม"}</p>
                          <span className="text-[10px] text-gray-400 font-mono">{user.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">
                      {user.phone ? (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-gray-400" />
                          {user.phone}
                        </span>
                      ) : (
                        <span className="text-gray-300">ไม่ได้ระบุ</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-xs font-black inline-flex items-center gap-1.5 shadow-sm uppercase",
                        roleColors[user.role]
                      )}>
                        {roleIcons[user.role]}
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500">
                      <span className="flex items-center gap-1 text-xs">
                        <Calendar className="w-3.5 h-3.5 text-gray-300" />
                        {new Date(user.created_at).toLocaleDateString("th-TH", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenEdit(user)}
                        className="rounded-xl border-gray-250 shadow-sm font-bold flex items-center gap-1 hover:bg-[#ffd709]/10"
                      >
                        <Edit3 size={12} /> จัดการ / อัปเดต
                      </Button>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-gray-400">
                      ไม่พบข้อมูลผู้ใช้งานที่ตรงตามตัวเลือกการค้นหา
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* BREATHTAKING EDIT GLASSMORPHIC MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] w-full max-w-lg p-6 shadow-2xl border border-gray-100 overflow-hidden relative mx-4 animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-700"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-black text-gray-950 flex items-center gap-2 mb-2">
              <Edit3 className="text-[#ffd709]" size={20} />
              อัปเดตข้อมูลผู้ใช้
            </h3>
            <p className="text-xs text-gray-400 mb-6">แก้ไขรายละเอียดเบื้องต้น สิทธิ์บทบาท และข้อมูลคนขับของระบบ Thunder Food</p>

            <form onSubmit={handleSaveUser} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">ชื่อ-นามสกุลจริง</label>
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="rounded-xl border-gray-200"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">เบอร์โทรศัพท์มือถือ</label>
                <Input
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="rounded-xl border-gray-200"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">สิทธิ์บทบาทการเข้าถึง (System Role)</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as any)}
                  className="w-full h-10 border border-gray-200 rounded-xl px-3 text-sm focus:outline-none bg-white"
                >
                  <option value="customer">Customer (ลูกค้า)</option>
                  <option value="rider">Rider (ไรเดอร์คนขับ)</option>
                  <option value="restaurant">Restaurant (ผู้ประกอบการ)</option>
                  <option value="admin">Admin (ผู้ดูเเลระบบ)</option>
                </select>
              </div>

              {/* RIDER-SPECIFIC FORM FIELDS */}
              {editRole === "rider" && (
                <div className="bg-emerald-50/50 border border-emerald-200/50 rounded-2xl p-4 space-y-3 animate-in slide-in-from-top-2 duration-300">
                  <span className="text-xs font-black text-emerald-800 flex items-center gap-1.5">
                    <Truck size={14} /> ข้อมูลไรเดอร์ไรเดอร์
                  </span>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-emerald-700">ข้อมูลยานพาหนะ</label>
                      <Input
                        value={vehicleInfo}
                        onChange={(e) => setVehicleInfo(e.target.value)}
                        placeholder="เช่น Honda Wave 110i"
                        className="rounded-xl border-emerald-200 bg-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-emerald-700">เลขทะเบียนรถ</label>
                      <Input
                        value={licensePlate}
                        onChange={(e) => setLicensePlate(e.target.value)}
                        placeholder="เช่น 1กข 4567 กทม."
                        className="rounded-xl border-emerald-200 bg-white"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-emerald-200/30">
                    <span className="text-[11px] font-bold text-emerald-700">ตรวจสอบความถูกต้อง / อนุมัติเอกสาร</span>
                    <button
                      type="button"
                      onClick={() => setIsRiderVerified(!isRiderVerified)}
                      className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold transition-all border flex items-center gap-1 shadow-sm",
                        isRiderVerified 
                          ? "bg-emerald-600 text-white border-emerald-700" 
                          : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                      )}
                    >
                      <CheckCircle2 size={12} /> {isRiderVerified ? "อนุมัติเรียบร้อย" : "รอดำเนินการ"}
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedUser(null)}
                  className="flex-1 rounded-xl py-5"
                >
                  ยกเลิก
                </Button>
                <Button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 bg-[#ffd709] hover:bg-[#ffd709]/90 text-[#1c1c1e] font-black rounded-xl py-5"
                >
                  {isUpdating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "บันทึกข้อมูลด่วน"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
