import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, vi } from 'vitest';
import Dashboard from '../src/pages/Dashboard';

const pet = {
  id: '1', name: 'Biscuit', species: 'dog', breed: 'Lab', ownerName: 'Alex', dateOfBirth: null, sex: 'male',
  weightKg: null, notes: '', recordCount: 2, lastVisit: '2025-01-01', nextDue: null, status: 'overdue',
  insuranceStatus: 'active', insuranceExpires: '2026-01-01',
};

/** Stubs fetch with a GraphQL response; every call gets a fresh Response (bodies are single-use). */
function mockApi(items: unknown[]) {
  const body = { data: { dashboardPets: { items, total: items.length, page: 1, limit: 24 } } };
  const fetchMock = vi.fn(async (_url: RequestInfo | URL, _init?: RequestInit) => new Response(JSON.stringify(body), { headers: { 'Content-Type': 'application/json' } }));
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

/** Variables sent with each GraphQL request so far. */
const sent = (fetchMock: ReturnType<typeof mockApi>) =>
  fetchMock.mock.calls.map(([, init]) => JSON.parse(String((init as RequestInit).body)).variables);

afterEach(() => vi.restoreAllMocks());

function setup() {
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <MemoryRouter><Dashboard /></MemoryRouter>
    </QueryClientProvider>,
  );
}

it('renders pet rows with status badge', async () => {
  mockApi([pet]);
  setup();
  expect(await screen.findByText('Biscuit')).toBeInTheDocument();
  expect(within(screen.getByRole('row', { name: /Biscuit/ })).getByText('Overdue')).toBeInTheDocument();
});

it('posts to the GraphQL endpoint', async () => {
  const fetchMock = mockApi([pet]);
  setup();
  await screen.findByText('Biscuit');
  expect(String(fetchMock.mock.calls[0][0])).toMatch(/\/api\/graphql$/);
  expect((fetchMock.mock.calls[0][1] as RequestInit).method).toBe('POST');
});

it('sends filters as GraphQL variables', async () => {
  const fetchMock = mockApi([pet]);
  setup();
  await screen.findByText('Biscuit');
  await userEvent.selectOptions(screen.getByLabelText('Species'), 'cat');
  await waitFor(() => expect(sent(fetchMock).some((v) => v.filter?.species === 'cat')).toBe(true));
});

it('shows empty state when nothing matches', async () => {
  mockApi([]);
  setup();
  expect(await screen.findByText(/No pets yet/)).toBeInTheDocument();
});

it('shows an error returned by the API', async () => {
  vi.stubGlobal('fetch', vi.fn(async () =>
    new Response(JSON.stringify({ errors: [{ message: 'boom', extensions: { code: 'INTERNAL' } }] }), {
      headers: { 'Content-Type': 'application/json' },
    })));
  setup();
  expect(await screen.findByRole('alert')).toHaveTextContent('boom');
});

it('sorts by a column and toggles direction', async () => {
  const fetchMock = mockApi([pet]);
  setup();
  await screen.findByText('Biscuit');
  await userEvent.click(screen.getByRole('button', { name: /Status/ }));
  await waitFor(() => expect(sent(fetchMock).some((v) => v.sort === 'status' && v.order === 'asc')).toBe(true));
  await userEvent.click(screen.getByRole('button', { name: /Status/ }));
  await waitFor(() => expect(sent(fetchMock).some((v) => v.sort === 'status' && v.order === 'desc')).toBe(true));
  expect(screen.getByRole('columnheader', { name: /Status/ })).toHaveAttribute('aria-sort', 'descending');
});

it('filters by insurance and shows the insurance badge', async () => {
  const fetchMock = mockApi([pet]);
  setup();
  const row = await screen.findByRole('row', { name: /Biscuit/ });
  expect(within(row).getByText('Active')).toBeInTheDocument();
  await userEvent.selectOptions(screen.getByLabelText('Insurance'), 'expired');
  await waitFor(() => expect(sent(fetchMock).some((v) => v.filter?.insurance === 'expired')).toBe(true));
});
