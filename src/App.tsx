import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/Toast';
import { ScrollToTop } from './components/ScrollToTop';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

// Pages
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Services } from './pages/Services';
import { HowItWorks } from './pages/HowItWorks';
import { Contact } from './pages/Contact';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { UserDashboard } from './pages/UserDashboard';
import { CADashboard } from './pages/CADashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { InvoicePage } from './pages/InvoicePage';
import { ProfilePage } from './pages/ProfilePage';

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Header />
          <main style={{ flex: 1 }}>
            <Routes>
              {/* Public Pages */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Secure Portals */}
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/documents" element={<UserDashboard />} />
              <Route path="/ca/dashboard" element={<CADashboard />} />
              <Route path="/ca-dashboard" element={<Navigate to="/ca/dashboard" replace />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin-dashboard" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/invoice/:id" element={<InvoicePage />} />
              <Route path="/profile" element={<ProfilePage />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </ToastProvider>
  );
};

export default App;
