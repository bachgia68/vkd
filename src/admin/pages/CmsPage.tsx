import { useEffect, useState } from 'react';
import { Search, CheckCircle2, AlertTriangle, Info, Plus, Save } from 'lucide-react';
import { BANNED_KEYWORDS, MANDATORY_DISCLAIMER, ADMIN_IMAGES } from '../adminMockData';
import { fetchArticles, createArticle, updateArticle, type CmsArticle } from '../adminApi';

const STAGE_LABELS = ['Bản nháp', 'Chờ Hội đồng Y khoa', 'Đã xuất bản'];

function highlightBanned(text: string) {
  let result: (string | { hit: string })[] = [text];
  BANNED_KEYWORDS.forEach((kw) => {
    result = result.flatMap((chunk) => {
      if (typeof chunk !== 'string') return [chunk];
      const split = chunk.split(kw);
      const out: (string | { hit: string })[] = [];
      split.forEach((s, i) => {
        out.push(s);
        if (i < split.length - 1) out.push({ hit: kw });
      });
      return out;
    });
  });
  return result;
}

export default function CmsPage() {
  const [articles, setArticles] = useState<CmsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draftBody, setDraftBody] = useState('');
  const [scan, setScan] = useState<{ clean: boolean; hits: string[]; text: string } | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    fetchArticles()
      .then((rows) => {
        setArticles(rows);
        setSelectedId((cur) => cur ?? rows[0]?.id ?? null);
        setLoadError(null);
      })
      .catch((e) => setLoadError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const selected = articles.find((a) => a.id === selectedId) ?? null;

  useEffect(() => {
    setDraftBody(selected?.body ?? '');
    setScan(null);
  }, [selected?.id]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  };

  const runScan = () => {
    const hits = BANNED_KEYWORDS.filter((k) => draftBody.includes(k));
    setScan({ clean: hits.length === 0, hits, text: draftBody });
  };

  const saveDraft = async () => {
    if (!selected) return;
    try {
      await updateArticle(selected.id, { body: draftBody });
      showToast('Đã lưu bản nháp');
      load();
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Lỗi lưu bài viết');
    }
  };

  const advance = async () => {
    if (!selected || selected.stage >= 2) return;
    try {
      await updateArticle(selected.id, { body: draftBody, stage: (selected.stage + 1) as 0 | 1 | 2 });
      load();
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Lỗi cập nhật giai đoạn');
    }
  };

  if (loading) return <p className="text-sm text-forest-500">Đang tải bài viết…</p>;
  if (loadError) return <p className="text-sm text-red-600">Lỗi tải dữ liệu: {loadError}</p>;

  return (
    <div className="space-y-6">
      <div className="relative rounded-2xl overflow-hidden h-36">
        <img src={ADMIN_IMAGES.cmsHero} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-forest-950/60" />
        <div className="relative h-full flex flex-col justify-center px-8">
          <p className="text-xs uppercase tracking-widest text-gold-300">Nội dung / CMS Y khoa</p>
          <h1 className="font-display text-2xl text-cream-50 mt-1">Duyệt bài viết chuẩn y khoa</h1>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <p className="text-sm text-forest-500">{articles.length} bài viết</p>
        <button onClick={() => setShowNewModal(true)} className="btn-primary text-xs">
          <Plus className="w-4 h-4" /> Bài viết mới
        </button>
      </div>

      {articles.length === 0 ? (
        <p className="text-sm text-forest-400 bg-white rounded-2xl border border-forest-100 p-6">
          Chưa có bài viết nào. Bấm &ldquo;Bài viết mới&rdquo; để bắt đầu.
        </p>
      ) : (
        <div className="grid lg:grid-cols-[1fr_1.6fr] gap-6 items-start">
          <div className="space-y-3">
            {articles.map((a) => (
              <button
                key={a.id}
                onClick={() => setSelectedId(a.id)}
                className={`w-full text-left p-4 rounded-xl border bg-white transition-colors ${
                  a.id === selectedId ? 'border-gold-400 shadow-elegant' : 'border-forest-100 hover:border-forest-200'
                }`}
              >
                <p className="font-medium text-sm text-forest-900">{a.title}</p>
                <div className="flex items-center gap-1.5 mt-3">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full ${
                        i < a.stage ? 'bg-forest-600' : i === a.stage ? 'bg-gold-400' : 'bg-forest-100'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-[10px] text-forest-400 mt-1.5">
                  <span>Nháp</span>
                  <span>Hội đồng Y khoa</span>
                  <span>Xuất bản</span>
                </div>
              </button>
            ))}
          </div>

          {selected && (
            <div className="bg-white rounded-2xl border border-forest-100 p-6 shadow-elegant">
              <h3 className="font-display text-lg text-forest-900">{selected.title}</h3>
              <p className="text-xs uppercase tracking-wide text-gold-600 mt-1">
                Giai đoạn hiện tại: {STAGE_LABELS[selected.stage]}
              </p>

              <textarea
                value={draftBody}
                onChange={(e) => {
                  setDraftBody(e.target.value);
                  setScan(null);
                }}
                className="w-full min-h-40 mt-4 border border-forest-100 rounded-xl p-4 text-sm leading-relaxed focus:outline-none focus:border-gold-400"
              />

              <div className="flex gap-3 mt-4 flex-wrap">
                <button onClick={runScan} className="btn-primary text-xs">
                  <Search className="w-4 h-4" /> Quét từ khoá cấm quảng cáo
                </button>
                <button onClick={saveDraft} className="text-xs px-4 py-2.5 rounded-xl border border-forest-100 text-forest-700 flex items-center gap-2 hover:bg-forest-50">
                  <Save className="w-4 h-4" /> Lưu nháp
                </button>
                {selected.stage < 2 && scan?.clean && (
                  <button onClick={advance} className="btn-gold text-xs">
                    Chuyển sang: {STAGE_LABELS[selected.stage + 1]}
                  </button>
                )}
              </div>

              {scan && (
                <div className="mt-4 space-y-3">
                  {scan.clean ? (
                    <>
                      <div className="flex items-start gap-2.5 bg-forest-50 text-forest-700 rounded-xl p-4 text-sm">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        Không phát hiện từ khoá quảng cáo bị cấm. Nội dung đạt chuẩn để trình Hội đồng Y khoa.
                      </div>
                      <div className="flex items-start gap-2.5 bg-cream-200/60 border-l-2 border-gold-400 rounded-lg p-3 text-xs text-forest-600 italic">
                        <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-gold-500" />
                        Đã tự động chèn khuyến cáo bắt buộc: &ldquo;{MANDATORY_DISCLAIMER}&rdquo;
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-start gap-2.5 bg-red-50 text-red-700 rounded-xl p-4 text-sm">
                        <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        Phát hiện {scan.hits.length} từ khoá vi phạm quy định quảng cáo TPCN của Bộ Y tế.
                      </div>
                      <p className="text-sm leading-relaxed text-forest-700">
                        {highlightBanned(scan.text).map((chunk, i) =>
                          typeof chunk === 'string' ? (
                            <span key={i}>{chunk}</span>
                          ) : (
                            <mark key={i} className="bg-red-100 text-red-700 font-semibold px-0.5 rounded">
                              {chunk.hit}
                            </mark>
                          )
                        )}
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {showNewModal && (
        <NewArticleModal
          onClose={() => setShowNewModal(false)}
          onCreate={async (title) => {
            try {
              const a = await createArticle(title);
              setShowNewModal(false);
              setSelectedId(a.id);
              load();
            } catch (e) {
              showToast(e instanceof Error ? e.message : 'Lỗi tạo bài viết');
            }
          }}
        />
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-forest-950 text-cream-50 px-5 py-3 rounded-xl text-sm shadow-elegant-lg z-50 border border-gold-400/30">
          {toast}
        </div>
      )}
    </div>
  );
}

function NewArticleModal({ onClose, onCreate }: { onClose: () => void; onCreate: (title: string) => void }) {
  const [title, setTitle] = useState('');
  return (
    <div className="fixed inset-0 bg-forest-950/50 z-50 flex items-center justify-center p-5" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <h3 className="font-display text-lg text-forest-900 mb-4">Bài viết mới</h3>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Tiêu đề bài viết"
          className="w-full border border-forest-100 rounded-lg px-3 py-2.5 text-sm"
        />
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-forest-100 text-sm text-forest-700">
            Huỷ
          </button>
          <button
            disabled={!title.trim()}
            onClick={() => onCreate(title.trim())}
            className="btn-gold text-xs disabled:opacity-40 disabled:pointer-events-none"
          >
            Tạo bài viết
          </button>
        </div>
      </div>
    </div>
  );
}
