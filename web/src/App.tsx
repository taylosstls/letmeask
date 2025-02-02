import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { Home } from './pages/Home';
import { NewRoom } from './pages/NewRoom';
import { Room } from './pages/Room';
import { AdminRoom } from './pages/AdminRoom';
import { NotFound } from './pages/NotFound';

import { AuthContextProvider } from './contexts/AuthContext';

export default function App() {
  return (
    <Router>
      <AuthContextProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms/new" element={<NewRoom />} />
          <Route path="/rooms/:id" element={<Room />} />
          <Route path="/admin/rooms/:id" element={<AdminRoom />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthContextProvider>
    </Router>
  );
}
