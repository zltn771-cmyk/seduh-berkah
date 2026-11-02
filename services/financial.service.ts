import { Order, OperationalCost, FinancialReport, ProductHppBreakdown, MudharabahSetting } from '@/types';

export type PeriodFilter = 'today' | 'this_week' | 'this_month' | 'this_year' | 'custom';

export interface DateRange {
  start: Date;
  end: Date;
  label: string;
}

export function getDateRange(
  period: PeriodFilter,
  customStart?: string,
  customEnd?: string,
  referenceDateStr = '2026-11-02T12:00:00'
): DateRange {
  const now = new Date(referenceDateStr);
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  let start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  let label = 'Hari Ini (2 Nov 2026)';

  if (period === 'today') {
    label = 'Hari Ini';
  } else if (period === 'this_week') {
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday
    start = new Date(now.getFullYear(), now.getMonth(), diff, 0, 0, 0, 0);
    label = 'Minggu Ini';
  } else if (period === 'this_month') {
    start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    label = `Bulan ${now.toLocaleString('id-ID', { month: 'long', year: 'numeric' })}`;
    return { start, end: lastDay, label };
  } else if (period === 'this_year') {
    start = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
    const lastDayOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
    label = `Tahun ${now.getFullYear()}`;
    return { start, end: lastDayOfYear, label };
  } else if (period === 'custom' && customStart && customEnd) {
    start = new Date(customStart + 'T00:00:00');
    const customEndDate = new Date(customEnd + 'T23:59:59');
    label = `${customStart} s/d ${customEnd}`;
    return { start, end: customEndDate, label };
  }

  return { start, end, label };
}

/**
 * Calculates financial metrics strictly from validated transactions.
 */
export function calculateFinancials(
  orders: Order[],
  costs: OperationalCost[],
  setting: MudharabahSetting,
  range: DateRange
): FinancialReport {
  // 1. Filter orders in date range
  const ordersInRange = orders.filter((o) => {
    const orderDate = new Date(o.createdAt);
    return orderDate >= range.start && orderDate <= range.end;
  });

  // Realized orders: ONLY completed and paid orders count towards revenue and HPP!
  const completedOrders = ordersInRange.filter(
    (o) => o.status === 'completed' && o.paymentStatus === 'paid'
  );

  const cancelledCount = ordersInRange.filter((o) => o.status === 'cancelled').length;
  const pendingCount = ordersInRange.filter(
    (o) => o.status !== 'completed' && o.status !== 'cancelled'
  ).length;

  // Revenue & Sold Items
  const grossRevenue = completedOrders.reduce((sum, o) => sum + o.subtotal, 0);
  const totalTransactions = completedOrders.length;

  let totalItemsSold = 0;
  let totalHpp = 0;
  const hppMap: Record<string, { quantity: number; unitHpp: number; totalHpp: number }> = {};

  completedOrders.forEach((o) => {
    o.items.forEach((item) => {
      totalItemsSold += item.quantity;
      totalHpp += item.totalHpp;

      if (!hppMap[item.productName]) {
        hppMap[item.productName] = {
          quantity: 0,
          unitHpp: item.hpp,
          totalHpp: 0,
        };
      }
      hppMap[item.productName].quantity += item.quantity;
      hppMap[item.productName].totalHpp += item.totalHpp;
    });
  });

  const productHppBreakdown: ProductHppBreakdown[] = Object.keys(hppMap).map((name) => ({
    name,
    quantity: hppMap[name].quantity,
    unitHpp: hppMap[name].unitHpp,
    totalHpp: hppMap[name].totalHpp,
  }));

  // 2. Filter costs in date range (ONLY paid costs are actual cash outflows)
  const costsInRange = costs.filter((c) => {
    const costDate = new Date(c.date + 'T00:00:00');
    return costDate >= range.start && costDate <= range.end;
  });

  const paidCosts = costsInRange.filter((c) => c.paymentStatus === 'paid');

  const fixedCosts = paidCosts
    .filter((c) => c.costType === 'fixed_cost')
    .reduce((sum, c) => sum + c.amount, 0);

  const variableCosts = paidCosts
    .filter((c) => c.costType === 'variable_cost')
    .reduce((sum, c) => sum + c.amount, 0);

  const wasteLoss = paidCosts
    .filter((c) => c.costType === 'waste_loss')
    .reduce((sum, c) => sum + c.amount, 0);

  const totalOperationalCost = fixedCosts + variableCosts + wasteLoss;

  // 3. Profit Calculations
  const grossProfit = grossRevenue - totalHpp;
  const netProfit = grossProfit - totalOperationalCost;
  const isLoss = netProfit <= 0;

  // 4. Mudharabah Profit Sharing (Zero Remainder Guarantee)
  let takmirShare = 0;
  let operatorShare = 0;

  if (!isLoss) {
    const ratioTakmir = setting.shahibulMaalRatio / 100;
    takmirShare = Math.floor(netProfit * ratioTakmir);
    operatorShare = netProfit - takmirShare; // Guarantees takmirShare + operatorShare === netProfit!
  }

  // 5. Sedekah Pool in Range
  const totalDonationPool = completedOrders.reduce((sum, o) => sum + o.donationAmount, 0);

  return {
    id: `rep-${range.start.toISOString().slice(0, 10)}_${range.end.toISOString().slice(0, 10)}`,
    periodLabel: range.label,
    periodStart: range.start.toISOString().slice(0, 10),
    periodEnd: range.end.toISOString().slice(0, 10),
    operatingDays: 24,

    grossRevenue,
    totalTransactions,
    totalItemsSold,

    totalHpp,
    productHppBreakdown,

    fixedCosts,
    variableCosts,
    wasteLoss,
    totalOperationalCost,

    grossProfit,
    netProfit,
    nisbahTakmir: setting.shahibulMaalRatio,
    nisbahOperator: setting.mudharibRatio,
    takmirShare,
    operatorShare,
    isLoss,

    completedCount: totalTransactions,
    cancelledCount,
    pendingCount,

    status: 'draft',
    totalDonationPool,
  };
}
