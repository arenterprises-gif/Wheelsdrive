import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Home from '@/pages/Home'
import CarDetail from '@/pages/CarDetail'
import SellCar from '@/pages/SellCar'
import ValuationResult from '@/pages/ValuationResult'
import AdminLogin from '@/pages/admin/Login'
import AdminLayout from '@/pages/admin/Layout'
import AdminDashboard from '@/pages/admin/Dashboard'
import AdminCars from '@/pages/admin/Cars'
import AddEditCar from '@/pages/admin/AddEditCar'
import AdminInquiries from '@/pages/admin/Inquiries'
import AdminSettings from '@/pages/admin/Settings'
import AdminValuations from '@/pages/admin/Valuations'
import ValuationDetail from '@/pages/admin/ValuationDetail'

const qc = new QueryClient({
  defaultOptions: { queries: { staleTime:1000*60*2, gcTime:1000*60*10, retry:1 } }
})

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/car/:id" element={<CarDetail/>}/>
          <Route path="/sell" element={<SellCar/>}/>
          <Route path="/sell/result/:id" element={<ValuationResult/>}/>
          <Route path="/admin/login" element={<AdminLogin/>}/>
          <Route path="/admin" element={<AdminLayout/>}>
            <Route index element={<Navigate to="/admin/dashboard" replace/>}/>
            <Route path="dashboard" element={<AdminDashboard/>}/>
            <Route path="cars" element={<AdminCars/>}/>
            <Route path="cars/add" element={<AddEditCar/>}/>
            <Route path="cars/edit/:id" element={<AddEditCar/>}/>
            <Route path="inquiries" element={<AdminInquiries/>}/>
            <Route path="valuations" element={<AdminValuations/>}/>
            <Route path="valuations/:id" element={<ValuationDetail/>}/>
            <Route path="settings" element={<AdminSettings/>}/>
          </Route>
          <Route path="*" element={
            <div style={{ background:'#F8F9FC',minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:16 }}>
              <div style={{ fontSize:64 }}>🚗</div>
              <div style={{ fontFamily:'Nunito,sans-serif',fontWeight:800,fontSize:28,color:'#1A1A2E' }}>Page Not Found</div>
              <a href="/" style={{ color:'#0052CC',fontSize:15 }}>← Back to WheelsDrive</a>
            </div>
          }/>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
