import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { Home } from "./pages/Home";
import { NewRoom } from "./pages/NewRoom";

export default function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/rooms/new' element={<NewRoom />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

function NotFound() {
  return <h2>404 Not Found</h2>;
}