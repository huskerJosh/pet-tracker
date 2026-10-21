import { useState, type FormEvent } from 'react';
import { SEXES, SPECIES, type Pet, type PetInput } from '../api/types';
import { cap } from '../util';

const EMPTY: PetInput = {
  name: '', species: 'dog', breed: '', dateOfBirth: null, sex: 'unknown', weightKg: null, ownerName: '', notes: '',
};

interface Props {
  initial?: Pet;
  onSubmit: (v: PetInput) => void;
  onCancel: () => void;
  pending?: boolean;
  error?: string | null;
}

export default function PetForm({ initial, onSubmit, onCancel, pending, error }: Props) {
  const [v, setV] = useState<PetInput>(() => {
    if (!initial) return EMPTY;
    const { name, species, breed, dateOfBirth, sex, weightKg, ownerName, notes } = initial;
    return {
      name, species, breed: breed ?? '', dateOfBirth: dateOfBirth ?? null, sex,
      weightKg: weightKg ?? null, ownerName: ownerName ?? '', notes: notes ?? '',
    };
  });
  const set = <K extends keyof PetInput>(k: K, val: PetInput[K]) => setV((p) => ({ ...p, [k]: val }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({ ...v, name: v.name.trim(), ownerName: v.ownerName.trim() });
  };

  return (
    <form onSubmit={submit} className="form">
      <label>Name
        <input required maxLength={100} value={v.name} onChange={(e) => set('name', e.target.value)} />
      </label>
      <label>Owner
        <input required maxLength={100} value={v.ownerName} onChange={(e) => set('ownerName', e.target.value)} />
      </label>
      <div className="row">
        <label>Species
          <select value={v.species} onChange={(e) => set('species', e.target.value as PetInput['species'])}>
            {SPECIES.map((s) => <option key={s} value={s}>{cap(s)}</option>)}
          </select>
        </label>
        <label>Sex
          <select value={v.sex} onChange={(e) => set('sex', e.target.value as PetInput['sex'])}>
            {SEXES.map((s) => <option key={s} value={s}>{cap(s)}</option>)}
          </select>
        </label>
      </div>
      <label>Breed
        <input maxLength={100} value={v.breed} onChange={(e) => set('breed', e.target.value)} />
      </label>
      <div className="row">
        <label>Date of birth
          <input type="date" value={v.dateOfBirth ?? ''} onChange={(e) => set('dateOfBirth', e.target.value || null)} />
        </label>
        <label>Weight (kg)
          <input type="number" min="0" step="0.01" value={v.weightKg ?? ''}
            onChange={(e) => set('weightKg', e.target.value === '' ? null : Number(e.target.value))} />
        </label>
      </div>
      <label>Notes
        <textarea rows={3} maxLength={2000} value={v.notes} onChange={(e) => set('notes', e.target.value)} />
      </label>
      {error && <p className="error" role="alert">{error}</p>}
      <div className="actions">
        <button type="button" className="btn" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn primary" disabled={pending}>{initial ? 'Save' : 'Add pet'}</button>
      </div>
    </form>
  );
}
