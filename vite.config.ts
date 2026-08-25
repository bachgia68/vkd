import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    // exceljs/jspdf/qrcode chi duoc import() dong trong CatalogExportPage — neu khong
    // liet ke o day, Vite chi pre-bundle chung khi lan dau gap trong dev, va ban ghi cache
    // co the lech voi module thuc te tren dia sau khi npm install/update, gay loi
    // "Failed to fetch dynamically imported module". Liet ke san de luon on dinh.
    include: ['exceljs', 'file-saver', 'jspdf', 'qrcode'],
  },
})
