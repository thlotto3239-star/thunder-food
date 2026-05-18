import { createClient } from '@/utils/supabase/client';

export class OrderService {
  static async createOrder(order: any, items: any[]) {
    const supabase = createClient();
    
    // 1. Insert order
    const { data: newOrder, error: orderError } = await supabase
      .from('orders')
      .insert(order)
      .select()
      .single();
      
    if (orderError) return { error: orderError };

    // 2. Insert order items
    const orderItems = items.map(item => ({
      ...item,
      order_id: newOrder.id
    }));
    
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) return { error: itemsError };

    return { data: newOrder };
  }

  static async getCustomerOrders(customerId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('orders')
      .select('*, restaurants(name, image_url)')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });
    return { data, error };
  }

  static async getRestaurantOrders(restaurantId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('orders')
      .select('*, users(full_name, phone)')
      .eq('restaurant_id', restaurantId)
      .order('created_at', { ascending: false });
    return { data, error };
  }
  
  static async updateOrderStatus(orderId: string, status: 'pending' | 'preparing' | 'ready' | 'picking_up' | 'delivering' | 'completed' | 'cancelled') {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select();
    return { data, error };
  }
}
