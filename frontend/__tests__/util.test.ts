import { ageLabel } from '../src/util';

describe('ageLabel', () => {
  const now = new Date('2025-06-15');
  it('handles unknown dob', () => expect(ageLabel(null, now)).toBe('Age unknown'));
  it('shows months under a year', () => expect(ageLabel('2025-01-10', now)).toBe('5 mo'));
  it('shows years', () => {
    expect(ageLabel('2024-06-01', now)).toBe('1 yr');
    expect(ageLabel('2020-06-20', now)).toBe('4 yrs');
  });
  it('handles future dob', () => expect(ageLabel('2026-01-01', now)).toBe('Not yet born'));
});
