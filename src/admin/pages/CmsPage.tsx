import { useEffect, useState } from 'react';
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  Info,
  Plus,
  Save,
  Trash2,
  Globe,
  ImagePlus,
  Send,
  Loader2,
  Video,
  VideoOff,
  HelpCircle,
} from 'lucide-react';
import { BANNED_KEYWORDS, MANDATORY_DISCLAIMER, ADMIN_IMAGES } from '../adminMockData';
import {
  fetchArticles,
  createArticle,
  updateArticle,
  createBlogPost,
  deleteBlogPost,
  setBlogPostPublished,
  fetchAllBlogPostsForAdmin,
  uploadBlogImage,
  fetchChannels,
  fetchPostCaptions,
  saveCaption,
  publishCaption,
  uploadCaptionVideo,
  deleteCaptionVideo,
  type CmsArticle,
  type BlogPost,
  type Channel,
  type PostCaption,
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

// Bản nháp caption theo từng nền tảng — chỉ là điểm khởi đầu, admin sửa trực
// tiếp trong ô textarea trước khi duyệt đăng.
function draftCaption(platform: Channel['platform_type'], post: { title: string; excerpt: string }): string {
  const link = 'tasamngoclinh.com/bai-viet';
  switch (platform) {
    case 'tiktok':
      return `${post.title}\n\n${post.excerpt}\n\n#samngoclinh #TA #khoahocsam`;
    case 'facebook':
      return `${post.title}\n\n${post.excerpt}\n\nĐọc đầy đủ tại: ${link}`;
    case 'zalo':
      return `${post.title}\n\n${post.excerpt}\n\nXem tại: ${link}`;
    case 'instagram':
      return `${post.title}\n\n${post.excerpt}\n\n#samngoclinh #TA`;
    case 'youtube':
      return `${post.title}\n\n${post.excerpt}`;
    case 'linkedin':
      return `${post.title}\n\n${post.excerpt}\n\n${link}`;
    default:
      return `${post.title}\n\n${post.excerpt}`;
  }
}

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

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newExcerpt, setNewExcerpt] = useState('');
  const [newBody, setNewBody] = useState('');
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [newImagePreview, setNewImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [channels, setChannels] = useState<Channel[]>([]);
  const [captionPostId, setCaptionPostId] = useState<string | null>(null);
  const [captionDrafts, setCaptionDrafts] = useState<Record<string, string>>({});
  const [existingCaptions, setExistingCaptions] = useState<Record<string, PostCaption>>({});
  const [captionBusy, setCaptionBusy] = useState<string | null>(null);
  const [selectedChannelIds, setSelectedChannelIds] = useState<Set<string>>(new Set());

  const loadPosts = () => {
    fetchAllBlogPostsForAdmin()
      .then(setPosts)
      .catch((e) => showToast(e instanceof Error ? e.message : 'Lỗi tải bài viết SEO'));
  };

  const togglePostPublished = async (post: BlogPost) => {
    try {
      await setBlogPostPublished(post.id, !post.published);
      showToast(!post.published ? 'Đã công khai bài viết' : 'Đã gỡ khỏi site (chuyển về nháp)');
      loadPosts();
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Lỗi đổi trạng thái công khai');
    }
  };

  const loadChannels = async (): Promise<Channel[]> => {
    try {
      const rows = (await fetchChannels()).filter((c) => c.is_active);
      setChannels(rows);
      return rows;
    } catch {
      setChannels([]);
      return [];
    }
  };

  const onPickImage = (file: File | null) => {
    setNewImageFile(file);
    if (newImagePreview) URL.revokeObjectURL(newImagePreview);
    setNewImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const publishPost = async () => {
    if (!newTitle.trim() || !newBody.trim()) return;
    try {
      let featured_image_url: string | null = null;
      if (newImageFile) {
        setUploadingImage(true);
        featured_image_url = await uploadBlogImage(newImageFile);
        setUploadingImage(false);
      }
      const created = await createBlogPost({
        title: newTitle.trim(),
        excerpt: newExcerpt.trim() || newBody.trim().slice(0, 140),
        body: newBody.trim(),
        featured_image_url,
        featured_image_alt: newTitle.trim(),
      });
      setNewTitle('');
      setNewExcerpt('');
      setNewBody('');
      onPickImage(null);
      loadPosts();
      openCaptions(created);
    } catch (e) {
      setUploadingImage(false);
      showToast(e instanceof Error ? e.message : 'Lỗi đăng bài viết');
    }
  };

  const deletePost = async (id: string) => {
    try {
      await deleteBlogPost(id);
      if (captionPostId === id) setCaptionPostId(null);
      loadPosts();
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Lỗi xoá bài viết');
    }
  };

  const openCaptions = async (post: BlogPost) => {
    setCaptionPostId(post.id);
    setSelectedChannelIds(new Set());
    try {
      const activeChannels = channels.length > 0 ? channels : await loadChannels();
      const rows = await fetchPostCaptions(post.id);
      const byChannel: Record<string, PostCaption> = {};
      const drafts: Record<string, string> = {};
      rows.forEach((r) => {
        byChannel[r.channel_id] = r;
        drafts[r.channel_id] = r.caption_text;
      });
      activeChannels.forEach((c) => {
        if (!(c.id in drafts)) drafts[c.id] = draftCaption(c.platform_type, post);
      });
      setExistingCaptions(byChannel);
      setCaptionDrafts(drafts);
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Lỗi tải caption');
    }
  };

  const approveAndPublish = async (post: BlogPost, channel: Channel) => {
    const text = captionDrafts[channel.id] ?? draftCaption(channel.platform_type, post);
    const existingVideo = existingCaptions[channel.id]?.video_url ?? null;
    setCaptionBusy(channel.id);
    try {
      const saved = await saveCaption(post.id, channel.id, text);
      await publishCaption(saved, channel.webhook_url, {
        action: 'publish',
        post_id: post.id,
        title: post.title,
        // "content" / "image_url" — tên field mà workflow n8n phía TA đang đọc
        // (payload.body.content / payload.body.image_url); "caption" và
        // "featured_image_url" giữ lại song song để không phá các webhook cũ
        // đang đọc theo tên field trước đó.
        content: text,
        caption: text,
        excerpt: post.excerpt,
        image_url: post.featured_image_url,
        featured_image_url: post.featured_image_url,
        video_url: existingVideo,
        channel: channel.platform_type,
        channels: [channel.platform_type],
        channel_url: channel.channel_url,
      });
      setExistingCaptions((prev) => ({ ...prev, [channel.id]: { ...saved, video_url: existingVideo, is_published: true } }));
      showToast(
        channel.webhook_url
          ? `Đã duyệt & gửi webhook kênh ${PLATFORM_LABELS[channel.platform_type]}`
          : `Đã duyệt caption kênh ${PLATFORM_LABELS[channel.platform_type]} — chưa gắn webhook, tự copy để đăng thủ công`
      );
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Lỗi duyệt caption');
    } finally {
      setCaptionBusy(null);
    }
  };

  const approveAndPublishSelected = async (post: BlogPost) => {
    const targets = channels.filter((c) => selectedChannelIds.has(c.id));
    for (const c of targets) {
      await approveAndPublish(post, c);
    }
    showToast(`Đã duyệt & đăng ${targets.length} kênh đã chọn`);
  };

  const toggleChannelSelected = (channelId: string) => {
    setSelectedChannelIds((prev) => {
      const next = new Set(prev);
      if (next.has(channelId)) next.delete(channelId);
      else next.add(channelId);
      return next;
    });
  };

  const uploadVideoForChannel = async (channel: Channel, file: File) => {
    const existing = existingCaptions[channel.id];
    const captionId = existing?.id ?? (await saveCaption(captionPostId as string, channel.id, captionDrafts[channel.id] ?? '')).id;
    setCaptionBusy(channel.id);
    try {
      const url = await uploadCaptionVideo(captionId, file);
      setExistingCaptions((prev) => ({
        ...prev,
        [channel.id]: { ...(prev[channel.id] ?? existing), id: captionId, video_url: url } as PostCaption,
      }));
      showToast(`Đã tải video lên cho kênh ${PLATFORM_LABELS[channel.platform_type]}`);
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Lỗi tải video lên');
    } finally {
      setCaptionBusy(null);
    }
  };

  const removeVideoForChannel = async (channel: Channel) => {
    const existing = existingCaptions[channel.id];
    if (!existing) return;
    setCaptionBusy(channel.id);
    try {
      await deleteCaptionVideo(existing);
      setExistingCaptions((prev) => ({ ...prev, [channel.id]: { ...prev[channel.id], video_url: null } }));
      showToast('Đã xoá video khỏi kho lưu trữ (đã đăng xong, không cần giữ bản sao)');
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Lỗi xoá video');
    } finally {
      setCaptionBusy(null);
    }
  };

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
  useEffect(loadPosts, []);
  useEffect(() => {
    loadChannels();
  }, []);

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
      <div className="flex flex-wrap gap-2 text-xs">
        <a
          href="#blog-seo-section"
          className="px-3 py-1.5 rounded-full bg-gold-400/15 text-gold-700 font-medium hover:bg-gold-400/25"
        >
          📝 Đăng bài SEO + Caption đa kênh
        </a>
        <a
          href="#medical-review-section"
          className="px-3 py-1.5 rounded-full bg-forest-100 text-forest-700 font-medium hover:bg-forest-200"
        >
          🩺 Duyệt bài y khoa
        </a>
      </div>

      <div id="medical-review-section" className="relative rounded-2xl overflow-hidden h-36 scroll-mt-6">
        <img src={ADMIN_IMAGES.cmsHero} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-forest-950/60" />
        <div className="relative h-full flex flex-col justify-center px-8">
          <p className="text-xs uppercase tracking-widest text-gold-300">Nội dung / CMS Y khoa</p>
          <h1 className="font-display text-2xl text-cream-50 mt-1">Duyệt bài viết chuẩn y khoa</h1>
          <p className="text-xs text-cream-200/80 mt-1">
            Luồng duyệt nội bộ 3 giai đoạn — không có caption đa kênh. Muốn đăng bài SEO + tạo caption 6 kênh, xem mục
            "📝 Đăng bài SEO + Caption đa kênh" bên trên.
          </p>
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

      {/* Blog SEO công khai — hiện thẳng lên trang chủ, không qua quy trình duyệt y khoa */}
      <div id="blog-seo-section" className="bg-white rounded-2xl border border-forest-100 p-6 shadow-elegant scroll-mt-6">
        <div className="flex items-center gap-2 mb-1">
          <Globe className="w-4 h-4 text-gold-600" />
          <h3 className="font-display text-lg text-forest-900">Bài viết SEO công khai (hiển thị ngay trên trang chủ)</h3>
        </div>
        <p className="text-xs text-forest-500 mb-5">
          Khác với mục duyệt y khoa — bài viết ở đây xuất bản ngay lập tức lên mục "Bài Viết Từ TA" trên trang chủ
          khách hàng. <strong>Bấm vào 1 bài trong danh sách bên phải để mở caption 6 kênh (Facebook/TikTok/YouTube/
          Zalo/Instagram/LinkedIn) và duyệt đăng riêng từng kênh.</strong>
        </p>

        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-6">
          <div className="space-y-3">
            <div>
              <label className="text-[11px] uppercase tracking-wide text-forest-400">Tiêu đề</label>
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full border border-forest-100 rounded-lg px-3 py-2 text-sm mt-1"
                placeholder="Tiêu đề bài viết"
              />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-wide text-forest-400">Tóm tắt ngắn (tuỳ chọn)</label>
              <input
                value={newExcerpt}
                onChange={(e) => setNewExcerpt(e.target.value)}
                className="w-full border border-forest-100 rounded-lg px-3 py-2 text-sm mt-1"
                placeholder="Hiện trên thẻ bài viết ở trang chủ"
              />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-wide text-forest-400">Nội dung</label>
              <textarea
                value={newBody}
                onChange={(e) => setNewBody(e.target.value)}
                className="w-full min-h-28 border border-forest-100 rounded-lg px-3 py-2 text-sm mt-1"
                placeholder="Nội dung đầy đủ bài viết..."
              />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-wide text-forest-400">Ảnh nổi bật</label>
              <label className="mt-1 flex items-center gap-3 border border-dashed border-forest-200 rounded-lg px-3 py-2.5 text-sm text-forest-500 cursor-pointer hover:border-gold-400 hover:text-forest-700">
                <ImagePlus className="w-4 h-4 flex-shrink-0" />
                {newImageFile ? newImageFile.name : 'Chọn ảnh (jpg/png) — hiện trên thẻ bài viết & trang chủ'}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => onPickImage(e.target.files?.[0] ?? null)}
                />
              </label>
              {newImagePreview && (
                <img src={newImagePreview} alt="Xem trước ảnh" className="mt-2 w-full h-32 object-cover rounded-lg" />
              )}
            </div>
            <button onClick={publishPost} disabled={uploadingImage} className="btn-gold text-xs disabled:opacity-50">
              {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              {uploadingImage ? 'Đang tải ảnh lên...' : 'Đăng bài lên trang chủ'}
            </button>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {posts.length === 0 ? (
              <p className="text-sm text-forest-400">Chưa có bài viết SEO nào được đăng.</p>
            ) : (
              posts.map((p) => (
                <button
                  key={p.id}
                  onClick={() => openCaptions(p)}
                  className={`w-full flex items-center justify-between gap-3 rounded-xl p-3.5 text-left transition-colors ${
                    captionPostId === p.id ? 'bg-gold-50 border border-gold-300' : 'bg-cream-50 border border-transparent hover:border-forest-100'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {p.featured_image_url ? (
                      <img src={p.featured_image_url} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-forest-100 flex-shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-forest-900 truncate">{p.title}</p>
                      <p className="text-xs text-forest-500 mt-0.5">{new Date(p.created_at).toLocaleDateString('vi-VN')}</p>
                      {!p.published && (
                        <span className="inline-block mt-1 text-[10px] uppercase tracking-wide font-medium text-gold-700 bg-gold-100 px-1.5 py-0.5 rounded">
                          Nháp — chưa công khai
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePostPublished(p);
                      }}
                      aria-label={p.published ? 'Gỡ khỏi site' : 'Duyệt & công khai'}
                      title={p.published ? 'Đang công khai — bấm để gỡ' : 'Duyệt & công khai lên site'}
                      className={p.published ? 'text-forest-400 hover:text-forest-700' : 'text-gold-600 hover:text-gold-800'}
                    >
                      {p.published ? <Globe className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                    </span>
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation();
                        deletePost(p.id);
                      }}
                      aria-label="Xoá bài viết"
                      className="text-forest-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {captionPostId && (
          <CaptionPanel
            post={posts.find((p) => p.id === captionPostId) ?? null}
            channels={channels}
            drafts={captionDrafts}
            existing={existingCaptions}
            busy={captionBusy}
            selected={selectedChannelIds}
            onChangeDraft={(channelId, text) => setCaptionDrafts((prev) => ({ ...prev, [channelId]: text }))}
            onApprove={approveAndPublish}
            onApproveSelected={approveAndPublishSelected}
            onToggleSelected={toggleChannelSelected}
            onUploadVideo={uploadVideoForChannel}
            onRemoveVideo={removeVideoForChannel}
            onClose={() => setCaptionPostId(null)}
          />
        )}
      </div>

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

function CaptionPanel({
  post,
  channels,
  drafts,
  existing,
  busy,
  selected,
  onChangeDraft,
  onApprove,
  onApproveSelected,
  onToggleSelected,
  onUploadVideo,
  onRemoveVideo,
  onClose,
}: {
  post: BlogPost | null;
  channels: Channel[];
  drafts: Record<string, string>;
  existing: Record<string, PostCaption>;
  busy: string | null;
  selected: Set<string>;
  onChangeDraft: (channelId: string, text: string) => void;
  onApprove: (post: BlogPost, channel: Channel) => void;
  onApproveSelected: (post: BlogPost) => void;
  onToggleSelected: (channelId: string) => void;
  onUploadVideo: (channel: Channel, file: File) => void;
  onRemoveVideo: (channel: Channel) => void;
  onClose: () => void;
}) {
  const [showWebhookHelp, setShowWebhookHelp] = useState(false);
  if (!post) return null;

  return (
    <div className="mt-6 pt-6 border-t border-forest-100">
      <div className="flex items-center justify-between mb-1">
        <h4 className="font-display text-base text-forest-900">
          Caption đa kênh — <span className="text-gold-600">{post.title}</span>
        </h4>
        <button onClick={onClose} className="text-xs text-forest-400 hover:text-forest-700">
          Đóng
        </button>
      </div>
      <p className="text-xs text-forest-500 mb-1">
        Sửa nội dung/ảnh/video từng kênh nếu cần, tick chọn nhiều kênh rồi bấm 1 nút để đăng đồng loạt. Chưa cấu hình
        kênh nào (kể cả nhiều fanpage/trang cá nhân cùng nền tảng) thì vào mục <strong>Kênh phân phối</strong> ở menu
        bên trên để thêm — không giới hạn số lượng.
      </p>
      <button
        onClick={() => setShowWebhookHelp((v) => !v)}
        className="flex items-center gap-1.5 text-xs text-gold-700 hover:text-gold-800 mb-4"
      >
        <HelpCircle className="w-3.5 h-3.5" /> {showWebhookHelp ? 'Ẩn hướng dẫn gắn webhook' : 'Xem hướng dẫn gắn webhook để đăng tự động'}
      </button>

      {showWebhookHelp && (
        <div className="bg-cream-200/60 border-l-2 border-gold-400 rounded-lg p-4 text-xs text-forest-700 leading-relaxed mb-4 space-y-2">
          <p>
            <strong>Webhook</strong> là 1 URL do bạn tự tạo (qua n8n, Zapier, hoặc Make.com — đều có gói miễn phí) để
            nhận dữ liệu bài viết (tiêu đề, caption, ảnh, video) từ đây rồi tự đăng lên Facebook/TikTok/YouTube/Zalo
            thật. 4 bước:
          </p>
          <ol className="list-decimal list-inside space-y-1">
            <li>
              Tạo tài khoản <strong>n8n.io</strong> (hoặc Zapier/Make) — dùng bản miễn phí là đủ để bắt đầu.
            </li>
            <li>
              Tạo workflow mới, node đầu tiên là <strong>Webhook (nhận POST request)</strong> — copy URL webhook đó.
            </li>
            <li>
              Dán URL đó vào ô <strong>Webhook URL</strong> của kênh tương ứng trong mục <strong>Kênh phân phối</strong>.
            </li>
            <li>
              Nối thêm node đăng bài của từng nền tảng (Facebook Graph API / TikTok / YouTube / Zalo OA — n8n có sẵn
              node cho Facebook, các kênh khác dùng node HTTP Request gọi API riêng của nền tảng đó) — dùng đúng field{' '}
              <code className="bg-white px-1 rounded">caption</code>, <code className="bg-white px-1 rounded">featured_image_url</code>,{' '}
              <code className="bg-white px-1 rounded">video_url</code> từ dữ liệu webhook nhận được.
            </li>
          </ol>
          <p>
            Kênh chưa gắn webhook thì nút vẫn dùng được — chỉ đánh dấu "đã duyệt" để bạn tự copy caption + tải ảnh/video
            về đăng tay.
          </p>
        </div>
      )}

      {channels.length === 0 ? (
        <p className="text-sm text-forest-400 bg-cream-50 rounded-xl p-4">
          Chưa có kênh nào đang bật. Vào <strong>Kênh phân phối</strong> để thêm Facebook/TikTok/YouTube/Zalo...
        </p>
      ) : (
        <>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-forest-500">{selected.size} kênh đã chọn</p>
            <button
              onClick={() => onApproveSelected(post)}
              disabled={selected.size === 0 || busy !== null}
              className="btn-gold text-xs disabled:opacity-40 disabled:pointer-events-none"
            >
              <Send className="w-4 h-4" /> Duyệt & Đăng {selected.size > 0 ? `${selected.size} kênh đã chọn` : 'đã chọn'}
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {channels.map((c) => {
              const cap = existing[c.id];
              const isPublished = cap?.is_published;
              const videoUrl = cap?.video_url;
              return (
                <div key={c.id} className="bg-cream-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selected.has(c.id)}
                        onChange={() => onToggleSelected(c.id)}
                        className="rounded border-forest-300"
                      />
                      <span className="text-xs uppercase tracking-wide text-gold-600 font-medium">
                        {PLATFORM_LABELS[c.platform_type]} — {c.channel_name}
                      </span>
                    </label>
                    {isPublished && (
                      <span className="flex items-center gap-1 text-[11px] text-forest-600">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Đã duyệt
                      </span>
                    )}
                  </div>
                  <textarea
                    value={drafts[c.id] ?? ''}
                    onChange={(e) => onChangeDraft(c.id, e.target.value)}
                    className="w-full min-h-28 border border-forest-100 rounded-lg p-3 text-sm bg-white focus:outline-none focus:border-gold-400"
                  />

                  <div className="mt-2">
                    {videoUrl ? (
                      <div className="flex items-center gap-2">
                        <video src={videoUrl} controls className="w-24 h-16 rounded-lg object-cover bg-black" />
                        <div className="flex flex-col gap-1">
                          <span className="text-[11px] text-forest-500">Đã gắn video</span>
                          {isPublished && (
                            <button
                              onClick={() => onRemoveVideo(c)}
                              disabled={busy === c.id}
                              className="flex items-center gap-1 text-[11px] text-forest-500 hover:text-red-600"
                            >
                              <VideoOff className="w-3.5 h-3.5" /> Xoá video (đã đăng xong, khỏi tốn dung lượng)
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <label className="flex items-center gap-2 text-xs text-forest-500 border border-dashed border-forest-200 rounded-lg px-3 py-2 cursor-pointer hover:border-gold-400 hover:text-forest-700 w-fit">
                        <Video className="w-3.5 h-3.5" /> Thêm video cho kênh này
                        <input
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) onUploadVideo(c, file);
                          }}
                        />
                      </label>
                    )}
                  </div>

                  <button
                    onClick={() => onApprove(post, c)}
                    disabled={busy === c.id}
                    className="mt-2 btn-primary text-xs disabled:opacity-50"
                  >
                    {busy === c.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {c.webhook_url ? 'Duyệt & Đăng' : 'Duyệt (chưa gắn webhook)'}
                  </button>
                </div>
              );
            })}
          </div>
        </>
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
