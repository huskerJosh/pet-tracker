import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, ApiError } from '../api/client';
import { RECORD_TYPES, type Insurance, type MedicalRecord } from '../api/types';
import Modal from '../components/Modal';
import PetForm from '../components/PetForm';
import InsuranceForm from '../components/InsuranceForm';
import RecordForm from '../components/RecordForm';
import { ageLabel, cap, policyState } from '../util';

type PolicyDialog = { kind: 'new' } | { kind: 'edit'; policy: Insurance } | null;
type RecordDialog = { kind: 'new' } | { kind: 'edit'; record: MedicalRecord } | null;

export default function PetDetail() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [editingPet, setEditingPet] = useState(false);
  const [dialog, setDialog] = useState<RecordDialog>(null);
  const [policyDialog, setPolicyDialog] = useState<PolicyDialog>(null);
  const [typeFilter, setTypeFilter] = useState('');

  const pet = useQuery({ queryKey: ['pet', id], queryFn: () => api.getPet(id) });
  const records = useQuery({ queryKey: ['records', id], queryFn: () => api.listRecords(id), enabled: pet.isSuccess });

  const policies = useQuery({ queryKey: ['insurance', id], queryFn: () => api.listInsurance(id), enabled: pet.isSuccess });
  const refreshPolicies = () => {
    qc.invalidateQueries({ queryKey: ['insurance', id] });
    qc.invalidateQueries({ queryKey: ['dashboard'] });
  };
  const savePolicy = useMutation({
    mutationFn: (v: Parameters<typeof api.createInsurance>[1]) =>
      policyDialog?.kind === 'edit' ? api.updateInsurance(policyDialog.policy.id, v) : api.createInsurance(id, v),
    onSuccess: () => { refreshPolicies(); setPolicyDialog(null); },
  });
  const deletePolicy = useMutation({ mutationFn: api.deleteInsurance, onSuccess: refreshPolicies });

  const refreshRecords = () => {
    qc.invalidateQueries({ queryKey: ['records', id] });
    qc.invalidateQueries({ queryKey: ['dashboard'] });
  };

  const updatePet = useMutation({
    mutationFn: (v: Parameters<typeof api.updatePet>[1]) => api.updatePet(id, v),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['pet', id] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
      setEditingPet(false);
    },
  });
  const deletePet = useMutation({
    mutationFn: () => api.deletePet(id),
    onSuccess: () => {
      qc.removeQueries({ queryKey: ['pet', id] });
      qc.removeQueries({ queryKey: ['records', id] });
      qc.removeQueries({ queryKey: ['insurance', id] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
      navigate('/');
    },
  });
  const saveRecord = useMutation({
    mutationFn: (v: Parameters<typeof api.createRecord>[1]) =>
      dialog?.kind === 'edit' ? api.updateRecord(dialog.record.id, v) : api.createRecord(id, v),
    onSuccess: () => { refreshRecords(); setDialog(null); },
  });
  const deleteRecord = useMutation({ mutationFn: api.deleteRecord, onSuccess: refreshRecords });

  if (pet.isLoading) return <p>Loading…</p>;
  if (pet.isError) {
    const notFound = pet.error instanceof ApiError && (pet.error.code === 'NOT_FOUND' || pet.error.code === 'BAD_USER_INPUT');
    return <p className="error">{notFound ? 'Pet not found.' : `Failed to load pet: ${pet.error.message}`} <Link to="/">Back</Link></p>;
  }
  const p = pet.data!;
  const shown = (records.data ?? []).filter((r) => !typeFilter || r.type === typeFilter);

  return (
    <>
      <Link to="/">← Dashboard</Link>
      <section className="panel">
        <div className="toolbar">
          <h1>{p.name}</h1>
          <div className="actions">
            <button className="btn" onClick={() => setEditingPet(true)}>Edit</button>
            <button className="btn danger" disabled={deletePet.isPending}
              onClick={() => window.confirm(`Delete ${p.name} and all of their records?`) && deletePet.mutate()}>
              Delete
            </button>
          </div>
        </div>
        <dl className="details">
          <div><dt>Species</dt><dd>{cap(p.species)}</dd></div>
          <div><dt>Breed</dt><dd>{p.breed || '—'}</dd></div>
          <div><dt>Sex</dt><dd>{cap(p.sex)}</dd></div>
          <div><dt>Age</dt><dd>{ageLabel(p.dateOfBirth)}{p.dateOfBirth && ` (${p.dateOfBirth})`}</dd></div>
          <div><dt>Weight</dt><dd>{p.weightKg != null ? `${p.weightKg} kg` : '—'}</dd></div>
          <div><dt>Owner</dt><dd>{p.ownerName}</dd></div>
        </dl>
        {p.notes && <p className="muted">{p.notes}</p>}
        {deletePet.isError && <p className="error" role="alert">{deletePet.error.message}</p>}
      </section>

      <section className="panel">
        <div className="toolbar">
          <h2>Medical records</h2>
          <div className="actions">
            <select aria-label="Filter by type" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="">All types</option>
              {RECORD_TYPES.map((t) => <option key={t} value={t}>{cap(t)}</option>)}
            </select>
            <button className="btn primary" onClick={() => setDialog({ kind: 'new' })}>+ Add record</button>
          </div>
        </div>
        {records.isLoading && <p>Loading…</p>}
        {records.isError && <p className="error">Failed to load records.</p>}
        {records.data && shown.length === 0 && <p className="empty">No records{typeFilter ? ' of this type' : ' yet'}.</p>}
        <ul className="records">
          {shown.map((r) => (
            <li key={r.id}>
              <div className="rec-head">
                <span className="badge type">{cap(r.type)}</span>
                <strong>{r.title}</strong>
                <span className="muted">{r.date}</span>
                <span className="spacer" />
                <button className="btn small" onClick={() => setDialog({ kind: 'edit', record: r })}>Edit</button>
                <button className="btn small danger" disabled={deleteRecord.isPending}
                  onClick={() => window.confirm(`Delete "${r.title}"?`) && deleteRecord.mutate(r.id)}>Delete</button>
              </div>
              {(r.veterinarian || r.nextDueDate) && (
                <div className="muted">
                  {r.veterinarian && `Vet: ${r.veterinarian}`}
                  {r.veterinarian && r.nextDueDate && ' · '}
                  {r.nextDueDate && `Next due: ${r.nextDueDate}`}
                </div>
              )}
              {r.description && <p>{r.description}</p>}
            </li>
          ))}
        </ul>
      </section>

      <section className="panel">
        <div className="toolbar">
          <h2>Insurance</h2>
          <button className="btn primary" onClick={() => setPolicyDialog({ kind: 'new' })}>+ Add policy</button>
        </div>
        {policies.isLoading && <p>Loading…</p>}
        {policies.isError && <p className="error">Failed to load insurance.</p>}
        {policies.data && policies.data.length === 0 && <p className="empty">No insurance policies yet.</p>}
        <ul className="records">
          {(policies.data ?? []).map((x) => {
            const state = policyState(x.effectiveDate, x.expirationDate);
            return (
              <li key={x.id}>
                <div className="rec-head">
                  <span className={`badge ${state === 'active' ? 'ins-active' : state === 'expired' ? 'ins-expired' : 'upcoming'}`}>{cap(state)}</span>
                  <strong>{x.planName}</strong>
                  <span className="muted">ID {x.idNumber}</span>
                  <span className="spacer" />
                  <button className="btn small" onClick={() => setPolicyDialog({ kind: 'edit', policy: x })}>Edit</button>
                  <button className="btn small danger" disabled={deletePolicy.isPending}
                    onClick={() => window.confirm(`Delete policy "${x.planName}"?`) && deletePolicy.mutate(x.id)}>Delete</button>
                </div>
                <div className="muted">Coverage: {x.effectiveDate} → {x.expirationDate}</div>
                <div className="muted">
                  Subscriber: {x.subscriber.firstName} {x.subscriber.lastName} (DOB {x.subscriber.dateOfBirth}) · {x.subscriber.phone}
                </div>
                <div className="muted">{x.subscriber.address}, {x.subscriber.state} {x.subscriber.zipCode}</div>
              </li>
            );
          })}
        </ul>
      </section>

      {policyDialog && (
        <Modal title={policyDialog.kind === 'edit' ? 'Edit policy' : 'Add policy'} onClose={() => setPolicyDialog(null)}>
          <InsuranceForm initial={policyDialog.kind === 'edit' ? policyDialog.policy : undefined}
            onCancel={() => setPolicyDialog(null)} onSubmit={(v) => savePolicy.mutate(v)}
            pending={savePolicy.isPending} error={savePolicy.error?.message} />
        </Modal>
      )}
      {editingPet && (
        <Modal title="Edit pet" onClose={() => setEditingPet(false)}>
          <PetForm initial={p} onCancel={() => setEditingPet(false)} onSubmit={(v) => updatePet.mutate(v)}
            pending={updatePet.isPending} error={updatePet.error?.message} />
        </Modal>
      )}
      {dialog && (
        <Modal title={dialog.kind === 'edit' ? 'Edit record' : 'Add record'} onClose={() => setDialog(null)}>
          <RecordForm initial={dialog.kind === 'edit' ? dialog.record : undefined} onCancel={() => setDialog(null)}
            onSubmit={(v) => saveRecord.mutate(v)} pending={saveRecord.isPending} error={saveRecord.error?.message} />
        </Modal>
      )}
    </>
  );
}
