import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/Dashboard';
import BooksManagement from './pages/BooksManagement';
import OrdersManagement from './pages/OrdersManagement';
import EventsManagement from './pages/EventsManagement';
import ArticlesManagement from './pages/ArticlesManagement';
import UsersManagement from './pages/UsersManagement';
import SubmissionsManagement from './pages/SubmissionsManagement';

function App() {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/books" element={<BooksManagement />} />
        <Route path="/orders" element={<OrdersManagement />} />
        <Route path="/events" element={<EventsManagement />} />
        <Route path="/articles" element={<ArticlesManagement />} />
        <Route path="/users" element={<UsersManagement />} />
        <Route path="/submissions" element={<SubmissionsManagement />} />
      </Routes>
    </AdminLayout>
  );
}

export default App;