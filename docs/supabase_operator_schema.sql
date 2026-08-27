-- ==============================================================================
-- AsKing Operator Whitelist & Payment Table Schema
-- Jalankan skrip ini di Supabase Dashboard -> SQL Editor jika belum dibuat
-- ==============================================================================

-- 1. Create tb_operator Table for Whitelisted Operator Authentication
CREATE TABLE IF NOT EXISTS public.tb_operator (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'operator', -- 'operator' | 'admin' | 'superadmin'
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on tb_operator
ALTER TABLE public.tb_operator ENABLE ROW LEVEL SECURITY;

-- Policy: Allow read access for authenticated users / public verification
CREATE POLICY "Allow read access to tb_operator" 
ON public.tb_operator 
FOR SELECT 
USING (true);

-- Insert initial authorized operator (Ahmad Fadil)
INSERT INTO public.tb_operator (email, name, role)
VALUES ('ahmadfadil@godiscus.com', 'Ahmad Fadil', 'superadmin')
ON CONFLICT (email) DO UPDATE 
SET name = EXCLUDED.name, role = EXCLUDED.role;


-- 2. Ensure tb_payment Table has all necessary columns for Operator Dashboard
CREATE TABLE IF NOT EXISTS public.tb_payment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    uid UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    user_email TEXT,
    user_name TEXT,
    jenis_plan INT DEFAULT 0, -- 0 = Free Trial, 1 = Pro Business, 2 = Advance Business
    note_plan TEXT DEFAULT 'free trial',
    datetime_payment BIGINT,
    datetime_expired BIGINT,
    request_budget INT DEFAULT 50,
    status TEXT DEFAULT 'active', -- 'active' | 'pending' | 'expired' | 'suspended'
    base_price BIGINT, -- Inisialisasi dinamis dari PRICING_CONFIG.proOriginalPrice
    discount INT,      -- Persentase diskon dinamis dari PRICING_CONFIG.proDiscountPercent (e.g. 60)
    price BIGINT,       -- Inisialisasi dinamis dari PRICING_CONFIG.proRawAmount (e.g. 79000)
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexing for fast search & filtering
CREATE INDEX IF NOT EXISTS idx_tb_payment_uid ON public.tb_payment(uid);
CREATE INDEX IF NOT EXISTS idx_tb_payment_status ON public.tb_payment(status);
CREATE INDEX IF NOT EXISTS idx_tb_payment_user_email ON public.tb_payment(user_email);

-- Enable RLS on tb_payment
ALTER TABLE public.tb_payment ENABLE ROW LEVEL SECURITY;

-- Allow users to read/update their own payment record, or operators to access all
CREATE POLICY "Users can manage own payment record"
ON public.tb_payment
FOR ALL
USING (auth.uid()::text = uid::text OR auth.jwt() ->> 'email' IN (SELECT email FROM public.tb_operator));
