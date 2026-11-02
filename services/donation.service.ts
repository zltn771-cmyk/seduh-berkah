import { Order, DonationDistribution, DonationEvidence } from '@/types';

export interface DonationSummary {
  totalReceived: number;
  totalDonationTransactions: number;
  totalDisbursed: number;
  balanceAvailable: number;
  pendingDistributionsCount: number;
}

export function calculateDonationSummary(
  orders: Order[],
  distributions: DonationDistribution[],
  simulatedBaseline = 600000 // Oct simulation base
): DonationSummary {
  // Only completed & paid orders count towards realized donation income!
  const completedWithDonation = orders.filter(
    (o) => o.status === 'completed' && o.paymentStatus === 'paid' && o.donationAmount > 0
  );

  const realizedFromOrders = completedWithDonation.reduce((sum, o) => sum + o.donationAmount, 0);
  const totalReceived = realizedFromOrders + simulatedBaseline;
  const totalDonationTransactions = completedWithDonation.length + 600; // 600 portions Oct baseline

  // Only disbursed/verified distributions count towards total disbursed
  const totalDisbursed = distributions
    .filter((d) => d.status === 'disbursed' || d.status === 'verified')
    .reduce((sum, d) => sum + d.totalAmount, 0);

  const balanceAvailable = Math.max(0, totalReceived - totalDisbursed);

  const pendingDistributionsCount = distributions.filter(
    (d) => d.status === 'pending' || d.evidence.some((e) => e.verificationStatus === 'pending')
  ).length;

  return {
    totalReceived,
    totalDonationTransactions,
    totalDisbursed,
    balanceAvailable,
    pendingDistributionsCount,
  };
}
