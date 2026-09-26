-- 1. Create role enum if not exists
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('user', 'vendor', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Add role column to public.users if not exists
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS role user_role NOT NULL DEFAULT 'user';

-- 3. Create vendors table for store profiles
CREATE TABLE IF NOT EXISTS public.vendors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  store_name varchar(255) NOT NULL,
  store_slug varchar(255) UNIQUE NOT NULL,
  description text,
  logo_url text,
  banner_url text,
  phone_number varchar(50),
  is_verified boolean DEFAULT false NOT NULL,
  is_active boolean DEFAULT true NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on vendors
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;

-- Anyone can view active verified vendors
DROP POLICY IF EXISTS "public can view active vendors" ON public.vendors;
CREATE POLICY "public can view active vendors"
ON public.vendors FOR SELECT
USING (true);

-- Vendors can update their own store profile
DROP POLICY IF EXISTS "vendors can update own store" ON public.vendors;
CREATE POLICY "vendors can update own store"
ON public.vendors FOR UPDATE
USING (auth.uid() = user_id);

-- 4. Function & Trigger to automatically synchronize auth.users -> public.users
CREATE OR REPLACE FUNCTION public.sync_auth_user_to_users()
RETURNS TRIGGER AS $$
DECLARE
  v_role user_role := 'user';
  v_first_name text := COALESCE(NEW.raw_user_meta_data->>'firstName', '');
  v_last_name text := COALESCE(NEW.raw_user_meta_data->>'lastName', '');
  v_raw_role text := COALESCE(NEW.raw_app_meta_data->>'role', NEW.raw_user_meta_data->>'role', 'user');
  v_store_name text := COALESCE(NEW.raw_user_meta_data->>'storeName', v_first_name || '''s Store');
  v_store_slug text;
BEGIN
  IF v_raw_role = 'admin' THEN
    v_role := 'admin';
  ELSIF v_raw_role = 'vendor' THEN
    v_role := 'vendor';
  ELSE
    v_role := 'user';
  END IF;

  -- Upsert public.users by email
  INSERT INTO public.users (id, email, first_name, last_name, role)
  VALUES (NEW.id, NEW.email, v_first_name, v_last_name, v_role)
  ON CONFLICT (email) DO UPDATE
  SET 
    id = EXCLUDED.id,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    role = EXCLUDED.role,
    updated_at = now();

  -- If registered as vendor, initialize their store profile
  IF v_role = 'vendor' THEN
    v_store_slug := LOWER(REGEXP_REPLACE(v_store_name || '-' || SUBSTRING(NEW.id::text, 1, 8), '[^a-zA-Z0-9]+', '-', 'g'));
    INSERT INTO public.vendors (user_id, store_name, store_slug)
    VALUES (NEW.id, v_store_name, v_store_slug)
    ON CONFLICT (user_id) DO NOTHING;
  END IF;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'sync_auth_user_to_users failed: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.sync_auth_user_to_users();

-- 5. Helper Snippet: To promote an existing user to admin or vendor in Supabase:
-- UPDATE auth.users SET raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}'::jsonb WHERE email = 'admin@example.com';
-- UPDATE public.users SET role = 'admin' WHERE email = 'admin@example.com';
