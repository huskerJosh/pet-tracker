import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import { SPECIES } from '../api/types';
import Modal from '../components/Modal';
import PetForm from '../components/PetForm';
import { INSURANCE_LABEL, STATUS_LABEL, ageLabel, cap } from '../util';

const COLUMNS = [
  { key: 'name', label: 'Name' },
  { key: 'species', label: 'Species' },
  { key: 'breed', label: 'Breed' },
  { key: 'age', label: 'Age' },
  { key: 'ownerName', label: 'Owner' },
  { key: 'recordCount', label: 'Records' },
  { key: 'lastVisit', label: 'Last visit' },
  { key: 'nextDue', label: 'Next due' },
  { key: 'status', label: 'Status' },
  { key: 'insurance', label: 'Insurance' },
] as const;

export default function Dashboard() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [adding, setAdding] = useState(false);

  const search = params.get('search') ?? '';
  const species = params.get('species') ?? '';
  const status = params.get('status') ?? '';
  const insurance = params.get('insurance') ?? '';
  const sortKey = params.get('sort') ?? 'name';
  const order = params.get('order') ?? 'asc';
  const page = Number(params.get('page') ?? 1) || 1;

  const update = (patch: Record<string, string>) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    if (!('page' in patch)) next.delete('page');
    setParams(next, { replace: true });
  };

  // Clicking the active column flips direction; a new column starts ascending.
  const toggleSort = (key: string) =>
    update(key === sortKey ? { order: order === 'asc' ? 'desc' : 'asc' } : { sort: key, order: 'asc' });

  // Debounced search box; local state keeps typing responsive.
  const [text, setText] = useState(search);
  useEffect(() => {
    if (text === search) return;
    const t = setTimeout(() => update({ search: text }), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  const query = useQuery({
    queryKey: ['dashboard', { search, species, status, insurance, sortKey, order, page }],
    queryFn: () => api.dashboard({ search, species, status, insurance, sort: sortKey, order, page }),
    placeholderData: keepPreviousData,
  });

  const create = useMutation({
    mutationFn: api.createPet,
    onSuccess: (pet) => {
      qc.invalidateQueries({ queryKey: ['dashboard'] });
      navigate(`/pets/${pet.id}`);
    },
  });

  const data = query.data;
  const pages = data ? Math.max(1, Math.ceil(data.total / data.limit)) : 1;
  const filtered = !!(search || species || status || insurance);

  return (
    <>
      <div className="toolbar">
        <h1>Dashboard</h1>
        <button className="btn primary" onClick={() => setAdding(true)}>+ Add pet</button>
      </div>

      <div className="filters">
        <input type="search" placeholder="Search name, breed or owner…" aria-label="Search pets"
          value={text} onChange={(e) => setText(e.target.value)} />
        <select aria-label="Species" value={species} onChange={(e) => update({ species: e.target.value })}>
          <option value="">All species</option>
          {SPECIES.map((s) => <option key={s} value={s}>{cap(s)}</option>)}
        </select>
        <select aria-label="Status" value={status} onChange={(e) => update({ status: e.target.value })}>
          <option value="">Any status</option>
          {Object.entries(STATUS_LABEL).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
        </select>
        <select aria-label="Insurance" value={insurance} onChange={(e) => update({ insurance: e.target.value })}>
          <option value="">Any insurance</option>
          {Object.entries(INSURANCE_LABEL).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
        </select>
        {filtered && (
          <button className="btn" onClick={() => { setText(''); setParams({}, { replace: true }); }}>Clear</button>
        )}
      </div>

      {query.isError && <p className="error" role="alert">Failed to load pets: {(query.error as Error).message}</p>}
      {query.isLoading && <p>Loading…</p>}

      {data && (
        <>
          <p className="muted">{data.total} pet{data.total === 1 ? '' : 's'}</p>
          {data.items.length === 0 ? (
            <p className="empty">{filtered ? 'No pets match your filters.' : 'No pets yet. Add your first pet!'}</p>
          ) : (
            <div className="table-wrap">
              <table className="pets-table">
                <thead>
                  <tr>
                    {COLUMNS.map((c) => (
                      <th key={c.key} aria-sort={sortKey === c.key ? (order === 'desc' ? 'descending' : 'ascending') : 'none'}>
                        <button className="sort-btn" onClick={() => toggleSort(c.key)}>
                          {c.label}
                          <span aria-hidden="true">{sortKey === c.key ? (order === 'desc' ? ' ▼' : ' ▲') : ''}</span>
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((p) => (
                    <tr key={p.id} onClick={() => navigate(`/pets/${p.id}`)}>
                      <td><Link to={`/pets/${p.id}`} onClick={(e) => e.stopPropagation()}>{p.name}</Link></td>
                      <td>{cap(p.species)}</td>
                      <td>{p.breed || '—'}</td>
                      <td>{ageLabel(p.dateOfBirth)}</td>
                      <td>{p.ownerName}</td>
                      <td>{p.recordCount}</td>
                      <td>{p.lastVisit ?? '—'}</td>
                      <td>{p.nextDue ?? '—'}</td>
                      <td><span className={`badge ${p.status}`}>{STATUS_LABEL[p.status]}</span></td>
                      <td>
                        <span className={`badge ins-${p.insuranceStatus}`} title={p.insuranceExpires ? `Expires ${p.insuranceExpires}` : undefined}>
                          {INSURANCE_LABEL[p.insuranceStatus]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {pages > 1 && (
            <div className="pager">
              <button className="btn" disabled={page <= 1} onClick={() => update({ page: String(page - 1) })}>Prev</button>
              <span>Page {page} of {pages}</span>
              <button className="btn" disabled={page >= pages} onClick={() => update({ page: String(page + 1) })}>Next</button>
            </div>
          )}
        </>
      )}

      {adding && (
        <Modal title="Add pet" onClose={() => setAdding(false)}>
          <PetForm onCancel={() => setAdding(false)} onSubmit={(v) => create.mutate(v)}
            pending={create.isPending} error={create.error?.message} />
        </Modal>
      )}
    </>
  );
}
