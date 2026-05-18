const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://fflgvxjuugvsiwobramn.supabase.co';
const supabaseKey = 'sb_publishable_9QB4O859yUvQN4jwU6eQHg_FcBLdlGA';
const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  const accounts = [
    { phone: '0810000001', role: 'customer', name: 'ลูกค้า ทดสอบ' },
    { phone: '0820000002', role: 'restaurant', name: 'ร้านอาหาร ทดสอบ' },
    { phone: '0830000003', role: 'rider', name: 'คนขับ ทดสอบ' },
    { phone: '0890000009', role: 'admin', name: 'ผู้ดูแลระบบ ทดสอบ' }
  ];

  for (const acc of accounts) {
    const email = `${acc.phone}@thunder-food.com`;
    const password = 'password123';
    
    console.log(`Creating ${acc.role}...`);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: acc.name,
          role: acc.role,
          phone: acc.phone
        }
      }
    });

    if (error) {
      if (error.message.includes('already registered')) {
        console.log(`${acc.phone} already exists.`);
      } else {
        console.error(`Error creating ${acc.phone}:`, error.message);
      }
    } else {
      console.log(`Created ${acc.phone} successfully.`);
      
      if (data.user) {
        await supabase.from('users').upsert({
          id: data.user.id,
          role: acc.role,
          full_name: acc.name,
          phone: acc.phone
        });
        
        if (acc.role === 'admin') {
           await supabase.from('users').update({ role: 'admin' }).eq('id', data.user.id);
        }
      }
    }
  }
}

seed();
