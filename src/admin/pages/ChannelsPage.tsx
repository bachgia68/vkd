import { useEffect, useState } from 'react';
import { Plus, Trash2, Save, Share2, Power } from 'lucide-react';
import {
  fetchChannels,
  createChannel,
  updateChannel,
  deleteChannel,
  type Channel,
} from '../adminApi';

const PLATFORM_LABELS: Record<Channel['platform_type'], string> = {
  facebook: 'Facebook',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  zalo: 'Zalo OA',
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  other: 'Khác',
};

export default function ChannelsPage() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [drafts, setDrafts] = useState<Record<string, Partial<Channel>>>({});

  const load = () => {
    setLoading(true);
    fetchChannels()
      .then(setChannels)
      .catch((e) => showToast(e instanceof Error ? e.message : 'Lỗi tải danh sách kênh'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  };

  const patchDraft = (id: string, patch: Partial<Channel>) => {
    setDrafts((d) => ({ ...d, [id]: { ...d[id], ...patch } }));
  };

  const draftFor = (c: Channel): Channel => ({ ...c, ...drafts[c.id] });

  const save = async (c: Channel) => {
    const d = drafts[c.id];
    if (!d) return;
    try {
      await updateChannel(c.id, {
        channel_name: d.channel_name,
        channel_url: d.channel_url,
        webhook_url: d.webhook_url,
        is_active: d.is_active,
        notes: d.notes,
      });
      setDrafts((prev) => {
        const next = { ...prev };
        delete next[c.id];
        return next;
      });
      showToast('Đã lưu kênh');
      load();
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Lỗi lưu kênh');
    }
  };

  const remove = async (id: string) => {
    try {
      await deleteChannel(id);
      load();
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Lỗi xoá kênh');
    }
  };

  if (loading) return <p className="text-sm text-forest-500">Đang tải danh sách kênh…</p>;

  return (
    <div className="space-y-6">
      <div className="relative rounded-2xl overflow-hidden h-36 bg-forest-950">
        <div className="relative h-full flex flex-col justify-center px-8">
          <p className="text-xs uppercase tracking-widest text-gold-300">Đa kênh</p>
          <h1 className="font-display text-2xl text-cream-50 mt-1">Quản lý kênh phân phối</h1>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <p className="text-sm text-forest-500">
          {channels.length} kênh — Fanpage, TikTok, YouTube, Zalo OA, Instagram, LinkedIn... không giới hạn số lượng.
        </p>
        <button onClick={() => setShowNew(true)} className="btn-primary text-xs">
          <Plus className="w-4 h-4" /> Thêm kênh mới
        </button>
      </div>

      <div className="bg-cream-200/60 border-l-2 border-gold-400 rounded-lg p-4 text-xs text-forest-600 leading-relaxed">
        <strong>Webhook URL</strong> (tuỳ chọn): nếu điền, khi bấm "Duyệt & Đăng" ở trang CMS, hệ thống sẽ gọi URL này
        (ví dụ webhook n8n/Zapier/Make bạn tự cấu hình) kèm nội dung caption + ảnh để tự động đăng lên kênh đó. Nếu để
        trống, nút "Duyệt" chỉ đánh dấu đã duyệt — bạn tự copy caption sang đăng thủ công.
      </div>

      <div className="grid gap-4">
        {channels.map((c) => {
          const d = draftFor(c);
          const dirty = Boolean(drafts[c.id]);
          return (
            <div key={c.id} className="bg-white rounded-2xl border border-forest-100 p-5 shadow-elegant">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-forest-100 flex items-center justify-center flex-shrink-0">
                    <Share2 className="w-5 h-5 text-forest-700" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wide text-gold-600">
                      {PLATFORM_LABELS[c.platform_type]}
                    </span>
                    <input
                      value={d.channel_name}
                      onChange={(e) => patchDraft(c.id, { channel_name: e.target.value })}
                      className="block font-display text-base text-forest-900 border-b border-transparent hover:border-forest-200 focus:border-gold-400 focus:outline-none"
                    />
                  </div>
                </div>
                <button
                  onClick={() => patchDraft(c.id, { is_active: !d.is_active })}
                  className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border ${
                    d.is_active
                      ? 'border-forest-200 text-forest-700 bg-forest-50'
                      : 'border-forest-100 text-forest-400'
                  }`}
                >
                  <Power className="w-3.5 h-3.5" /> {d.is_active ? 'Đang bật' : 'Đã tắt'}
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-3 mt-4">
                <div>
                  <label className="text-[11px] uppercase tracking-wide text-forest-400">Link kênh</label>
                  <input
                    value={d.channel_url ?? ''}
                    onChange={(e) => patchDraft(c.id, { channel_url: e.target.value })}
                    placeholder="https://facebook.com/..."
                    className="w-full border border-forest-100 rounded-lg px-3 py-2 text-sm mt-1"
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wide text-forest-400">Webhook URL (tuỳ chọn)</label>
                  <input
                    value={d.webhook_url ?? ''}
                    onChange={(e) => patchDraft(c.id, { webhook_url: e.target.value })}
                    placeholder="https://hook.n8n.example.com/..."
                    className="w-full border border-forest-100 rounded-lg px-3 py-2 text-sm mt-1"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => remove(c.id)}
                  className="flex items-center gap-1.5 text-xs text-forest-400 hover:text-red-600"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Xoá kênh
                </button>
                {dirty && (
                  <button onClick={() => save(c)} className="btn-gold text-xs">
                    <Save className="w-4 h-4" /> Lưu thay đổi
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showNew && (
        <NewChannelModal
          onClose={() => setShowNew(false)}
          onCreate={async (input) => {
            try {
              await createChannel(input);
              setShowNew(false);
              load();
            } catch (e) {
              showToast(e instanceof Error ? e.message : 'Lỗi tạo kênh');
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

function NewChannelModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (input: {
    channel_name: string;
    platform_type: Channel['platform_type'];
    channel_url?: string;
    webhook_url?: string;
  }) => void;
}) {
  const [name, setName] = useState('');
  const [platform, setPlatform] = useState<Channel['platform_type']>('facebook');
  const [url, setUrl] = useState('');

  return (
    <div className="fixed inset-0 bg-forest-950/50 z-50 flex items-center justify-center p-5" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <h3 className="font-display text-lg text-forest-900 mb-4">Thêm kênh mới</h3>
        <div className="space-y-3">
          <div>
            <label className="text-[11px] uppercase tracking-wide text-forest-400">Tên kênh</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Facebook Fanpage 2"
              className="w-full border border-forest-100 rounded-lg px-3 py-2.5 text-sm mt-1"
            />
          </div>
          <div>
            <label className="text-[11px] uppercase tracking-wide text-forest-400">Nền tảng</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as Channel['platform_type'])}
              className="w-full border border-forest-100 rounded-lg px-3 py-2.5 text-sm mt-1"
            >
              {Object.entries(PLATFORM_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[11px] uppercase tracking-wide text-forest-400">Link kênh (tuỳ chọn)</label>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className="w-full border border-forest-100 rounded-lg px-3 py-2.5 text-sm mt-1"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-forest-100 text-sm text-forest-700">
            Huỷ
          </button>
          <button
            disabled={!name.trim()}
            onClick={() => onCreate({ channel_name: name.trim(), platform_type: platform, channel_url: url.trim() || undefined })}
            className="btn-gold text-xs disabled:opacity-40 disabled:pointer-events-none"
          >
            Tạo kênh
          </button>
        </div>
      </div>
    </div>
  );
}
