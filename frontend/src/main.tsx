import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import PaymentPage from './pages/PaymentPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <App />
      <Routes>
        <Route path="/payment" element={<PaymentPage />} />
      </Routes>
    </Router>
  </StrictMode>,
)
