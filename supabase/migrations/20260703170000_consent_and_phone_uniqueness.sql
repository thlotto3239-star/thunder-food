-- Track PDPA consent timestamp on registration
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS accepted_terms_at timestamptz;

-- Enforce phone uniqueness at the database level (previously only guarded indirectly via auth.users.email)
-- Run the duplicate-check query first; if it returns rows, resolve them manually before this constraint will succeed.
ALTER TABLE public.users ADD CONSTRAINT users_phone_unique UNIQUE (phone);
