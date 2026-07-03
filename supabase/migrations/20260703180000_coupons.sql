-- Real coupon/discount system replacing the hardcoded "UGLYOS50" promo code
CREATE TABLE IF NOT EXISTS public.coupons (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  code text NOT NULL UNIQUE,
  discount_type text NOT NULL CHECK (discount_type IN ('percent', 'fixed')),
  discount_value numeric NOT NULL CHECK (discount_value > 0),
  min_order_amount numeric NOT NULL DEFAULT 0,
  max_uses int,
  used_count int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view coupons" ON public.coupons
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage coupons" ON public.coupons
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Track which coupon (if any) was applied to an order, for reporting
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS coupon_id uuid REFERENCES public.coupons(id);
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS discount_amount numeric NOT NULL DEFAULT 0;
