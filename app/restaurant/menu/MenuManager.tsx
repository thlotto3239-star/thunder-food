'use client'

import { useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { Switch } from '@/components/ui/switch'
import { 
  addCategory, 
  deleteCategory, 
  addMenuItem, 
  updateMenuItem, 
  deleteMenuItem 
} from '@/app/actions/menu'

type Category = { id: string; name: string; sort_order: number }
type MenuItem = { 
  id: string; 
  name: string; 
  description: string | null; 
  price: number; 
  category_id: string | null; 
  image_url: string | null; 
  is_available: boolean;
  menu_categories?: { name: string } | null;
}

export default function MenuManager({ 
  initialCategories, 
  initialItems 
}: { 
  initialCategories: Category[], 
  initialItems: MenuItem[] 
}) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<'items' | 'categories'>('items')
  
  // Modals state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [isItemModalOpen, setIsItemModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // --- Category Actions ---
  async function handleAddCategory(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    
    const res = await addCategory(name)
    if (res.error) toast({ title: 'เกิดข้อผิดพลาด', description: res.error, variant: 'destructive' })
    else {
      toast({ title: 'สำเร็จ', description: 'เพิ่มหมวดหมู่แล้ว' })
      setIsCategoryModalOpen(false)
    }
    setIsLoading(false)
  }

  async function handleDeleteCategory(id: string) {
    if (!confirm('ยืนยันการลบหมวดหมู่นี้? (เมนูในหมวดหมู่นี้จะไม่ถูกลบ แต่จะไม่มีหมวดหมู่)')) return
    setIsLoading(true)
    const res = await deleteCategory(id)
    if (res.error) toast({ title: 'เกิดข้อผิดพลาด', description: res.error, variant: 'destructive' })
    else toast({ title: 'สำเร็จ', description: 'ลบหมวดหมู่แล้ว' })
    setIsLoading(false)
  }

  // --- Item Actions ---
  async function handleSaveItem(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData(e.currentTarget)
    
    // Add is_available from checkbox/switch
    const isAvailable = (e.currentTarget.elements.namedItem('is_available') as HTMLInputElement).checked
    formData.append('is_available', isAvailable.toString())

    const res = editingItem 
      ? await updateMenuItem(editingItem.id, formData)
      : await addMenuItem(formData)

    if (res.error) {
      toast({ title: 'เกิดข้อผิดพลาด', description: res.error, variant: 'destructive' })
    } else {
      toast({ title: 'สำเร็จ', description: editingItem ? 'อัปเดตเมนูแล้ว' : 'เพิ่มเมนูแล้ว' })
      setIsItemModalOpen(false)
      setEditingItem(null)
    }
    setIsLoading(false)
  }

  async function handleDeleteItem(id: string) {
    if (!confirm('ยืนยันการลบเมนูนี้?')) return
    setIsLoading(true)
    const res = await deleteMenuItem(id)
    if (res.error) toast({ title: 'เกิดข้อผิดพลาด', description: res.error, variant: 'destructive' })
    else toast({ title: 'สำเร็จ', description: 'ลบเมนูแล้ว' })
    setIsLoading(false)
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex p-1 bg-[#e4e2e1] rounded-2xl w-fit">
        <button 
          onClick={() => setActiveTab('items')}
          className={`px-6 py-2 rounded-xl font-bold font-thai text-sm transition-all ${activeTab === 'items' ? 'bg-[#ffffff] text-[#0e0e0e] shadow-sm' : 'text-[#5c5b5b] hover:text-[#0e0e0e]'}`}
        >
          รายการอาหาร
        </button>
        <button 
          onClick={() => setActiveTab('categories')}
          className={`px-6 py-2 rounded-xl font-bold font-thai text-sm transition-all ${activeTab === 'categories' ? 'bg-[#ffffff] text-[#0e0e0e] shadow-sm' : 'text-[#5c5b5b] hover:text-[#0e0e0e]'}`}
        >
          หมวดหมู่
        </button>
      </div>

      {/* --- Categories View --- */}
      {activeTab === 'categories' && (
        <div className="space-y-4">
          <button 
            onClick={() => setIsCategoryModalOpen(true)}
            className="w-full bg-[#f3f0ef] hover:bg-[#e4e2e1] border-2 border-dashed border-[#afadac] text-[#2f2f2e] font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">add</span>
            เพิ่มหมวดหมู่ใหม่
          </button>
          
          <div className="grid gap-3">
            {initialCategories.length === 0 && <p className="text-center text-[#afadac] py-8">ยังไม่มีหมวดหมู่</p>}
            {initialCategories.map(cat => (
              <div key={cat.id} className="bg-[#ffffff] p-4 rounded-2xl shadow-sm flex justify-between items-center group">
                <span className="font-thai font-bold">{cat.name}</span>
                <button 
                  onClick={() => handleDeleteCategory(cat.id)}
                  disabled={isLoading}
                  className="w-8 h-8 rounded-full bg-[#ffefec] text-[#b02500] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity active:scale-90"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- Items View --- */}
      {activeTab === 'items' && (
        <div className="space-y-4">
          <button 
            onClick={() => { setEditingItem(null); setIsItemModalOpen(true); }}
            className="w-full bg-[#ffd709] hover:bg-[#5e4e00] hover:text-[#fff2cd] text-[#453900] font-bold py-4 rounded-2xl shadow-[0_12px_24px_-8px_rgba(255,215,9,0.3)] transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">add</span>
            เพิ่มเมนูอาหาร
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {initialItems.length === 0 && <p className="text-center text-[#afadac] py-8 col-span-full">ยังไม่มีเมนูอาหาร</p>}
            {initialItems.map(item => (
              <div key={item.id} className="bg-[#ffffff] p-4 rounded-2xl shadow-sm flex gap-4 border border-[#f3f0ef] relative overflow-hidden group">
                <div className="w-24 h-24 bg-[#e4e2e1] rounded-xl flex-shrink-0 overflow-hidden relative">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#afadac] text-3xl">restaurant</span>
                  )}
                  {!item.is_available && (
                    <div className="absolute inset-0 bg-[#ffffff]/60 backdrop-blur-sm flex items-center justify-center">
                      <span className="bg-[#b02500] text-[#ffffff] text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">หมด</span>
                    </div>
                  )}
                </div>
                <div className="flex-grow flex flex-col justify-center">
                  <div className="flex justify-between items-start">
                    <h4 className="font-thai font-bold text-[#2f2f2e] line-clamp-1">{item.name}</h4>
                    <span className="font-black text-[#6c5a00]">฿{item.price}</span>
                  </div>
                  {item.menu_categories && <p className="text-xs text-[#6c5a00] font-thai bg-[#ffd709]/20 w-fit px-2 py-0.5 rounded mt-1">{item.menu_categories.name}</p>}
                  <p className="text-[#afadac] text-xs font-thai line-clamp-2 mt-1">{item.description || 'ไม่มีคำอธิบาย'}</p>
                </div>

                {/* Actions overlay */}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-[#ffffff]/90 p-1 rounded-lg backdrop-blur-sm">
                  <button onClick={() => { setEditingItem(item); setIsItemModalOpen(true); }} className="w-8 h-8 rounded-lg bg-[#f3f0ef] text-[#2f2f2e] flex items-center justify-center active:scale-90 transition-transform">
                    <span className="material-symbols-outlined text-sm">edit</span>
                  </button>
                  <button onClick={() => handleDeleteItem(item.id)} className="w-8 h-8 rounded-lg bg-[#ffefec] text-[#b02500] flex items-center justify-center active:scale-90 transition-transform">
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- Category Modal --- */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-[200] bg-[#000000]/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#ffffff] w-full max-w-sm rounded-[2rem] p-6 shadow-2xl relative">
            <button onClick={() => setIsCategoryModalOpen(false)} className="absolute top-4 right-4 text-[#afadac] hover:text-[#2f2f2e]">
              <span className="material-symbols-outlined">close</span>
            </button>
            <h3 className="font-headline font-black text-xl mb-4">เพิ่มหมวดหมู่</h3>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <input name="name" required placeholder="ชื่อหมวดหมู่ เช่น อาหารจานเดียว" className="w-full bg-[#f3f0ef] border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#ffd709]" />
              </div>
              <button type="submit" disabled={isLoading} className="w-full bg-[#0e0e0e] text-[#ffd709] font-bold py-3 rounded-xl disabled:opacity-50">
                {isLoading ? 'กำลังบันทึก...' : 'บันทึก'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- Item Modal --- */}
      {isItemModalOpen && (
        <div className="fixed inset-0 z-[200] bg-[#000000]/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#ffffff] w-full max-w-md rounded-[2rem] p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsItemModalOpen(false)} className="absolute top-4 right-4 text-[#afadac] hover:text-[#2f2f2e]">
              <span className="material-symbols-outlined">close</span>
            </button>
            <h3 className="font-headline font-black text-xl mb-6">{editingItem ? 'แก้ไขเมนู' : 'เพิ่มเมนูใหม่'}</h3>
            <form onSubmit={handleSaveItem} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#5c5b5b] mb-1">ชื่อเมนู *</label>
                <input name="name" required defaultValue={editingItem?.name} className="w-full bg-[#f3f0ef] border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#ffd709]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#5c5b5b] mb-1">ราคา (บาท) *</label>
                <input name="price" type="number" step="0.01" required defaultValue={editingItem?.price} className="w-full bg-[#f3f0ef] border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#ffd709]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#5c5b5b] mb-1">หมวดหมู่</label>
                <select name="category_id" defaultValue={editingItem?.category_id || ''} className="w-full bg-[#f3f0ef] border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#ffd709]">
                  <option value="">ไม่มีหมวดหมู่</option>
                  {initialCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#5c5b5b] mb-1">คำอธิบาย</label>
                <textarea name="description" rows={2} defaultValue={editingItem?.description || ''} className="w-full bg-[#f3f0ef] border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#ffd709] resize-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#5c5b5b] mb-1">อัปโหลดรูปภาพใหม่ (จะทับ URL เดิม)</label>
                <input type="file" name="image_file" accept="image/*" className="w-full bg-[#f3f0ef] border-none rounded-xl py-2 px-4 focus:ring-2 focus:ring-[#ffd709]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#5c5b5b] mb-1">หรือระบุ รูปภาพ (URL)</label>
                <input name="image_url" defaultValue={editingItem?.image_url || ''} placeholder="https://..." className="w-full bg-[#f3f0ef] border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#ffd709]" />
              </div>
              <div className="flex items-center justify-between bg-[#f3f0ef] p-3 rounded-xl">
                <span className="font-bold text-sm">พร้อมขาย (Available)</span>
                <input type="checkbox" name="is_available" id="is_available" defaultChecked={editingItem ? editingItem.is_available : true} className="w-5 h-5 rounded text-[#6c5a00] focus:ring-[#ffd709]" />
              </div>
              
              <button type="submit" disabled={isLoading} className="w-full bg-[#0e0e0e] text-[#ffd709] font-bold py-4 rounded-xl disabled:opacity-50 mt-4 text-lg">
                {isLoading ? 'กำลังบันทึก...' : 'บันทึกเมนู'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
