import { useState, type FormEvent } from 'react';
import type { Insurance, InsuranceInput, Subscriber } from '../api/types';

const EMPTY: InsuranceInput = {
  planName: '', idNumber: '', effectiveDate: '', expirationDate: '',
  subscriber: { firstName: '', lastName: '', dateOfBirth: '', phone: '', address: '', state: '', zipCode: '' },
};

interface Props {
  initial?: Insurance;
  onSubmit: (v: InsuranceInput) => void;
  onCancel: () => void;
  pending?: boolean;
  error?: string | null;
}

export default function InsuranceForm({ initial, onSubmit, onCancel, pending, error }: Props) {
  const [v, setV] = useState<InsuranceInput>(initial ?? EMPTY);
  const [localError, setLocalError] = useState<string | null>(null);
  const set = <K extends keyof InsuranceInput>(k: K, val: InsuranceInput[K]) => setV((p) => ({ ...p, [k]: val }));
  const setSub = <K extends keyof Subscriber>(k: K, val: string) =>
    setV((p) => ({ ...p, subscriber: { ...p.subscriber, [k]: val } }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (v.expirationDate < v.effectiveDate) {
      setLocalError('Expiration date must be on or after the effective date');
      return;
    }
    setLocalError(null);
    onSubmit(v);
  };

  const shown = localError ?? error;
  return (
    <form onSubmit={submit} className="form">
      <label>Plan name
        <input required maxLength={200} value={v.planName} onChange={(e) => set('planName', e.target.value)} />
      </label>
      <label>ID number
        <input required maxLength={100} value={v.idNumber} onChange={(e) => set('idNumber', e.target.value)} />
      </label>
      <div className="row">
        <label>Effective date
          <input required type="date" value={v.effectiveDate} onChange={(e) => set('effectiveDate', e.target.value)} />
        </label>
        <label>Expiration date
          <input required type="date" value={v.expirationDate} onChange={(e) => set('expirationDate', e.target.value)} />
        </label>
      </div>
      <fieldset>
        <legend>Subscriber</legend>
        <div className="row">
          <label>First name
            <input required maxLength={100} value={v.subscriber.firstName} onChange={(e) => setSub('firstName', e.target.value)} />
          </label>
          <label>Last name
            <input required maxLength={100} value={v.subscriber.lastName} onChange={(e) => setSub('lastName', e.target.value)} />
          </label>
        </div>
        <div className="row">
          <label>Date of birth
            <input required type="date" value={v.subscriber.dateOfBirth} onChange={(e) => setSub('dateOfBirth', e.target.value)} />
          </label>
          <label>Phone
            <input required type="tel" pattern="[0-9+()\-.\s]{7,20}" title="7–20 digits; may include + ( ) - ."
              value={v.subscriber.phone} onChange={(e) => setSub('phone', e.target.value)} />
          </label>
        </div>
        <label>Address
          <textarea required rows={2} maxLength={300} value={v.subscriber.address} onChange={(e) => setSub('address', e.target.value)} />
        </label>
        <div className="row">
          <label>State
            <input required maxLength={2} pattern="[A-Za-z]{2}" title="2-letter state code" autoComplete="address-level1"
              value={v.subscriber.state} onChange={(e) => setSub('state', e.target.value.toUpperCase())} />
          </label>
          <label>ZIP code
            <input required inputMode="numeric" pattern="\d{5}(-\d{4})?" title="5-digit ZIP or ZIP+4" autoComplete="postal-code"
              value={v.subscriber.zipCode} onChange={(e) => setSub('zipCode', e.target.value)} />
          </label>
        </div>
      </fieldset>
      {shown && <p className="error" role="alert">{shown}</p>}
      <div className="actions">
        <button type="button" className="btn" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn primary" disabled={pending}>{initial ? 'Save' : 'Add policy'}</button>
      </div>
    </form>
  );
}
