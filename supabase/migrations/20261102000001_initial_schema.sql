-- ==============================================================================
-- SEDUH BERKAH — MIGRATION 20261102000001: INITIAL SCHEMA & RLS POLICIES
-- Platform Digital Kedai Kopi Robusta Bengkulu Berbasis Akad Mudharabah & Sedekah
-- Lokasi: Lingkungan Masjid Kampus Universitas Bengkulu
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUM TYPES
DO $$ BEGIN
    CREATE TYPE user_role_type AS ENUM ('customer', 'operator', 'takmir');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_status_type AS ENUM ('pending', 'processing', 'ready', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_source_type AS ENUM ('online', 'walk_in');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status_type AS ENUM ('unpaid', 'paid', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE cost_category_type AS ENUM ('fixed_cost', 'variable_cost', 'waste_loss');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE cost_payment_status_type AS ENUM ('unpaid', 'paid');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE donation_status_type AS ENUM ('collected', 'allocated', 'disbursed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE distribution_status_type AS ENUM ('pending', 'verified', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE report_status_type AS ENUM ('draft', 'submitted_by_operator', 'verified_by_takmir', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE (Bound to Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT,
    role user_role_type NOT NULL DEFAULT 'customer',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger to create profile upon auth.users signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, phone, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Pelanggan'),
        NEW.raw_user_meta_data->>'phone',
        'customer' -- Role default selalu customer, proteksi privilege escalation
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth, pg_temp;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Helper function to check role securely
CREATE OR REPLACE FUNCTION public.get_current_role()
RETURNS user_role_type AS $$
    SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, auth, pg_temp;

-- 4. PRODUCTS TABLE (6 menu asli Robusta Bengkulu)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    price BIGINT NOT NULL CHECK (price >= 0),
    hpp BIGINT NOT NULL CHECK (hpp >= 0),
    image_url TEXT,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. ORDERS TABLE (Header pesanan penjualan kopi)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT NOT NULL UNIQUE,
    customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT,
    order_source order_source_type NOT NULL DEFAULT 'online',
    status order_status_type NOT NULL DEFAULT 'pending',
    subtotal BIGINT NOT NULL DEFAULT 0 CHECK (subtotal >= 0),
    donation_amount BIGINT NOT NULL DEFAULT 0 CHECK (donation_amount >= 0),
    total_amount BIGINT NOT NULL DEFAULT 0 CHECK (total_amount >= 0),
    notes TEXT,
    cancellation_reason TEXT,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. ORDER_ITEMS TABLE (Snapshot harga & HPP per transaksi)
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    product_name_snapshot TEXT NOT NULL,
    price_snapshot BIGINT NOT NULL CHECK (price_snapshot >= 0),
    hpp_snapshot BIGINT NOT NULL CHECK (hpp_snapshot >= 0),
    quantity INT NOT NULL CHECK (quantity > 0),
    subtotal BIGINT NOT NULL CHECK (subtotal >= 0)
);

-- 7. PAYMENT_RECORDS TABLE (Rekonsiliasi fisik kasir & isolasi sedekah)
CREATE TABLE IF NOT EXISTS public.payment_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL UNIQUE REFERENCES public.orders(id) ON DELETE CASCADE,
    business_amount BIGINT NOT NULL CHECK (business_amount >= 0),
    donation_amount BIGINT NOT NULL DEFAULT 0 CHECK (donation_amount >= 0),
    total_received BIGINT NOT NULL CHECK (total_received = business_amount + donation_amount),
    payment_method TEXT NOT NULL DEFAULT 'cash_on_pickup',
    payment_status payment_status_type NOT NULL DEFAULT 'unpaid',
    received_at TIMESTAMPTZ,
    received_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. OPERATIONAL_COSTS TABLE (Pencatatan biaya tetap, variabel, dan bahan terbuang)
CREATE TABLE IF NOT EXISTS public.operational_costs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    description TEXT NOT NULL,
    amount BIGINT NOT NULL CHECK (amount > 0),
    cost_category cost_category_type NOT NULL,
    transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
    payment_status cost_payment_status_type NOT NULL DEFAULT 'paid',
    reference_order_number TEXT,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. DONATION_TRANSACTIONS TABLE (Buku besar sedekah sukarela)
CREATE TABLE IF NOT EXISTS public.donation_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID UNIQUE REFERENCES public.orders(id) ON DELETE SET NULL,
    donor_name TEXT,
    amount BIGINT NOT NULL CHECK (amount > 0),
    status donation_status_type NOT NULL DEFAULT 'collected',
    received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. DONATION_DISTRIBUTIONS TABLE (Batch penyaluran sedekah)
CREATE TABLE IF NOT EXISTS public.donation_distributions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    distribution_date DATE NOT NULL DEFAULT CURRENT_DATE,
    recipient_name TEXT NOT NULL,
    description TEXT NOT NULL,
    total_amount BIGINT NOT NULL CHECK (total_amount > 0),
    evidence_url TEXT,
    status distribution_status_type NOT NULL DEFAULT 'pending',
    verified_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    verified_at TIMESTAMPTZ,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. DONATION_DISTRIBUTION_ITEMS TABLE (Relasi many-to-many sumber sedekah & penyaluran)
CREATE TABLE IF NOT EXISTS public.donation_distribution_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    distribution_id UUID NOT NULL REFERENCES public.donation_distributions(id) ON DELETE CASCADE,
    donation_transaction_id UUID NOT NULL REFERENCES public.donation_transactions(id) ON DELETE CASCADE,
    allocated_amount BIGINT NOT NULL CHECK (allocated_amount > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(distribution_id, donation_transaction_id)
);

-- 12. FINANCIAL_REPORTS TABLE (Laporan bulanan mudharabah terkunci)
CREATE TABLE IF NOT EXISTS public.financial_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    total_revenue BIGINT NOT NULL DEFAULT 0,
    total_hpp BIGINT NOT NULL DEFAULT 0,
    total_operational_cost BIGINT NOT NULL DEFAULT 0,
    net_profit BIGINT NOT NULL DEFAULT 0,
    takmir_share BIGINT NOT NULL DEFAULT 0,
    operator_share BIGINT NOT NULL DEFAULT 0,
    nisbah_takmir NUMERIC(5, 2) NOT NULL DEFAULT 60.00,
    nisbah_operator NUMERIC(5, 2) NOT NULL DEFAULT 40.00,
    status report_status_type NOT NULL DEFAULT 'draft',
    verified_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    verified_at TIMESTAMPTZ,
    rejection_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(period_start, period_end)
);

-- 13. IDEMPOTENCY_KEYS TABLE
CREATE TABLE IF NOT EXISTS public.idempotency_keys (
    key UUID PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    response_payload JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 14. DATABASE TRANSACTION RPC: ATOMIC ORDER CREATION
-- Validasi harga & HPP di server/database untuk mencegah manipulasi client
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.create_order_atomic(
    p_order_number TEXT,
    p_customer_name TEXT,
    p_customer_phone TEXT,
    p_order_source order_source_type,
    p_notes TEXT,
    p_is_donation_opt_in BOOLEAN,
    p_items JSONB -- Array of { product_id: UUID, quantity: INT }
)
RETURNS JSONB AS $$
DECLARE
    v_customer_id UUID := auth.uid();
    v_order_id UUID;
    v_item JSONB;
    v_prod RECORD;
    v_item_subtotal BIGINT;
    v_item_hpp BIGINT;
    v_total_subtotal BIGINT := 0;
    v_total_hpp BIGINT := 0;
    v_total_quantity INT := 0;
    v_donation_amount BIGINT := 0;
    v_grand_total BIGINT := 0;
BEGIN
    -- Validasi payload
    IF jsonb_array_length(p_items) = 0 THEN
        RAISE EXCEPTION 'Item pesanan tidak boleh kosong';
    END IF;

    -- Hitung subtotal dan snapshot harga dari tabel products
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        SELECT * INTO v_prod FROM public.products WHERE id = (v_item->>'product_id')::UUID;
        IF NOT FOUND THEN
            RAISE EXCEPTION 'Produk dengan ID % tidak ditemukan', (v_item->>'product_id');
        END IF;

        IF NOT v_prod.is_available THEN
            RAISE EXCEPTION 'Produk % sedang tidak tersedia / stok habis', v_prod.name;
        END IF;

        v_item_subtotal := v_prod.price * (v_item->>'quantity')::INT;
        v_item_hpp := v_prod.hpp * (v_item->>'quantity')::INT;

        v_total_subtotal := v_total_subtotal + v_item_subtotal;
        v_total_hpp := v_total_hpp + v_item_hpp;
        v_total_quantity := v_total_quantity + (v_item->>'quantity')::INT;
    END LOOP;

    -- Hitung sedekah sukarela jika dipilih (Rp1.000 x total porsi)
    IF p_is_donation_opt_in THEN
        v_donation_amount := v_total_quantity * 1000;
    END IF;

    v_grand_total := v_total_subtotal + v_donation_amount;

    -- 1. Insert header orders
    INSERT INTO public.orders (
        order_number,
        customer_id,
        customer_name,
        customer_phone,
        order_source,
        status,
        subtotal,
        donation_amount,
        total_amount,
        notes
    ) VALUES (
        p_order_number,
        v_customer_id,
        p_customer_name,
        p_customer_phone,
        p_order_source,
        'pending',
        v_total_subtotal,
        v_donation_amount,
        v_grand_total,
        p_notes
    ) RETURNING id INTO v_order_id;

    -- 2. Insert order_items dengan snapshot harga & HPP
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        SELECT * INTO v_prod FROM public.products WHERE id = (v_item->>'product_id')::UUID;
        INSERT INTO public.order_items (
            order_id,
            product_id,
            product_name_snapshot,
            price_snapshot,
            hpp_snapshot,
            quantity,
            subtotal
        ) VALUES (
            v_order_id,
            v_prod.id,
            v_prod.name,
            v_prod.price,
            v_prod.hpp,
            (v_item->>'quantity')::INT,
            v_prod.price * (v_item->>'quantity')::INT
        );
    END LOOP;

    -- 3. Insert payment_records
    INSERT INTO public.payment_records (
        order_id,
        business_amount,
        donation_amount,
        total_received,
        payment_method,
        payment_status
    ) VALUES (
        v_order_id,
        v_total_subtotal,
        v_donation_amount,
        v_grand_total,
        'cash_on_pickup',
        'unpaid'
    );

    -- 4. Insert donation_transactions jika pelanggan memilih bersedekah
    IF v_donation_amount > 0 THEN
        INSERT INTO public.donation_transactions (
            order_id,
            donor_name,
            amount,
            status
        ) VALUES (
            v_order_id,
            p_customer_name,
            v_donation_amount,
            'collected'
        );
    END IF;

    RETURN jsonb_build_object(
        'success', TRUE,
        'order_id', v_order_id,
        'order_number', p_order_number,
        'subtotal', v_total_subtotal,
        'donation_amount', v_donation_amount,
        'total_amount', v_grand_total
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth, pg_temp;

-- ==============================================================================
-- 15. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- A. PROFILES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by owner or takmir/operator" ON public.profiles
    FOR SELECT USING (auth.uid() = id OR public.get_current_role() IN ('operator', 'takmir'));

CREATE POLICY "Users can update own profile name/phone only" ON public.profiles
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id AND role = (SELECT role FROM public.profiles WHERE id = auth.uid()));

-- B. PRODUCTS (Public can read active products, operator/takmir manage)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active products" ON public.products
    FOR SELECT USING (is_available = TRUE OR public.get_current_role() IN ('operator', 'takmir'));

CREATE POLICY "Operator and Takmir can insert/update products" ON public.products
    FOR ALL USING (public.get_current_role() IN ('operator', 'takmir'));

-- C. ORDERS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers view own orders, operator & takmir view all" ON public.orders
    FOR SELECT USING (
        (auth.uid() IS NOT NULL AND customer_id = auth.uid()) OR
        public.get_current_role() IN ('operator', 'takmir')
    );

CREATE POLICY "Anyone can create order via atomic function" ON public.orders
    FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Operator can update order status" ON public.orders
    FOR UPDATE USING (public.get_current_role() IN ('operator', 'takmir'));

-- D. ORDER ITEMS
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View order items" ON public.order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders o
            WHERE o.id = order_items.order_id
            AND (o.customer_id = auth.uid() OR public.get_current_role() IN ('operator', 'takmir'))
        )
    );

-- E. PAYMENT RECORDS
ALTER TABLE public.payment_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View payment records" ON public.payment_records
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders o
            WHERE o.id = payment_records.order_id
            AND (o.customer_id = auth.uid() OR public.get_current_role() IN ('operator', 'takmir'))
        )
    );

CREATE POLICY "Operator updates payment on pickup" ON public.payment_records
    FOR UPDATE USING (public.get_current_role() = 'operator');

-- F. OPERATIONAL COSTS
ALTER TABLE public.operational_costs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Operator and Takmir view operational costs" ON public.operational_costs
    FOR SELECT USING (public.get_current_role() IN ('operator', 'takmir'));

CREATE POLICY "Operator records operational costs" ON public.operational_costs
    FOR INSERT WITH CHECK (public.get_current_role() IN ('operator', 'takmir'));

-- G. DONATION TRANSACTIONS & DISTRIBUTIONS
ALTER TABLE public.donation_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donation_distributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donation_distribution_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public views verified distributions" ON public.donation_distributions
    FOR SELECT USING (status = 'verified' OR public.get_current_role() = 'takmir');

CREATE POLICY "Takmir manages distributions" ON public.donation_distributions
    FOR ALL USING (public.get_current_role() = 'takmir');

CREATE POLICY "Takmir manages distribution items" ON public.donation_distribution_items
    FOR ALL USING (public.get_current_role() = 'takmir');

CREATE POLICY "Takmir views donation pool" ON public.donation_transactions
    FOR SELECT USING (public.get_current_role() = 'takmir');

-- H. FINANCIAL REPORTS
ALTER TABLE public.financial_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Operator and Takmir view reports" ON public.financial_reports
    FOR SELECT USING (public.get_current_role() IN ('operator', 'takmir'));

CREATE POLICY "Operator submits draft report" ON public.financial_reports
    FOR INSERT WITH CHECK (public.get_current_role() = 'operator');

CREATE POLICY "Takmir verifies or rejects reports" ON public.financial_reports
    FOR UPDATE USING (public.get_current_role() = 'takmir');
