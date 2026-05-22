import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Home from '@/pages/Home'
import CarDetail from '@/pages/CarDetail'
import AdminLogin from '@/pages/admin/Login'
import AdminLayout from '@/pages/admin/Layout'
import AdminDashboard from '@/pages/admin/Dashboard'
import AdminCars from '@/pages/admin/Cars'
import AddEditCar from '@/pages/admin/AddEditCar'
import AdminInquiries from '@/pages/admin/Inquiries'
import AdminSettings from '@/pages/admin/Settings'

const qc = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,   // 2 min
      gcTime: 1000 * 60 * 10,      // 10 min
      retry: 1,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/car/:id" element={<CarDetail />} />

          {/* Admin auth */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin protected */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="cars" element={<AdminCars />} />
            <Route path="cars/add" element={<AddEditCar />} />
            <Route path="cars/edit/:id" element={<AddEditCar />} />
            <Route path="inquiries" element={<AdminInquiries />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={
            <div style={{ background: '#0a0a18', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
              <div style={{ fontSize: 64 }}>🚗</div>
              <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 28, color: '#fff' }}>Page Not Found</div>
              <a href="/" style={{ color: '#dc2626', fontSize: 15 }}>← Back to WheelsDrive</a>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
