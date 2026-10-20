import { Link, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import PetDetail from './pages/PetDetail';

export default function App() {
  return (
    <>
      <header className="topbar">
        <Link to="/" className="brand">🐾 Pets Service</Link>
      </header>
      <main className="container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pets/:id" element={<PetDetail />} />
          <Route path="*" element={<p>Page not found. <Link to="/">Back to dashboard</Link></p>} />
        </Routes>
      </main>
    </>
  );
}
