import { useEffect, useState } from 'react';
import { ShieldCheck, ShieldAlert, Leaf, CalendarDays, MapPin, FlaskConical, ArrowRight } from 'lucide-react';
import type { Language } from '../i18n/translations';
import { fetchBatchByQr, logScanEvent, type PublicBatch } from '../lib/traceabilityApi';

interface Props {
  lang: Language;
  qrHash: string;
  onNavigate: (page: string) => void;
}

const QC_LABEL: Record<string, string> = {
  pending: 'Đang chờ kiểm định',
  passed: 'Đạt kiểm định chất lượng',
  failed: 'Không đạt kiểm định',
};

export default function BatchTraceabilityLookup({ lang, qrHash, onNavigate }: Props) {
  const isVi = lang === 'vi';
  const [batch, setBatch] = useState<PublicBatch | null | undefined>(undefined);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    fetchBatchByQr(qrHash)
      .then((b) => {
        if (cancelled) return;
        setBatch(b);
        if (b) logScanEvent(b.id).catch(() => {});
      })
      .catch((e) => !cancelled && setError(e instanceof Error ? e.message : 'Lỗi tải dữ liệu truy xuất.'));
    return () => {
      cancelled = true;
    };
  }, [qrHash]);

  const loading = batch === undefined;

  return (
    <div className="min-h-screen bg-cream-50 pt-28 pb-16">
      <div className="container-wide max-w-2xl">
        {loading && !error && (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-forest-200 border-t-forest-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-forest-500 text-sm">{isVi ? 'Đang xác thực mã truy xuất…' : 'Verifying trace code…'}</p>
          </div>
        )}

        {error && (
          <div className="text-center py-16">
            <ShieldAlert className="w-14 h-14 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && batch === null && (
          <div className="text-center py-16 bg-white rounded-2xl border border-red-200 shadow-elegant px-6">
            <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="font-display text-2xl text-forest-900 mb-2">
              {isVi ? 'Không tìm thấy mã truy xuất này' : 'Trace code not found'}
            </h1>
            <p className="text-forest-500 text-sm mb-6">
              {isVi
                ? 'Mã QR này không khớp với bất kỳ lô hàng thật nào của VKD Group. Đây có thể là dấu hiệu sản phẩm không chính hãng — vui lòng liên hệ chúng tôi để xác minh.'
                : 'This QR code does not match any real VKD Group batch. This may indicate a counterfeit product — please contact us to verify.'}
            </p>
            <button onClick={() => onNavigate('home')} className="btn-primary text-sm">
              {isVi ? 'Về trang chủ' : 'Back to home'} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {!loading && !error && batch && (
          <div className="bg-white rounded-2xl border border-forest-100 shadow-elegant-lg overflow-hidden">
            <div className="bg-gradient-to-br from-forest-950 via-forest-900 to-forest-800 text-white p-8 text-center">
              <ShieldCheck className="w-14 h-14 text-gold-400 mx-auto mb-3" />
              <h1 className="font-display text-2xl">{isVi ? 'Sản phẩm chính hãng VKD Group' : 'Genuine VKD Group product'}</h1>
              <p className="text-white/60 text-xs font-mono mt-2">{batch.batch_id}</p>
            </div>

            <div className="p-6 space-y-5">
              <div className="flex items-center gap-3">
                <Leaf className="w-5 h-5 text-forest-500 flex-shrink-0" />
                <div>
                  <p className="text-xs uppercase tracking-wide text-forest-400">{isVi ? 'Sản phẩm' : 'Product'}</p>
                  <p className="text-forest-900 font-medium">{batch.product_name}</p>
                </div>
              </div>

              {batch.cultivation_region_name && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-forest-500 flex-shrink-0" />
                  <div>
                    <p className="text-xs uppercase tracking-wide text-forest-400">{isVi ? 'Vùng trồng' : 'Cultivation region'}</p>
                    <p className="text-forest-900 font-medium">
                      {batch.cultivation_region_name}
                      {batch.cultivation_province ? `, ${batch.cultivation_province}` : ''}
                    </p>
                  </div>
                </div>
              )}

              {batch.harvest_date && (
                <div className="flex items-center gap-3">
                  <CalendarDays className="w-5 h-5 text-forest-500 flex-shrink-0" />
                  <div>
                    <p className="text-xs uppercase tracking-wide text-forest-400">{isVi ? 'Ngày thu hoạch' : 'Harvest date'}</p>
                    <p className="text-forest-900 font-medium">{new Date(batch.harvest_date).toLocaleDateString('vi-VN')}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <FlaskConical className="w-5 h-5 text-forest-500 flex-shrink-0" />
                <div>
                  <p className="text-xs uppercase tracking-wide text-forest-400">{isVi ? 'Kiểm định chất lượng' : 'QC status'}</p>
                  <p className={`font-medium ${batch.qc_status === 'passed' ? 'text-forest-700' : 'text-gold-700'}`}>
                    {QC_LABEL[batch.qc_status] ?? batch.qc_status}
                    {batch.qc_lab ? ` · ${batch.qc_lab}` : ''}
                  </p>
                </div>
              </div>

              {batch.gacp_who_certified && (
                <div className="flex items-center gap-2 px-4 py-3 bg-gold-50 border border-gold-200 rounded-xl">
                  <ShieldCheck className="w-4 h-4 text-gold-600 flex-shrink-0" />
                  <span className="text-xs text-gold-800 font-medium">GACP-WHO {isVi ? 'đã chứng nhận' : 'certified'}</span>
                </div>
              )}

              {batch.photo_urls.length > 0 && (
                <div className="grid grid-cols-3 gap-2 pt-2">
                  {batch.photo_urls.map((url, i) => (
                    <img key={i} src={url} alt="" className="w-full h-24 object-cover rounded-lg" />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
