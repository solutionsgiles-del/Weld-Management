import { Welder, WelderQualification, WPS } from '../types';

export type ExpiryStatus = 'active' | 'expiring_soon' | 'expired';

export interface QualificationStatusResult {
  status: ExpiryStatus;
  daysRemaining: number;
  label: string;
}

/**
 * Calculates whether a qualification is active, expiring within 30 days, or expired.
 */
export function getQualificationStatus(expiryDateStr: string): QualificationStatusResult {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const expiry = new Date(expiryDateStr);
  expiry.setHours(0, 0, 0, 0);

  const diffTime = expiry.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      status: 'expired',
      daysRemaining: diffDays,
      label: `Expired ${Math.abs(diffDays)}d ago`,
    };
  }

  if (diffDays <= 30) {
    return {
      status: 'expiring_soon',
      daysRemaining: diffDays,
      label: diffDays === 0 ? 'Expires today' : `Expires in ${diffDays}d`,
    };
  }

  return {
    status: 'active',
    daysRemaining: diffDays,
    label: `Valid (${diffDays}d left)`,
  };
}

/**
 * Checks if a welder has a valid, unexpired qualification for a given WPS.
 */
export function isWelderQualifiedForWps(
  welder: Welder,
  wps: WPS
): { isQualified: boolean; reason?: string; matchingQual?: WelderQualification } {
  // 1. Find qualification matching process
  const matchingQual = welder.qualifications.find((q) => q.process === wps.process);

  if (!matchingQual) {
    return {
      isQualified: false,
      reason: `Welder has no qualification record for ${wps.process} process`,
    };
  }

  // 2. Check expiry status
  const statusResult = getQualificationStatus(matchingQual.currentExpiryDate);
  if (statusResult.status === 'expired') {
    return {
      isQualified: false,
      reason: `Qualification for ${wps.process} expired on ${matchingQual.currentExpiryDate} (Prolongation required)`,
      matchingQual,
    };
  }

  return {
    isQualified: true,
    matchingQual,
  };
}

/**
 * Filters the list of WPS that a specific welder is eligible to select
 * from among the WPS already assigned to a Work Card.
 */
export function getEligibleWpsForWelderOnWorkCard(
  welder: Welder,
  assignedWpsList: WPS[]
): {
  eligibleWps: WPS[];
  ineligibleWps: { wps: WPS; reason: string }[];
} {
  const eligibleWps: WPS[] = [];
  const ineligibleWps: { wps: WPS; reason: string }[] = [];

  for (const wps of assignedWpsList) {
    const check = isWelderQualifiedForWps(welder, wps);
    if (check.isQualified) {
      eligibleWps.push(wps);
    } else {
      ineligibleWps.push({
        wps,
        reason: check.reason || 'Not qualified',
      });
    }
  }

  return { eligibleWps, ineligibleWps };
}

/**
 * Gets all qualifications across all welders that are expiring within 30 days or expired.
 */
export function getProlongationAlerts(welders: Welder[]): {
  expiringSoon: { welder: Welder; qual: WelderQualification; status: QualificationStatusResult }[];
  expired: { welder: Welder; qual: WelderQualification; status: QualificationStatusResult }[];
  totalAlerts: number;
} {
  const expiringSoon: { welder: Welder; qual: WelderQualification; status: QualificationStatusResult }[] = [];
  const expired: { welder: Welder; qual: WelderQualification; status: QualificationStatusResult }[] = [];

  for (const welder of welders) {
    for (const qual of welder.qualifications) {
      const status = getQualificationStatus(qual.currentExpiryDate);
      if (status.status === 'expiring_soon') {
        expiringSoon.push({ welder, qual, status });
      } else if (status.status === 'expired') {
        expired.push({ welder, qual, status });
      }
    }
  }

  return {
    expiringSoon,
    expired,
    totalAlerts: expiringSoon.length + expired.length,
  };
}

/**
 * Computes next expiry date based on interval from a baseline date.
 */
export function calculateNextExpiryDate(baseDateStr: string, interval: '6_MONTHS' | 'ANNUAL'): string {
  const date = new Date(baseDateStr);
  if (interval === '6_MONTHS') {
    date.setMonth(date.getMonth() + 6);
  } else {
    date.setFullYear(date.getFullYear() + 1);
  }
  return date.toISOString().split('T')[0];
}
