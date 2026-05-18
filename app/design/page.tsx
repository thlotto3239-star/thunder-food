"use client";

import { useState, useEffect } from "react";
import { ThunderLogo } from "@/components/thunder/logo";
import { ArrowLeft, Check, Copy, Palette, Type, Shield, Sparkles, Smartphone, Award, Flame } from "lucide-react";
import Link from "next/link";
import { useNotification } from "@/components/thunder/notification-popup";
import { cn } from "@/lib/utils";

interface LogoSpecification {
  id: 1 | 2 | 3;
  name: string;
  tagline: string;
  concept: string;
  colors: { name: string; hex: string; desc: string }[];
  typography: { family: string; weight: string; style: string };
  suitability: string;
  pros: string[];
}

export default function DesignShowcasePage() {
  const [selectedOption, setSelectedOption] = useState<1 | 2 | 3>(1);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const { showNotification } = useNotification();

  useEffect(() => {
    const stored = localStorage.getItem("thunder_logo_option");
    if (stored) {
      const parsed = parseInt(stored, 10);
      if (parsed === 1 || parsed === 2 || parsed === 3) {
        setSelectedOption(parsed as 1 | 2 | 3);
      }
    }
  }, []);

  const handleSelectLogo = (optionId: 1 | 2 | 3) => {
    setSelectedOption(optionId);
    localStorage.setItem("thunder_logo_option", optionId.toString());
    
    // Trigger a storage event to notify other components instantly
    window.dispatchEvent(new Event("storage"));

    showNotification({
      type: "success",
      title: "อัปเดตโลโก้แบรนด์สำเร็จ! ⚡",
      message: `ระบบได้ทำการตั้งค่าโลโก้ Option ${optionId} เป็นโลโก้หลักของทั้งเว็บไซต์เรียบร้อยแล้ว`,
      duration: 3000,
    });
  };

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    showNotification({
      type: "success",
      title: "คัดลอกรหัสสีแล้ว 🎨",
      message: `คัดลอกรหัสสี ${hex} ไปยังคลิปบอร์ดแล้ว`,
      duration: 2000,
    });
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const logoSpecs: LogoSpecification[] = [
    {
      id: 1,
      name: "Option 1: Classic Yellow Circle Badge",
      tagline: "ไอคอนกลมสีเหลืองพรีเมียม สไตล์แบรนด์ชั้นนำระดับสากล",
      concept: "มุ่งเน้นความเป็นมิตร เรียบง่าย จดจำง่ายเป็นอันดับหนึ่ง (High Memorability) ออกแบบด้วยสัดส่วนวงกลมทองคำเพื่อความสมดุลสูงสุด สายฟ้าคมเข้มสีดำตัดกับพื้นหลังสีเหลืองสร้างจุดโฟกัสสายตาที่ยอดเยี่ยม เหมาะกับแบรนด์ที่เข้าถึงง่ายและเป็นมิตรกับลูกค้าทุกช่วงวัย",
      colors: [
        { name: "Vibrant Yellow", hex: "#FFD709", desc: "สะท้อนความกระฉับกระเฉง ความเร็ว และรสชาติอาหารที่อร่อยดึงดูดใจ" },
        { name: "Pure Carbon Black", hex: "#0A0A0A", desc: "สื่อถึงความแข็งแกร่ง มั่นคง และความเป็นทางการระดับมืออาชีพ" },
        { name: "Clean Muted Gray", hex: "#AFADAC", desc: "รักษาสมดุลและให้ความรู้สึกพรีเมียม สบายตาในการสื่อสารแบรนด์" }
      ],
      typography: {
        family: "Inter / Montserrat",
        weight: "Heavy Bold / Black (900)",
        style: "Classic Solid Straight (แนวตั้งตรง มั่นคง ปลอดภัย)"
      },
      suitability: "แอปพลิเคชันเวอร์ชันหลักหน้าบ้าน (Customer App) ที่เน้นให้ลูกค้าจดจำแบรนด์ได้ทันทีตั้งแต่แรกเห็นบนหน้าจอมือถือ",
      pros: [
        "จดจำได้ง่ายมากเมื่อย่อขนาดเป็น Favicon หรือ App Icon",
        "สีคอนทราสต์จัดจ้าน ทำให้อ่านง่ายทั้งบนพื้นหลังสีสว่างและมืด",
        "แฝงความขี้เล่น เป็นมิตร และดูพรีเมียมสากลไปพร้อมกัน"
      ]
    },
    {
      id: 2,
      name: "Option 2: High-Velocity Dark Italic",
      tagline: "โลโก้แนวสปอร์ต ปราดเปรียว สไตล์สปอร์ตพรีเมียมและความเร็วสูง",
      concept: "ออกแบบมาเพื่อสะท้อนความเร็วเหนือระดับดุจสายฟ้า (High Velocity) โดยปรับเอียงข้อความให้อยู่ในโหมดตัวเอียง (Italic) ผสานกับตัวหนาพิเศษเพื่อขับเน้นมิติแห่งการเคลื่อนไหวที่ฉับไว สัญลักษณ์โล่สายฟ้ารูปทรงอนาคต (Futuristic Shield) สื่อถึงระบบการจัดส่งที่รวดเร็วและปลอดภัยสูงสุด",
      colors: [
        { name: "Kinetic Yellow", hex: "#FFD709", desc: "สีเหลืองความเร็วสูงกระตุ้นการตัดสินใจและการจัดส่งที่ฉับไว" },
        { name: "Versch Carbon", hex: "#1E1E1E", desc: "สะท้อนความหรูหรา ลึกลับ และทรงพลังของเทคโนโลยียุคใหม่" },
        { name: "Snow White", hex: "#F9F6F5", desc: "สะท้อนความสะอาด ปลอดภัย และความใส่ใจในทุกออเดอร์จัดส่ง" }
      ],
      typography: {
        family: "Futura / Impact / Custom Italic",
        weight: "Extra Black Italic (950)",
        style: "Dynamic Slanted (ตัวเอียงลาดชันแห่งความเร็วและการเคลื่อนไหว)"
      },
      suitability: "แอปพลิเคชันระบบการนำทางของไรเดอร์ (Rider App) และแบรนด์โลจิสติกส์ที่ต้องการชูจุดเด่นเรื่อง 'ความเร็วแบบพริบตา'",
      pros: [
        "เข้ากันกับธีมการออกแบบหน้าล็อกอินของแอปพลิเคชัน 100%",
        "ให้ความรู้สึกมีพลัง ทันสมัย และตื่นเต้นท้าทาย",
        "สะท้อนความเป็นระบบส่งอาหารที่รวดเร็วที่สุดในตลาด"
      ]
    },
    {
      id: 3,
      name: "Option 3: Minimalist Food Dome & Bolt",
      tagline: "ความประณีตระดับ Luxury ผสานสัญลักษณ์จานฝาครอบทองคำเข้ากับสายฟ้า",
      concept: "โลโก้เชิงสัญลักษณ์ชั้นสูง (Luxurious Food Emblem) ที่ผสานรูปทรงของ 'ฝาครอบอาหารจานหรู (Food Dome)' เข้ากับ 'สายฟ้าแห่งความรวดเร็ว' ออกแบบด้วยเส้นสาย Vector สไตล์มินิมอลลิสต์ สะท้อนการคัดสรรอาหารระดับพรีเมียม บริการที่ประณีตดุจโรงแรมห้าดาวแต่รวดเร็วทันใจในทันที",
      colors: [
        { name: "Luxury Gold", hex: "#FFD709", desc: "สีทองพรีเมียม สื่อถึงอาหารจานหรู บริการคุณภาพสูงสุด และคุณค่าพิเศษ" },
        { name: "Deep Charcoal", hex: "#0A0A0A", desc: "ความเป็นทางการ ความเป็นระเบียบ และความสง่างามขององค์กร" },
        { name: "Soft Muted Cream", hex: "#F9F6F5", desc: "ความสุภาพ นุ่มนวล และการใส่ใจรายละเอียดบริการระดับห้าดาว" }
      ],
      typography: {
        family: "Cinzel / Playfair / Outfit Light",
        weight: "Light to Medium Spaced (ตัวบาง ระยะห่างกว้างสุดพรีเมียม)",
        style: "Modern Spaced Luxury (เน้นความโล่ง สะอาด หรูหรา ดูแพง)"
      },
      suitability: "แผงควบคุมระบบจัดการของร้านค้าอาหารชั้นนำ (Restaurant CMS Panel) และภาพลักษณ์การตลาดระดับพรีเมียมหรูหรา",
      pros: [
        "ยกระดับแบรนด์ให้ดูมีคลาส หรูหรา และเป็นทางการสูงมาก",
        "สื่อสัญลักษณ์ของ 'อาหาร (Food Dome)' ได้ชัดเจนที่สุด",
        "ดูสะอาดตา เหมาะกับการทำประชาสัมพันธ์ในโฆษณาระดับไฮเอนด์"
      ]
    }
  ];

  const currentSpec = logoSpecs.find(spec => spec.id === selectedOption) || logoSpecs[0];

  return (
    <div className="min-h-screen bg-[#f9f6f5] text-[#0a0a0a] pb-24 font-body transition-colors duration-300">
      {/* Dynamic Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-[#eae7e7] shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/customer" className="flex items-center gap-2 text-sm font-bold text-[#6c5a00] hover:text-[#5e4e00] transition-all">
            <ArrowLeft className="w-4 h-4" /> Back to App
          </Link>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-xs font-bold text-[#afadac] uppercase tracking-widest">Brand System Live Editor</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 mt-8 space-y-12">
        {/* Title Section */}
        <section className="space-y-4 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#ffd709]/10 border border-[#ffd709]/20 rounded-full">
            <Sparkles className="w-4 h-4 text-[#6c5a00]" />
            <span className="text-[#6c5a00] font-label text-xs font-bold tracking-[0.2em] uppercase">Visual Identity System</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-headline font-black tracking-tight text-[#0a0a0a]">
            ระบบออกแบบและเลือก <span className="text-[#6c5a00]">โลโก้แบรนด์เป็นทางการ</span>
          </h1>
          <p className="text-[#5c5b5b] text-base md:text-lg max-w-2xl leading-relaxed">
            สัมผัสประสบการณ์การออกแบบแบรนด์ระดับมืออาชีพของ <strong>ARMUXUI</strong> โดยเลือกและปรับแต่งโลโก้ที่เหมาะกับสไตล์แอปพลิเคชันของคุณทันที
          </p>
        </section>

        {/* Live Preview Arena */}
        <section className="bg-white border border-[#eae7e7] rounded-[2.5rem] p-6 md:p-8 shadow-xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#ffd709]/5 blur-[80px] -z-10 rounded-full"></div>
          
          <h2 className="text-xl font-bold text-[#0a0a0a] mb-6 flex items-center gap-2">
            <Award className="w-5 h-5 text-[#6c5a00]" /> เวทีทดสอบการแสดงผลโลโก้จริง (Live Brand Rendering Stage)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Light Mode Stage */}
            <div className="bg-[#f3f0ef] rounded-3xl p-8 flex flex-col items-center justify-center min-h-[220px] border border-[#eae7e7] relative group shadow-inner">
              <span className="absolute top-3 left-4 text-[10px] font-bold uppercase tracking-wider text-[#afadac]">Light Mode Display</span>
              <div className="transform transition-all duration-500 scale-125 group-hover:scale-135">
                <ThunderLogo size="xl" option={selectedOption} />
              </div>
            </div>

            {/* Dark Mode Stage */}
            <div className="bg-[#0e0e0e] rounded-3xl p-8 flex flex-col items-center justify-center min-h-[220px] relative group shadow-2xl">
              <span className="absolute top-3 left-4 text-[10px] font-bold uppercase tracking-wider text-[#5c5b5b]">Dark Mode Display</span>
              <div className="transform transition-all duration-500 scale-125 group-hover:scale-135">
                <ThunderLogo size="xl" option={selectedOption} />
              </div>
            </div>
          </div>

          {/* Active Spec Info */}
          <div className="mt-8 pt-8 border-t border-[#eae7e7] grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#afadac] flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" /> Brand Concept
              </span>
              <h3 className="font-bold text-[#0a0a0a] text-lg">{currentSpec.name}</h3>
              <p className="text-xs text-[#5c5b5b] italic">{currentSpec.tagline}</p>
            </div>
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#afadac] flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5" /> Typography Rules
              </span>
              <p className="text-sm font-bold text-[#0a0a0a]">{currentSpec.typography.family}</p>
              <p className="text-xs text-[#5c5b5b]">{currentSpec.typography.weight}</p>
              <p className="text-xs text-[#6c5a00] font-medium">{currentSpec.typography.style}</p>
            </div>
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#afadac] flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5" /> Best Suited For
              </span>
              <p className="text-xs text-[#5c5b5b] leading-relaxed">{currentSpec.suitability}</p>
            </div>
          </div>
        </section>

        {/* The 3 Design Options grid */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-[#0a0a0a] text-center md:text-left flex items-center gap-2">
            <Flame className="w-6 h-6 text-[#6c5a00]" /> ตัวเลือกการออกแบบโลโก้ทั้ง 3 รูปแบบ (The 3 Professional Design Options)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {logoSpecs.map((spec) => {
              const isSelected = selectedOption === spec.id;
              return (
                <div
                  key={spec.id}
                  className={cn(
                    "bg-white rounded-3xl p-6 border-2 transition-all duration-300 flex flex-col justify-between shadow-md relative overflow-hidden group",
                    isSelected 
                      ? "border-[#ffd709] ring-4 ring-[#ffd709]/10 -translate-y-2" 
                      : "border-[#eae7e7] hover:border-[#ffd709]/40 hover:-translate-y-1"
                  )}
                >
                  {isSelected && (
                    <div className="absolute top-0 right-0 bg-[#ffd709] text-[#453900] text-[9px] font-black tracking-widest uppercase py-1 px-4 rounded-bl-2xl flex items-center gap-1">
                      <Check className="w-3 h-3" /> Selected Active
                    </div>
                  )}

                  <div className="space-y-5">
                    {/* Badge and Logo render */}
                    <div className="bg-[#f3f0ef] rounded-2xl p-5 flex items-center justify-center min-h-[140px] border border-[#eae7e7] shadow-inner">
                      <ThunderLogo size="lg" option={spec.id} />
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-black text-[#0a0a0a] text-base">{spec.name}</h3>
                      <p className="text-xs text-[#5c5b5b] leading-relaxed">{spec.concept}</p>
                    </div>

                    {/* Pros list */}
                    <div className="space-y-1.5 pt-2">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-[#afadac]">Key Advantages:</span>
                      <ul className="space-y-1">
                        {spec.pros.map((pro, index) => (
                          <li key={index} className="text-[11px] text-[#5c5b5b] flex items-start gap-1.5">
                            <span className="text-[#6c5a00] font-bold">•</span> {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-6">
                    <button
                      onClick={() => handleSelectLogo(spec.id)}
                      className={cn(
                        "w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 active:scale-95 shadow-md flex items-center justify-center gap-2",
                        isSelected
                          ? "bg-[#0a0a0a] text-[#ffd709] cursor-default"
                          : "bg-[#ffd709] text-[#453900] hover:bg-[#5e4e00] hover:text-[#fff2cd]"
                      )}
                    >
                      {isSelected ? "โลโก้นี้เปิดใช้งานอยู่" : "เลือกใช้งานโลโก้นี้"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Palette Showcase */}
        <section className="bg-white border border-[#eae7e7] rounded-[2.5rem] p-8 shadow-lg">
          <h2 className="text-xl font-bold text-[#0a0a0a] mb-6 flex items-center gap-2">
            <Palette className="w-5 h-5 text-[#6c5a00]" /> รหัสสีแบรนด์กลางอย่างเป็นทางการ (Official Brand Color Palette)
          </h2>
          <p className="text-sm text-[#5c5b5b] mb-6 leading-relaxed">
            จานสีของเราได้รับการวิจัยเพื่อสะท้อนจิตวิทยาด้านความเร็ว พลังงาน และความน่ารับประทานของอาหาร (Food Aesthetics) 
            คุณสามารถคลิกรหัสสีเพื่อคัดลอกไปใช้ในงานออกแบบภายนอกได้ทันที
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {currentSpec.colors.map((color, index) => (
              <div 
                key={index} 
                className="bg-[#f3f0ef] border border-[#eae7e7] rounded-2xl p-4 flex items-center gap-4 hover:shadow-md transition-all duration-300 cursor-pointer group"
                onClick={() => copyToClipboard(color.hex)}
              >
                <div 
                  className="w-12 h-12 rounded-xl shadow-md border border-[#0a0a0a]/10 transition-transform group-hover:scale-105"
                  style={{ backgroundColor: color.hex }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#0a0a0a] truncate">{color.name}</span>
                    {copiedColor === color.hex ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-[#afadac] group-hover:text-[#6c5a00] transition-colors" />
                    )}
                  </div>
                  <span className="text-[11px] font-mono font-bold text-[#6c5a00]">{color.hex}</span>
                  <p className="text-[10px] text-[#5c5b5b] leading-tight mt-0.5 truncate">{color.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Technical Handoff note */}
        <section className="bg-[#ffd709]/10 border border-[#ffd709]/20 rounded-[2.5rem] p-6 md:p-8 space-y-4">
          <h3 className="font-bold text-[#6c5a00] text-lg flex items-center gap-2">
            ⚡ คำแนะนำทางด้านเทคนิคสำหรับการนำเสนอแบรนด์
          </h3>
          <p className="text-xs text-[#5c5b5b] leading-relaxed">
            โลโก้ทุกชิ้นถูกเรนเดอร์ในรูปแบบ <strong>SVG (Scalable Vector Graphics)</strong> โดยไม่มีการใช้ไฟล์รูปภาพแบบพิกเซล เพื่อให้โลโก้มีความคมชัดสูงสุดในทุกมิติหน้าจอ ตั้งแต่ Apple Watch ไปจนถึงจอทีวีระดับ 8K นอกจากนี้การผสานระบบ Real-time Storage Listener ทำให้เมื่อคุณคลิกเปลี่ยนโลโก้บนหน้านี้ โลโก้ในหน้าอื่นๆ (เช่น หน้าจอลูกค้า, หน้าใบเสร็จ) จะขยับเปลี่ยนตามการตัดสินใจของคุณทันทีโดยไม่ต้องรันโค้ดใหม่
          </p>
        </section>
      </main>
    </div>
  );
}
