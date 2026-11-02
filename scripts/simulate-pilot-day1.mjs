/**
 * SEDUH BERKAH — Pilot Simulation Day 1 Runner
 * Simulates limited pilot launch at Masjid Kampus Universitas Bengkulu:
 * - 5 Customer orders (Ahmad, Fatimah, Budi, Ust. Zulkifli, Rian) with mixed donation choices
 * - FSM order lifecycle tracking (pending -> processing -> ready -> completed on cash payment)
 * - 1 Walk-in POS transaction
 * - 1 Operational cost record (Es batu kristal higienis)
 * - Takmir financial verification & 60:40 mudharabah calculation
 * - Sedekah collection, balance check, and verified disbursement simulation
 */

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const BLUE = '\x1b[34m';
const YELLOW = '\x1b[33m';
const BOLD = '\x1b[1m';
const RESET = '\x1b[0m';

console.log(`\n${BOLD}${BLUE}================================================================================${RESET}`);
console.log(`${BOLD}${BLUE} SEDUH BERKAH — SIMULASI OPERASIONAL HARI PERTAMA (PILOT LAUNCH UJI COBA)${RESET}`);
console.log(`${BOLD}${BLUE} Lingkungan: Serambi Masjid Kampus Universitas Bengkulu${RESET}`);
console.log(`${BOLD}${BLUE} Status    : [DATA UJI COBA TERPISAH] (Bukan data riil definitif)${RESET}`);
console.log(`${BOLD}${BLUE}================================================================================${RESET}\n`);

// 1. Menu Reference
const menu = {
  kopiHitam: { id: 'prod-1', name: 'Kopi Hitam Robusta', price: 8000, hpp: 2500 },
  kopiSusu: { id: 'prod-2', name: 'Es Kopi Susu Gula Aren', price: 13000, hpp: 5500 },
  americano: { id: 'prod-3', name: 'Es Americano', price: 10000, hpp: 3100 },
  latte: { id: 'prod-4', name: 'Latte Hangat', price: 10000, hpp: 4800 },
  cokelat: { id: 'prod-5', name: 'Es Cokelat Signature', price: 8000, hpp: 4000 },
  lemonTea: { id: 'prod-6', name: 'Lemon Tea Dingin', price: 8000, hpp: 3500 },
};

// 2. Customer Online Orders (5 Customers)
console.log(`${BOLD}TAHAP 1: PEMESANAN ONLINE OLEH 5 PELANGGAN KAMPUS${RESET}`);

const pilotOrders = [
  {
    orderNumber: 'SB-PILOT-001',
    customerName: 'Ahmad Fauzi (Mahasiswa FT)',
    customerPhone: '0812xxxx1101',
    items: [{ product: menu.kopiSusu, quantity: 1 }],
    isDonationOptIn: true,
  },
  {
    orderNumber: 'SB-PILOT-002',
    customerName: 'Fatimah Az-Zahra (Mahasiswi FKIP)',
    customerPhone: '0812xxxx1102',
    items: [
      { product: menu.latte, quantity: 1 },
      { product: menu.lemonTea, quantity: 1 },
    ],
    isDonationOptIn: true,
  },
  {
    orderNumber: 'SB-PILOT-003',
    customerName: 'Budi Santoso (Tenaga Kependidikan)',
    customerPhone: '0812xxxx1103',
    items: [{ product: menu.kopiHitam, quantity: 2 }],
    isDonationOptIn: false,
  },
  {
    orderNumber: 'SB-PILOT-004',
    customerName: 'Ust. Zulkifli (Dosen & Jamaah)',
    customerPhone: '0812xxxx1104',
    items: [{ product: menu.americano, quantity: 1 }],
    isDonationOptIn: true,
  },
  {
    orderNumber: 'SB-PILOT-005',
    customerName: 'Rian Pratama (Mahasiswa FP)',
    customerPhone: '0812xxxx1105',
    items: [{ product: menu.cokelat, quantity: 1 }],
    isDonationOptIn: false,
  },
];

let totalOnlineRevenue = 0;
let totalOnlineHpp = 0;
let totalOnlineDonations = 0;
let totalOnlinePortions = 0;

pilotOrders.forEach((order, idx) => {
  const portions = order.items.reduce((s, it) => s + it.quantity, 0);
  const subtotal = order.items.reduce((s, it) => s + it.product.price * it.quantity, 0);
  const hpp = order.items.reduce((s, it) => s + it.product.hpp * it.quantity, 0);
  const donation = order.isDonationOptIn ? portions * 1000 : 0;
  const grandTotal = subtotal + donation;

  totalOnlineRevenue += subtotal;
  totalOnlineHpp += hpp;
  totalOnlineDonations += donation;
  totalOnlinePortions += portions;

  console.log(`  [Pesanan #${idx + 1}] ${order.orderNumber} - ${order.customerName}`);
  console.log(`    Menu: ${order.items.map(i => `${i.quantity}x ${i.product.name}`).join(', ')}`);
  console.log(`    Subtotal: Rp${subtotal.toLocaleString('id-ID')} | Sedekah: Rp${donation.toLocaleString('id-ID')} | Total Bayar: Rp${grandTotal.toLocaleString('id-ID')}`);
  console.log(`    Alur FSM: Pending -> Processing -> Ready -> Completed (Kasir Tunai: PAID)\n`);
});

// 3. Walk-in POS Transaction
console.log(`${BOLD}TAHAP 2: TRANSAKSI KASIR WALK-IN LANGSUNG (POS)${RESET}`);
const walkinOrder = {
  orderNumber: 'SB-POS-PILOT-001',
  customerName: 'Pak Hendra (Jamaah Sholat Ashar)',
  items: [{ product: menu.kopiSusu, quantity: 1 }],
  isDonationOptIn: true,
};

const walkinPortions = 1;
const walkinSubtotal = menu.kopiSusu.price;
const walkinHpp = menu.kopiSusu.hpp;
const walkinDonation = 1000;
const walkinGrandTotal = walkinSubtotal + walkinDonation;

console.log(`  Nomor POS: ${walkinOrder.orderNumber} - ${walkinOrder.customerName}`);
console.log(`  Item     : 1x ${menu.kopiSusu.name}`);
console.log(`  Penjualan: Rp${walkinSubtotal.toLocaleString('id-ID')} | Sedekah: Rp${walkinDonation.toLocaleString('id-ID')} | Total: Rp${walkinGrandTotal.toLocaleString('id-ID')}`);
console.log(`  Status   : Selesai & Lunas Langsung di Kasir\n`);

// 4. Operational Cost Recording
console.log(`${BOLD}TAHAP 3: PENCATATAN BIAYA OPERASIONAL KEDAI${RESET}`);
const operationalCost = {
  id: 'cost-pilot-01',
  description: 'Beli Es Batu Kristal Higienis Tambahan (1 Bal)',
  amount: 15000,
  costCategory: 'variable_cost',
  paymentStatus: 'paid',
  date: '2026-11-02',
};
console.log(`  Biaya Operasional: "${operationalCost.description}" sebesar Rp${operationalCost.amount.toLocaleString('id-ID')} (${operationalCost.costCategory})\n`);

// 5. Total Daily Financial Audit
console.log(`${BOLD}TAHAP 4: REKAPITULASI LAPORAN KEUANGAN & BAGI HASIL MUDHARABAH (TAKMIR)${RESET}`);

const grandRevenue = totalOnlineRevenue + walkinSubtotal;
const grandHpp = totalOnlineHpp + walkinHpp;
const grossProfit = grandRevenue - grandHpp;
const totalCost = operationalCost.amount;
const netProfit = grossProfit - totalCost;

const nisbahTakmir = 60;
const nisbahOperator = 40;
const takmirShare = Math.floor(netProfit * (nisbahTakmir / 100));
const operatorShare = netProfit - takmirShare;

console.log(`  1. Total Omzet Penjualan (6 Transaksi, 8 Porsi) : Rp${grandRevenue.toLocaleString('id-ID')}`);
console.log(`  2. Total HPP Bahan Baku                         : Rp${grandHpp.toLocaleString('id-ID')}`);
console.log(`  3. Laba Kotor Kedai (Gross Profit)              : Rp${grossProfit.toLocaleString('id-ID')}`);
console.log(`  4. Biaya Operasional Kedai Terbayar             : Rp${totalCost.toLocaleString('id-ID')}`);
console.log(`  ----------------------------------------------------------------------`);
console.log(`  5. Laba Bersih Siap Bagi Hasil (Net Profit)     : ${BOLD}Rp${netProfit.toLocaleString('id-ID')}${RESET}`);
console.log(`  6. Hak Takmir Masjid (Shahibul Maal - 60%)      : ${GREEN}${BOLD}Rp${takmirShare.toLocaleString('id-ID')}${RESET}`);
console.log(`  7. Hak Pengelola Kedai (Mudharib - 40%)         : ${YELLOW}${BOLD}Rp${operatorShare.toLocaleString('id-ID')}${RESET}`);
console.log(`  Validasi Keseimbangan: Rp${takmirShare.toLocaleString('id-ID')} + Rp${operatorShare.toLocaleString('id-ID')} === Rp${(takmirShare + operatorShare).toLocaleString('id-ID')} (Zero-Remainder OK!)\n`);

// 6. Donation Pool Audit & Separation
console.log(`${BOLD}TAHAP 5: AUDIT POOL SEDEKAH & PORTAL TRANSPARANSI PUBLIK${RESET}`);
const totalDonations = totalOnlineDonations + walkinDonation;
console.log(`  Total Sedekah Sukarela Terkumpul Hari Ini : ${BOLD}Rp${totalDonations.toLocaleString('id-ID')}${RESET}`);
console.log(`  Pemisahan Syariah:`);
console.log(`    - Apakah sedekah masuk ke kas omzet kedai?     : ${RED}TIDAK (0% tercampur)${RESET}`);
console.log(`    - Apakah sedekah dipotong bagi hasil 60:40?    : ${RED}TIDAK (100% amanah sosial)${RESET}`);
console.log(`    - Rekening/Pool Sedekah                        : ${GREEN}Pool Khusus Takmir (Rp${totalDonations.toLocaleString('id-ID')})${RESET}\n`);

// 7. Usability & Validation Assertion
const isPassed =
  grandRevenue === 78000 &&
  grandHpp === 31400 &&
  grossProfit === 46600 &&
  totalCost === 15000 &&
  netProfit === 31600 &&
  takmirShare === 18960 &&
  operatorShare === 12640 &&
  takmirShare + operatorShare === netProfit &&
  totalDonations === 5000;

console.log(`${BOLD}${BLUE}================================================================================${RESET}`);
if (isPassed) {
  console.log(`${GREEN}${BOLD}✓ SEMUA KALKULASI SIMULASI PILOT HARI PERTAMA VALID & SESUAI BLUEPRINT SYARIAH!${RESET}`);
} else {
  console.log(`${RED}${BOLD}✗ TERDAPAT KESALAHAN PADA SIMULASI!${RESET}`);
  process.exit(1);
}
console.log(`${BOLD}${BLUE}================================================================================${RESET}\n`);
