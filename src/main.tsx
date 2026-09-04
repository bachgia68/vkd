import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import ErrorBoundary from './components/ErrorBoundary.tsx'

// AdminApp và MaiStudio kéo theo recharts/qrcode/exceljs/jspdf/html2canvas —
// trước đây import tĩnh nên MỌI khách vãng lai vào trang chủ đều tải luôn
// toàn bộ các thư viện này dù không bao giờ vào /gate-vkd-control-2026 hay
// /mai-studio (bundle chính >1.7MB một phần vì lý do này). Lazy-load để
// khách công khai chỉ tải code của App.tsx.
const AdminApp = lazy(() => import('./admin/AdminApp.tsx'))
const MaiStudio = lazy(() => import('./components/mai/MaiStudio.tsx'))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route
            path="/gate-vkd-control-2026/*"
            element={
              <Suspense fallback={null}>
                <AdminApp />
              </Suspense>
            }
          />
          <Route
            path="/mai-studio"
            element={
              <Suspense fallback={null}>
                <MaiStudio />
              </Suspense>
            }
          />
          <Route path="/*" element={<App />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)
