export type UserRole = 'customer' | 'operator' | 'takmir';

export type ProductCategory = 'kopi-robusta' | 'non-kopi' | 'teh';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  categoryLabel: string;
  price: number;
  hpp: number;
  description: string;
  isAvailable: boolean;
  image: string;
  tag?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 'pending' | 'processing' | 'ready' | 'completed' | 'cancelled' | 'confirmed' | 'preparing';
export type OrderSource = 'online' | 'walk_in' | 'online_web' | 'walk_in_pos';

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  hpp: number;
  quantity: number;
  subtotal: number;
  totalHpp: number;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. SB-20261102-0001
  customerName: string;
  customerPhone?: string;
  orderSource: OrderSource;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number; // pure coffee revenue
  totalHpp: number;
  donationAmount: number; // voluntary Rp1.000 / portion
  totalReceived: number; // subtotal + donationAmount
  paymentMethod: 'cash_on_pickup';
  paymentStatus: 'unpaid' | 'paid' | 'refunded';
  notes?: string;
  cancellationReason?: string;
  createdAt: string;
  completedAt?: string;
}

export type EvidenceStatus = 'pending' | 'verified' | 'rejected';

export interface DonationEvidence {
  id: string;
  fileName: string;
  fileUrl: string;
  verificationStatus: EvidenceStatus;
  uploadedBy: string;
  verifiedBy?: string;
  verifiedAt?: string;
  rejectionReason?: string;
  notes?: string;
}

export type DistributionStatus = 'draft' | 'allocated' | 'disbursed' | 'pending' | 'verified' | 'rejected';

export interface DonationDistributionItem {
  id: string;
  donationTransactionId: string;
  allocatedAmount: number;
}

export interface DonationDistribution {
  id: string;
  distributionCode: string;
  title: string;
  description: string;
  targetInstitution: string;
  totalAmount: number;
  status: DistributionStatus;
  distributedAt?: string;
  evidence: DonationEvidence[];
  sourceItems?: DonationDistributionItem[];
}

export type OperationalCostType = 'fixed_cost' | 'variable_cost' | 'waste_loss';

export interface OperationalCost {
  id: string;
  date: string;
  costType: OperationalCostType;
  description: string;
  amount: number;
  paymentStatus: 'paid' | 'unpaid';
  referenceOrderNumber?: string;
}

export interface MudharabahSetting {
  shahibulMaalRatio: number; // 60
  mudharibRatio: number; // 40
  effectiveFrom: string;
  changeReason: string;
}

export interface NisbahHistory {
  id: string;
  timestamp: string;
  changedBy: string;
  oldShahibulMaalRatio: number;
  oldMudharibRatio: number;
  newShahibulMaalRatio: number;
  newMudharibRatio: number;
  reason: string;
}

export type FinancialReportStatus = 'draft' | 'submitted_by_operator' | 'verified_by_takmir' | 'rejected';

export interface ProductHppBreakdown {
  name: string;
  quantity: number;
  unitHpp: number;
  totalHpp: number;
}

export interface FinancialReport {
  id: string;
  periodLabel: string;
  periodStart: string;
  periodEnd: string;
  operatingDays?: number;
  periodMonth?: number;
  periodYear?: number;

  // A. Pendapatan
  grossRevenue: number;
  totalTransactions: number;
  totalItemsSold: number;

  // B. HPP
  totalHpp: number;
  productHppBreakdown: ProductHppBreakdown[];

  // C. Biaya Operasional
  fixedCosts: number;
  variableCosts: number;
  wasteLoss: number;
  totalOperationalCost: number;

  // D. Hasil Usaha & Mudharabah
  grossProfit: number;
  netProfit: number;
  nisbahTakmir: number;
  nisbahOperator: number;
  takmirShare: number;
  operatorShare: number;
  shahibulMaalShare?: number;
  mudharibShare?: number;
  isLoss: boolean;

  // E. Status Transaksi
  completedCount: number;
  cancelledCount: number;
  pendingCount: number;

  // F. Tata Kelola & Verifikasi
  status: FinancialReportStatus;
  submittedAt?: string;
  submittedBy?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  rejectionNotes?: string;
  revisionHistory?: Array<{ revisedAt: string; note: string; author: string }>;
  totalDonationPool?: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userRole: string;
  action: string;
  details: string;
  beforeData?: any;
  afterData?: any;
}
