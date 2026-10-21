import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import InsuranceForm from '../src/components/InsuranceForm';
import { policyState } from '../src/util';

const fill = async () => {
  const t = (l: string, v: string) => userEvent.type(screen.getByLabelText(l), v);
  await t('Plan name', 'Gold');
  await t('ID number', 'A1');
  await t('First name', 'Sam');
  await t('Last name', 'Lee');
  await t('Phone', '555-123-4567');
  await t('Address', '1 Main St');
  await t('State', 'ca');
  await t('ZIP code', '94105');
  await userEvent.type(screen.getByLabelText('Date of birth'), '1990-01-02');
};

it('blocks submit when expiration precedes effective date', async () => {
  const onSubmit = vi.fn();
  render(<InsuranceForm onSubmit={onSubmit} onCancel={() => {}} />);
  await fill();
  await userEvent.type(screen.getByLabelText('Effective date'), '2025-06-01');
  await userEvent.type(screen.getByLabelText('Expiration date'), '2025-01-01');
  await userEvent.click(screen.getByRole('button', { name: 'Add policy' }));
  expect(await screen.findByRole('alert')).toHaveTextContent(/on or after/);
  expect(onSubmit).not.toHaveBeenCalled();
});

it('submits a valid policy with nested subscriber', async () => {
  const onSubmit = vi.fn();
  render(<InsuranceForm onSubmit={onSubmit} onCancel={() => {}} />);
  await fill();
  await userEvent.type(screen.getByLabelText('Effective date'), '2025-01-01');
  await userEvent.type(screen.getByLabelText('Expiration date'), '2025-12-31');
  await userEvent.click(screen.getByRole('button', { name: 'Add policy' }));
  expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
    planName: 'Gold', subscriber: expect.objectContaining({ firstName: 'Sam', phone: '555-123-4567', state: 'CA', zipCode: '94105' }),
  }));
});

it('derives policy state from dates', () => {
  expect(policyState('2025-01-01', '2025-12-31', '2025-06-01')).toBe('active');
  expect(policyState('2025-01-01', '2025-12-31', '2026-01-01')).toBe('expired');
  expect(policyState('2025-07-01', '2025-12-31', '2025-06-01')).toBe('upcoming');
});
