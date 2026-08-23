import { useState } from 'react';
import { Search, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { ARTICLES, BANNED_KEYWORDS, MANDATORY_DISCLAIMER, ADMIN_IMAGES, type Article, type ArticleStage } from '../adminMockData';

const STAGE_LABELS = ['Bản nháp', 'Chờ Hội đồng Y khoa', 'Đã xuất bản'];

function highlightBanned(text: string) {
  const parts: (string | { hit: string })[] = [text];
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
  return result.length ? result : parts;
}

export default function CmsPage() {
  const [articles, setArticles] = useState<Article[]>(ARTICLES);
  const [selectedId, setSelectedId] = useState(articles[2].id);
  const [bodies, setBodies] = useState<Record<number, string>>({});
  const [scan, setScan] = useState<{ clean: boolean; hits: string[]; text: string } | null>(null);

  const selected = articles.find((a) => a.id === selectedId)!;
  const body = bodies[selected.id] ?? selected.body;

  const runScan = () => {
    const hits = BANNED_KEYWORDS.filter((k) => body.includes(k));
    setScan({ clean: hits.length === 0, hits, text: body });
  };

  const advance = () => {
    setArticles((prev) =>
      prev.map((a) => (a.id === selected.id && a.stage < 2 ? { ...a, stage: (a.stage + 1) as ArticleStage } : a))
    );
  };

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

      <div className="grid lg:grid-cols-[1fr_1.6fr] gap-6 items-start">
        <div className="space-y-3">
          {articles.map((a) => (
            <button
              key={a.id}
              onClick={() => {
                setSelectedId(a.id);
                setScan(null);
              }}
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

        <div className="bg-white rounded-2xl border border-forest-100 p-6 shadow-elegant">
          <h3 className="font-display text-lg text-forest-900">{selected.title}</h3>
          <p className="text-xs uppercase tracking-wide text-gold-600 mt-1">
            Giai đoạn hiện tại: {STAGE_LABELS[selected.stage]}
          </p>

          <textarea
            value={body}
            onChange={(e) => {
              setBodies((prev) => ({ ...prev, [selected.id]: e.target.value }));
              setScan(null);
            }}
            className="w-full min-h-40 mt-4 border border-forest-100 rounded-xl p-4 text-sm leading-relaxed focus:outline-none focus:border-gold-400"
          />

          <div className="flex gap-3 mt-4">
            <button onClick={runScan} className="btn-primary text-xs">
              <Search className="w-4 h-4" /> Quét từ khoá cấm quảng cáo
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
      </div>
    </div>
  );
}
