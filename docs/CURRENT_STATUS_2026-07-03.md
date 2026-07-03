# สถานะโปรเจกต์ Thunder Food (อัปเดต 2026-07-03)

เอกสารนี้เขียนขึ้นจากการทดสอบจริงกับฐานข้อมูล Supabase Production (`fflgvxjuugvsiwobramn`) เท่านั้น ไม่ใช่การอ้างจากโค้ดเฉยๆ

> **หมายเหตุสำคัญ:** เอกสาร `PRODUCTION_RELEASE_VERIFICATION_REPORT.md` และ `FINAL_DELIVERY_VERIFICATION_PLAN.md` ในโฟลเดอร์นี้ที่อ้างว่าระบบ "100% VERIFIED & PRODUCTION-READY" **ไม่เป็นความจริง** — ตรวจสอบจริงพบบั๊กร้ายแรงที่บล็อกทั้งระบบร้านค้า อย่าอ้างอิงเอกสารทั้งสองไฟล์นั้นเป็นความจริง

## 1. บั๊กร้ายแรงที่แก้ไปแล้ว

**ปัญหา:** ฟังก์ชัน `public.is_admin()` ในฐานข้อมูลจริง (ถูกสร้างนอกระบบ migration ไม่มีร่องรอยในโค้ด — schema drift) ไม่มีสิทธิ์ `EXECUTE` ให้ role `authenticated` ทำให้เกิด error `permission denied for function is_admin` (code 42501) เวลา:
- ร้านค้าบันทึกข้อมูลร้าน/ตั้งค่า
- ร้านค้าเข้าหน้าจัดการเมนู (ถูกล็อกไว้จนกว่าจะตั้งค่าร้านสำเร็จ)
- Admin ดูประวัติคำสั่งซื้อ
- Admin เปิด/ปิดร้านค้า

**ผลกระทบ:** ร้านค้าใหม่ทุกร้านเปิดร้านไม่ได้เลย นี่คือบั๊กที่ทำให้ระบบใช้งานจริงไม่ได้ทั้งหมด

**วิธีแก้:** `GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, service_role;` — รันแล้ว ยืนยันผลด้วยการทดสอบจริง (บันทึกข้อมูลร้าน → reload → ข้อมูลยังอยู่, admin กดระงับร้าน → reload → สถานะเปลี่ยนจริง)

## 2. ฟีเจอร์ที่เพิ่ม/แก้ในรอบนี้

| ฟีเจอร์ | ไฟล์หลัก | สถานะทดสอบ |
|---|---|---|
| Admin จัดการร้านค้าทั้งหมด (ดู/ระงับ/เปิด) | `app/admin/restaurants/AdminRestaurantsClient.tsx`, `app/actions/admin.ts` | ✅ ทดสอบผ่าน |
| Checkbox ยอมรับ Terms/PDPA ตอนสมัคร + หน้า `/terms` | `app/register/RegisterClient.tsx`, `app/terms/page.tsx`, `app/actions/auth.ts` | ✅ ทดสอบผ่าน |
| คอลัมน์ `accepted_terms_at` บนตาราง `users` | migration `20260703170000_consent_and_phone_uniqueness.sql` | ✅ ยืนยันมีอยู่จริงในฐานข้อมูล |
| Constraint กันเบอร์โทรซ้ำ (`users_phone_unique`) | migration เดียวกัน | ⚠️ รันแล้ว "Success" แต่ยังไม่ได้ทดสอบสมัครซ้ำเพื่อยืนยันจริง |
| ระบบคูปอง/ส่วนลดจริง (แทนโค้ดฝังตายตัว `UGLYOS50`) | `app/actions/coupons.ts`, `app/checkout/CheckoutClient.tsx`, `app/admin/settings/AdminSettingsClient.tsx`, migration `20260703180000_coupons.sql` | ✅ ทดสอบเต็มวงจร (สร้างโค้ด → ใช้ตอน checkout → คำนวณราคาถูกต้อง) |
| PWA (ติดตั้งผ่าน Chrome) | `public/manifest.json`, `public/sw.js`, `components/thunder/pwa-register.tsx` | ✅ ไฟล์ครบ ยังไม่ได้ทดสอบ "Add to Home Screen" บนมือถือจริง |

## 3. บัญชีทดสอบ

รหัสผ่านจริงไม่ใส่ไว้ในเอกสารนี้เพราะไฟล์นี้จะถูก push ขึ้น GitHub (public/shared repo) — ขอรหัสผ่านโดยตรงจากผู้ดูแลระบบแทน

| บทบาท | เบอร์โทร |
|---|---|
| Customer | 0810000001 |
| Restaurant | 0820000002 |
| Rider | 0830000003 |
| Admin (seed เดิม) | 0890000009 |
| Admin (สร้างใหม่) | 0985052814 |

## 4. การตัดสินใจสำคัญ

- **ตัด OTP/SMS ยืนยันเบอร์โทรออกโดยตั้งใจ** ตามคำสั่งผู้ใช้ ยอมรับความเสี่ยงว่าใครก็กรอกเบอร์อะไรก็สมัครได้ (ระบบปัจจุบันใช้เบอร์โทรแปลงเป็นอีเมลปลอมเข้า Supabase Auth เท่านั้น)

## 5. สิ่งที่ยังไม่ได้ทำ (จากการตรวจโค้ดจริงทั้งหมด — ความพร้อมเชิงพาณิชย์ ~20-30%)

- ระบบชำระเงินจริง (มีแค่ PromptPay QR แบบ public endpoint + อัปโหลดสลิปมือ ไม่มี Stripe/Omise/2C2P เชื่อมจริง)
- แผนที่/GPS real-time (เวลาจัดส่งเป็น string ฝังตายตัว "15-25 นาที" ไม่มี map component; ช่อง Google Maps API Key ใน Admin มีแต่ยังไม่ได้ใช้งานจริงในโค้ด)
- ระบบรีวิว/เรตติ้ง (ทั้ง 3 จุด: customer/restaurant/rider ยังเป็น "Coming soon")
- Push Notification จริง (มีแค่บันทึกลงตาราง DB เห็นเฉพาะตอนเปิดแอปอยู่ ไม่มี FCM/Web Push)
- KYC ร้านค้า/ไรเดอร์ (หน้า `/rider/documents` เป็น stub เปล่า, การยืนยันร้านค้าเป็นแค่ปุ่ม toggle ไม่มีเอกสารแนบ)
- ทดสอบ E2E เต็มวงจร (ลูกค้าสั่ง → ร้านรับ → ไรเดอร์ส่ง ต่อเนื่องกันในเซสชันเดียว) ยังไม่ได้ทำ — ทดสอบแยกทีละฟีเจอร์เท่านั้น

## 6. หมายเหตุโครงสร้างโปรเจกต์

โฟลเดอร์นี้ (`D:\โปรเจค\Project Thunder Food`) คือ git repo จริงที่เชื่อมกับ GitHub (`armynock-web/Thunder-Food-by-ARMUXUI`) ก่อนหน้านี้ไฟล์ในโฟลเดอร์นี้หายไปจากดิสก์ (เหลือแค่ `.git`) งานทั้งหมดที่ทำในรอบนี้ทำในโฟลเดอร์คู่ขนาน `D:\โปรเจค\THUNDER FOOD\Thunder-Food-by-ARMUXUI-main` (ที่ไม่ได้เชื่อม git) แล้ว sync กลับเข้ามาที่นี่ในคอมมิตนี้
