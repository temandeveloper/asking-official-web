-- ==============================================================================
-- MIGRATION: Lynk.id Webhook & License Activation Support for public.tb_payment
-- ==============================================================================

-- 1. Izinkan kolom uid bernilai NULL (agar webhook Lynk.id bisa insert sebelum user mendaftar/login)
ALTER TABLE public.tb_payment 
ALTER COLUMN uid DROP NOT NULL;

-- 2. Tambah kolom baru: activation_code, deviceid, dan payment_payload
DO $$
BEGIN
    -- activation_code: menampung refId dari Lynk.id atau uid sebagai default
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'tb_payment' AND column_name = 'activation_code'
    ) THEN
        ALTER TABLE public.tb_payment ADD COLUMN activation_code TEXT;
    END IF;

    -- deviceid: identitas unik perangkat desktop user (opsional / default null)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'tb_payment' AND column_name = 'deviceid'
    ) THEN
        ALTER TABLE public.tb_payment ADD COLUMN deviceid TEXT DEFAULT NULL;
    END IF;

    -- payment_payload: menyimpan seluruh payload mentah JSON dari webhook Lynk.id
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'tb_payment' AND column_name = 'payment_payload'
    ) THEN
        ALTER TABLE public.tb_payment ADD COLUMN payment_payload JSONB DEFAULT NULL;
    END IF;
END $$;

-- 3. Unique Index untuk activation_code (mencegah duplikasi transaksi dan mempercepat pencarian aktivasi)
CREATE UNIQUE INDEX IF NOT EXISTS idx_tb_payment_activation_code 
ON public.tb_payment(activation_code) 
WHERE activation_code IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_tb_payment_deviceid 
ON public.tb_payment(deviceid);

-- 4. Trigger: Default value activation_code = uid (jika activation_code kosong dan uid ada)
CREATE OR REPLACE FUNCTION public.set_default_activation_code()
RETURNS TRIGGER AS $$
BEGIN
    -- Jika activation_code tidak dikirim dan record memiliki uid (misal registrasi web normal)
    IF NEW.activation_code IS NULL AND NEW.uid IS NOT NULL THEN
        NEW.activation_code := NEW.uid::text;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_set_activation_code ON public.tb_payment;
CREATE TRIGGER trg_set_activation_code
BEFORE INSERT ON public.tb_payment
FOR EACH ROW
EXECUTE FUNCTION public.set_default_activation_code();

-- 5. Perbarui Stored Procedure get_operator_payments()
-- Agar Operator Dashboard tetap menampilkan user_email dan user_name meskipun uid masih NULL
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
   last_sign_in_at timestamp with time zone,
   business_requirement text,
   activation_code text,
   deviceid text
 )
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.uid,
    COALESCE(u.email, p.user_email, '')::TEXT AS user_email,
    COALESCE(u.raw_user_meta_data ->> 'full_name', u.raw_user_meta_data ->> 'name', p.user_name, '')::TEXT AS user_name,
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
    u.last_sign_in_at,
    p.business_requirement,
    p.activation_code,
    p.deviceid
  FROM public.tb_payment p
  LEFT JOIN auth.users u ON p.uid = u.id
  ORDER BY p.updated_at DESC NULLS LAST;
END;
$function$;

-- 6. RPC Function: Aktivasi Kode Lisensi oleh User dari Aplikasi Desktop/Web
-- Menghubungkan record Lynk.id (uid NULL) ke akun user yang login secara atomik
CREATE OR REPLACE FUNCTION public.claim_activation_code(
    p_code TEXT,
    p_target_uid UUID,
    p_target_deviceid TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_payment RECORD;
    v_existing_user_payment RECORD;
BEGIN
    -- Cari record payment berdasarkan activation_code
    SELECT * INTO v_payment
    FROM public.tb_payment
    WHERE activation_code = p_code
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Kode aktivasi tidak ditemukan atau tidak valid.');
    END IF;

    -- Validasi jika sudah diaktivasi oleh akun lain
    IF v_payment.uid IS NOT NULL AND v_payment.uid != p_target_uid THEN
        RETURN jsonb_build_object('success', false, 'message', 'Kode aktivasi sudah digunakan oleh akun lain.');
    END IF;

    -- Validasi status
    IF v_payment.status != 'active' THEN
        RETURN jsonb_build_object('success', false, 'message', 'Status lisensi ini tidak aktif (' || v_payment.status || ').');
    END IF;

    -- Cek apakah user sudah memiliki record tb_payment sebelumnya (misal Free Trial)
    SELECT * INTO v_existing_user_payment
    FROM public.tb_payment
    WHERE uid = p_target_uid AND id != v_payment.id;

    IF FOUND THEN
        -- Hapus/gantikan record trial lama agar constraint UNIQUE(uid) tidak bentrok
        DELETE FROM public.tb_payment WHERE id = v_existing_user_payment.id;
    END IF;

    -- Hubungkan lisensi ke user dan device
    UPDATE public.tb_payment
    SET 
        uid = p_target_uid,
        deviceid = COALESCE(p_target_deviceid, deviceid),
        updated_at = NOW()
    WHERE id = v_payment.id;

    RETURN jsonb_build_object(
        'success', true, 
        'message', 'Aktivasi lisensi berhasil!',
        'plan', v_payment.note_plan,
        'request_budget', v_payment.request_budget
    );
END;
$$;
