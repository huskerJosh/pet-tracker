export function ageLabel(dob: string | null, now = new Date()): string {
  if (!dob) return 'Age unknown';
  const d = new Date(dob);
  let months = (now.getFullYear() - d.getFullYear()) * 12 + now.getMonth() - d.getMonth();
  if (now.getDate() < d.getDate()) months--;
  if (months < 0) return 'Not yet born';
  if (months < 12) return `${months} mo`;
  const y = Math.floor(months / 12);
  return `${y} yr${y === 1 ? '' : 's'}`;
}

export const STATUS_LABEL = { overdue: 'Overdue', upToDate: 'Up to date', noRecords: 'No records' } as const;
export const INSURANCE_LABEL = { active: 'Active', expired: 'Expired', none: 'None' } as const;

export type PolicyState = 'active' | 'upcoming' | 'expired';
export function policyState(effective: string, expiration: string, today = new Date().toISOString().slice(0, 10)): PolicyState {
  if (expiration < today) return 'expired';
  if (effective > today) return 'upcoming';
  return 'active';
}

export const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
