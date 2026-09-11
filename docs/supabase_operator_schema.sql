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
    request_budget NUMERIC(10, 2) DEFAULT 300,
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

-- 3. Stored Procedure: get_operator_payments()
-- Returns all tb_payment records with user email, full name, and last_sign_in_at from auth.users
DROP FUNCTION IF EXISTS public.get_operator_payments();

CREATE OR REPLACE FUNCTION public.get_operator_payments()
 RETURNS TABLE(
   id uuid,
   uid uuid,
   user_email text,
   user_name text,
   jenis_plan integer,
   note_plan text,
   datetime_payment bigint,
   datetime_expired bigint,
   request_budget numeric,
   status text,
   base_price bigint,
   discount bigint,
   price bigint,
   created_at timestamp with time zone,
   updated_at timestamp with time zone,
   last_sign_in_at timestamp with time zone
 )
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.uid,
    COALESCE(u.email, '')::TEXT AS user_email,
    COALESCE(u.raw_user_meta_data ->> 'full_name', u.raw_user_meta_data ->> 'name', '')::TEXT AS user_name,
    p.jenis_plan,
    p.note_plan,
    p.datetime_payment,
    p.datetime_expired,
    p.request_budget,
    p.status,
    p.base_price,
    p.discount,
    p.price,
    p.created_at,
    p.updated_at,
    u.last_sign_in_at
  FROM public.tb_payment p
  LEFT JOIN auth.users u ON p.uid = u.id
  ORDER BY p.updated_at DESC NULLS LAST;
END;
$function$;

-- 4. Stored Procedure: update_operator_payment()
CREATE OR REPLACE FUNCTION public.update_operator_payment(
  p_uid uuid,
  p_jenis_plan integer DEFAULT NULL::integer,
  p_note_plan text DEFAULT NULL::text,
  p_datetime_payment bigint DEFAULT NULL::bigint,
  p_datetime_expired bigint DEFAULT NULL::bigint,
  p_request_budget numeric DEFAULT NULL::numeric,
  p_status text DEFAULT NULL::text,
  p_base_price bigint DEFAULT NULL::bigint,
  p_discount bigint DEFAULT NULL::bigint,
  p_price bigint DEFAULT NULL::bigint
)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  v_result RECORD;
BEGIN
  UPDATE public.tb_payment
  SET
    jenis_plan = COALESCE(p_jenis_plan, jenis_plan),
    note_plan = COALESCE(p_note_plan, note_plan),
    datetime_payment = COALESCE(p_datetime_payment, datetime_payment),
    datetime_expired = COALESCE(p_datetime_expired, datetime_expired),
    request_budget = COALESCE(p_request_budget, request_budget),
    status = COALESCE(p_status, status),
    base_price = COALESCE(p_base_price, base_price),
    discount = COALESCE(p_discount, discount),
    price = COALESCE(p_price, price),
    updated_at = now()
  WHERE uid = p_uid
  RETURNING * INTO v_result;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Record with UID % not found', p_uid;
  END IF;

  RETURN to_jsonb(v_result);
END;
$function$;
