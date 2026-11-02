-- ==============================================================================
-- SEDUH BERKAH — SEED DATA (DATA SIMULASI)
-- Sesuai Dokumen Essay Bisnis Mudharabah Kopi Robusta Bengkulu di Masjid UNIB
-- ==============================================================================

-- 1. SEED 6 MENU UTAMA
INSERT INTO public.products (id, name, description, price, hpp, image_url, is_available)
VALUES
    (
        '11111111-1111-1111-1111-111111111101',
        'Kopi Hitam Robusta',
        'Seduhan tubruk atau filter klasik dari 100% biji Robusta Kepahiang Bengkulu dengan karakter tebal dan aroma cokelat pekat.',
        8000,
        2500,
        '/images/kopi-hitam.svg',
        TRUE
    ),
    (
        '11111111-1111-1111-1111-111111111102',
        'Es Kopi Susu Gula Aren',
        'Espresso Robusta Bengkulu berpadu susu segar gurih dan manis lembut gula aren murni lokal Curup. Menu favorit mahasiswa.',
        13000,
        5500,
        '/images/kopi-susu.svg',
        TRUE
    ),
    (
        '11111111-1111-1111-1111-111111111103',
        'Es Americano',
        'Double shot Robusta dingin yang bersih dan menyegarkan. Sangat pas menemani belajar dan diskusi siang hari.',
        10000,
        3100,
        '/images/es-americano.svg',
        TRUE
    ),
    (
        '11111111-1111-1111-1111-111111111104',
        'Latte Hangat',
        'Robusta espresso dipadukan dengan steamed milk lembut berbusa halus. Menghangatkan suasana sejuk seusai shalat ashar atau maghrib.',
        10000,
        4800,
        '/images/latte-hangat.svg',
        TRUE
    ),
    (
        '11111111-1111-1111-1111-111111111105',
        'Es Cokelat Signature',
        'Racikan cokelat kental berkualitas tinggi dipadukan dengan susu segar. Pilihan manis dan menenangkan bagi yang tidak minum kopi.',
        8000,
        4000,
        '/images/es-cokelat.svg',
        TRUE
    ),
    (
        '11111111-1111-1111-1111-111111111106',
        'Lemon Tea Dingin',
        'Seduhan teh melati lokal berpadu perasan sari lemon asli yang menyegarkan pikiran dan dahaga saat jeda kuliah.',
        8000,
        3500,
        '/images/lemon-tea.svg',
        TRUE
    )
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    price = EXCLUDED.price,
    hpp = EXCLUDED.hpp;

-- 2. SEED BIAYA TETAP OPERASIONAL (Rp4.060.000 / bulan simulasi)
INSERT INTO public.operational_costs (description, amount, cost_category, transaction_date, payment_status)
VALUES
    ('Alokasi Biaya Tetap Operasional Bulan Berjalan [DATA SIMULASI]', 4060000, 'fixed_cost', '2026-11-01', 'paid'),
    ('Isi ulang tabung gas pemanas air seduhan [DATA SIMULASI]', 28000, 'variable_cost', '2026-11-02', 'paid'),
    ('Bahan terbuang (1 porsi gagal seduh kalibrasi grinder) [DATA SIMULASI]', 2500, 'waste_loss', '2026-11-02', 'paid')
ON CONFLICT DO NOTHING;

-- 3. SEED LAPORAN KEUANGAN BULANAN (Skenario Essay: 50 porsi/hari x 24 hari)
INSERT INTO public.financial_reports (
    period_start,
    period_end,
    total_revenue,
    total_hpp,
    total_operational_cost,
    net_profit,
    takmir_share,
    operator_share,
    nisbah_takmir,
    nisbah_operator,
    status
)
VALUES (
    '2026-10-01',
    '2026-10-31',
    12180000, -- 1.200 porsi x Rp10.150
    5058000,  -- 1.200 porsi x Rp4.215
    4060000,  -- Biaya tetap simulasi
    3062000,  -- Laba bersih
    1837200,  -- Takmir 60%
    1224800,  -- Pengelola 40%
    60.00,
    40.00,
    'verified_by_takmir'
)
ON CONFLICT (period_start, period_end) DO NOTHING;

-- 4. SEED PROGRAM PENYALURAN SEDEKAH SIMULASI
INSERT INTO public.donation_distributions (
    distribution_date,
    recipient_name,
    description,
    total_amount,
    evidence_url,
    status
)
VALUES (
    '2026-10-31',
    'Lembaga Amil Zakat Berizin Mitra Kampus UNIB [MEKANISME RANCANGAN]',
    'Penyaluran sedekah sukarela pelanggan Seduh Berkah untuk paket beasiswa makan siang mahasiswa dhuafa kampus [DATA SIMULASI].',
    600000,
    '/documents/tanda-terima-okt2026.pdf',
    'verified'
)
ON CONFLICT DO NOTHING;
