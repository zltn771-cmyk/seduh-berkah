# PANDUAN BACKUP & PEMULIHAN DATABASE (DISASTER RECOVERY)
## SEDUH BERKAH — Digital Coffee Ecosystem

Dokumen ini memuat prosedur pencadangan (*backup*) dan pemulihan (*restore*) database PostgreSQL Supabase untuk operasional kedai kopi Seduh Berkah.

---

### 1. Strategi Pencadangan (Backup Strategy)

| Tipe Backup | Frekuensi | Retensi | Tanggung Jawab | Media Penyimpanan |
| :--- | :--- | :--- | :--- | :--- |
| **Point-in-Time Recovery (PITR)** | Otomatis (Continuous WAL) | 7 Hari | Supabase Managed | Cloud Storage Multi-AZ |
| **Daily Logical Dump (`pg_dump`)** | Harian (00:00 WIB) | 30 Hari | Pengelola Teknis Kedai | Cloud Storage Terenkripsi / Cold Storage |
| **Pre-Deployment / Pre-Audit Snapshot** | Setiap sebelum rilis fitur baru atau tutup buku bulanan | Permanen | Takmir & Developer | Arsip Lokal Terenkripsi Takmir |

---

### 2. Prosedur Eksekusi Pencadangan Manual

Gunakan salah satu dari dua metode resmi berikut:

#### Metode A: Menggunakan Supabase CLI (Direkomendasikan)
```bash
# 1. Login ke akun Supabase
supabase login

# 2. Hubungkan ke project ID produksi
supabase link --project-ref <PROJECT_REF_ID>

# 3. Export skema dan data terpisah
# Export skema DDL & RLS Policies:
supabase db dump -f supabase_schema_backup_$(date +%Y%m%d).sql

# Export data transaksional saja (data only):
supabase db dump --data-only -f supabase_data_backup_$(date +%Y%m%d).sql
```

#### Metode B: Menggunakan PostgreSQL Direct Connection (`pg_dump`)
```bash
pg_dump \
  --format=custom \
  --no-owner \
  --no-privileges \
  --dbname="postgresql://postgres:[YOUR-DB-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres" \
  -f "seduh_berkah_backup_$(date +%Y%m%d_%H%M%S).dump"
```

---

### 3. Prosedur Pemulihan Data (*Disaster Recovery*)

Jika terjadi kerusakan data operasional atau insiden keamanan:

1. **Isolasi Sistem**:
   - Pasang banner pemeliharaan (*maintenance mode*) pada aplikasi frontend.
2. **Uji Coba Restore pada Database Staging / Pengujian**:
   - Jangan langsung memulihkan ke database produksi tanpa uji integritas di staging!
   ```bash
   # Restore skema terlebih dahulu:
   psql -h <STAGING_HOST> -U postgres -d postgres -f supabase_schema_backup.sql

   # Restore data:
   psql -h <STAGING_HOST> -U postgres -d postgres -f supabase_data_backup.sql
   ```
3. **Verifikasi Integritas Data Syariah Pasca-Restore**:
   - Pastikan total saldo dana sedekah di tabel `donation_transactions` sama dengan saldo sebelum insiden.
   - Pastikan laporan keuangan berstatus `verified_by_takmir` di tabel `financial_reports` tidak terhapus atau berubah nilainya.
   - Pastikan tabel `audit_logs` dan `nisbah_history` lengkap.
4. **Alihkan Aplikasi ke Database Pulih & Buka Kembali Operasional**.
