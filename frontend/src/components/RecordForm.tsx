import { useState, type FormEvent } from 'react';
import { RECORD_TYPES, type MedicalRecord, type RecordInput } from '../api/types';
import { cap } from '../util';

const today = () => new Date().toISOString().slice(0, 10);

interface Props {
  initial?: MedicalRecord;
  onSubmit: (v: RecordInput) => void;
  onCancel: () => void;
  pending?: boolean;
  error?: string | null;
}

export default function RecordForm({ initial, onSubmit, onCancel, pending, error }: Props) {
  const [v, setV] = useState<RecordInput>(
    initial ?? { type: 'checkup', title: '', date: today(), veterinarian: '', description: '', nextDueDate: null },
  );
  const set = <K extends keyof RecordInput>(k: K, val: RecordInput[K]) => setV((p) => ({ ...p, [k]: val }));
  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({ ...v, title: v.title.trim() });
  };
  return (
    <form onSubmit={submit} className="form">
      <div className="row">
        <label>Type
          <select value={v.type} onChange={(e) => set('type', e.target.value as RecordInput['type'])}>
            {RECORD_TYPES.map((t) => <option key={t} value={t}>{cap(t)}</option>)}
          </select>
        </label>
        <label>Date
          <input required type="date" value={v.date} onChange={(e) => set('date', e.target.value)} />
        </label>
      </div>
      <label>Title
        <input required maxLength={200} value={v.title} onChange={(e) => set('title', e.target.value)} />
      </label>
      <div className="row">
        <label>Veterinarian
          <input maxLength={100} value={v.veterinarian} onChange={(e) => set('veterinarian', e.target.value)} />
        </label>
        <label>Next due
          <input type="date" value={v.nextDueDate ?? ''} onChange={(e) => set('nextDueDate', e.target.value || null)} />
        </label>
      </div>
      <label>Description
        <textarea rows={3} maxLength={5000} value={v.description} onChange={(e) => set('description', e.target.value)} />
      </label>
      {error && <p className="error" role="alert">{error}</p>}
      <div className="actions">
        <button type="button" className="btn" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn primary" disabled={pending}>{initial ? 'Save' : 'Add record'}</button>
      </div>
    </form>
  );
}
