# Ox Phase 10 Tasks 4-6: API Functions + PageBuilder UI + Image Resize

**Context**: TA site homepage CMS. Ox sẽ làm 3 tasks (có thể song song hoặc tuần tự).

**Repo**: D:\TA page\site\ta_production\project (npm run dev để test)

**Prerequisite**: Task 1-3 (Qwen) phải XONG TRƯỚC, đặc biệt Task 3 (Supabase page_sections table).

---

## Task 4: API Functions (siteContentApi + adminApi)

**Purpose**: Tạo functions để fetch + update page_sections từ Supabase.

**Files**:

### File 1: `src/lib/siteContentApi.ts` (ADD at end)

```typescript
// Public-facing API for fetching page sections

export interface PageSection {
  id: string;
  page_key: string;
  block_type: string;
  sort_order: number;
  title_vi: string;
  content_vi: string;
  image_url: string | null;
  cta_text: string | null;
  cta_url: string | null;
  visible: boolean;
  created_at: string;
  updated_at: string;
}

export async function fetchPageSections(pageKey: string): Promise<PageSection[]> {
  const { data, error } = await supabase
    .from('page_sections')
    .select('*')
    .eq('page_key', pageKey)
    .eq('visible', true)
    .order('sort_order');
  if (error) throw new Error(error.message);
  return data ?? [];
}
```

### File 2: `src/admin/adminApi.ts` (ADD 4 functions at end)

```typescript
import { PageSection } from '../lib/siteContentApi';

// Admin functions for managing page sections

export async function fetchPageSectionsForAdmin(pageKey: string): Promise<PageSection[]> {
  const { data, error } = await supabase
    .from('page_sections')
    .select('*')
    .eq('page_key', pageKey)
    .order('sort_order');
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function updatePageSection(
  id: string,
  updates: Partial<PageSection>
): Promise<void> {
  const { error } = await supabase
    .from('page_sections')
    .update(updates)
    .eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deletePageSection(id: string): Promise<void> {
  const { error } = await supabase
    .from('page_sections')
    .delete()
    .eq('id', id);
  if (error) throw new Error(error.message);
}

export async function reorderPageSections(
  sections: { id: string; sort_order: number }[]
): Promise<void> {
  for (const section of sections) {
    const { error } = await supabase
      .from('page_sections')
      .update({ sort_order: section.sort_order })
      .eq('id', section.id);
    if (error) throw new Error(error.message);
  }
}
```

**Test criteria**:
- `npx tsc --noEmit` sạch ✓
- `fetchPageSections('home')` return array (có thể empty, ok) ✓
- TypeScript types auto-infer từ interface ✓

**Error handling**: Nếu TypeScript error, ghi rõ dòng + message, không bỏ qua.

---

## Task 5: PageBuilderPage Admin UI

**Purpose**: Trang admin để edit homepage/subpage content blocks (drag-reorder, edit text/images).

**File**: `src/admin/pages/PageBuilderPage.tsx` (CREATE NEW)

**Structure**:

```typescript
import { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, Edit2, Trash2, Plus } from 'lucide-react';
import { 
  fetchPageSectionsForAdmin, 
  updatePageSection, 
  deletePageSection,
  reorderPageSections 
} from '../../admin/adminApi';
import { PageSection } from '../../lib/siteContentApi';

const PAGE_OPTIONS = ['home', 'about', 'heritage', 'b2b', 'traceability'];

export default function PageBuilderPage() {
  const [selectedPage, setSelectedPage] = useState('home');
  const [sections, setSections] = useState<PageSection[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch sections on page change
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchPageSectionsForAdmin(selectedPage);
        setSections(data.sort((a, b) => a.sort_order - b.sort_order));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [selectedPage]);

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === sections.length - 1)
    ) {
      return;
    }
    const newSections = [...sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
    
    // Update sort_order
    const updates = newSections.map((s, i) => ({ id: s.id, sort_order: i }));
    try {
      await reorderPageSections(updates);
      setSections(newSections);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleUpdate = async (id: string, updates: Partial<PageSection>) => {
    try {
      await updatePageSection(id, updates);
      setSections(sections.map(s => s.id === id ? { ...s, ...updates } : s));
      setEditingId(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete section?')) return;
    try {
      await deletePageSection(id);
      setSections(sections.filter(s => s.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Page Builder</h1>

      {/* Page selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Page</label>
        <select
          value={selectedPage}
          onChange={(e) => setSelectedPage(e.target.value)}
          className="px-3 py-2 border rounded-lg"
        >
          {PAGE_OPTIONS.map(page => (
            <option key={page} value={page}>{page.toUpperCase()}</option>
          ))}
        </select>
      </div>

      {error && <div className="p-4 bg-red-100 text-red-700 rounded mb-4">{error}</div>}

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <>
          {/* Sections list */}
          <div className="space-y-4">
            {sections.map((section, i) => (
              <div key={section.id} className="border p-4 rounded-lg bg-white">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{section.title_vi || section.block_type}</h3>
                    <p className="text-xs text-gray-500">{section.block_type}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleMove(i, 'up')}
                      disabled={i === 0}
                      className="p-2 hover:bg-gray-100 disabled:opacity-50"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleMove(i, 'down')}
                      disabled={i === sections.length - 1}
                      className="p-2 hover:bg-gray-100 disabled:opacity-50"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditingId(editingId === section.id ? null : section.id)}
                      className="p-2 hover:bg-blue-100"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(section.id)}
                      className="p-2 hover:bg-red-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Edit form (inline) */}
                {editingId === section.id && (
                  <div className="border-t pt-4 space-y-3">
                    <div>
                      <label className="block text-xs font-medium">Title</label>
                      <input
                        type="text"
                        defaultValue={section.title_vi || ''}
                        onChange={(e) => handleUpdate(section.id, { title_vi: e.target.value })}
                        className="w-full px-2 py-1 border rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium">Block Type</label>
                      <select
                        defaultValue={section.block_type}
                        onChange={(e) => handleUpdate(section.id, { block_type: e.target.value })}
                        className="w-full px-2 py-1 border rounded text-sm"
                      >
                        <option>hero</option>
                        <option>text</option>
                        <option>image</option>
                        <option>carousel</option>
                        <option>testimonial</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium">Content</label>
                      <textarea
                        defaultValue={section.content_vi || ''}
                        onChange={(e) => handleUpdate(section.id, { content_vi: e.target.value })}
                        className="w-full px-2 py-1 border rounded text-sm"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium">Image URL</label>
                      <input
                        type="text"
                        defaultValue={section.image_url || ''}
                        onChange={(e) => handleUpdate(section.id, { image_url: e.target.value })}
                        className="w-full px-2 py-1 border rounded text-sm"
                        placeholder="(Tạm thời URL, image uploader ở task 6)"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium">CTA Text</label>
                      <input
                        type="text"
                        defaultValue={section.cta_text || ''}
                        onChange={(e) => handleUpdate(section.id, { cta_text: e.target.value })}
                        className="w-full px-2 py-1 border rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium">CTA URL</label>
                      <input
                        type="text"
                        defaultValue={section.cta_url || ''}
                        onChange={(e) => handleUpdate(section.id, { cta_url: e.target.value })}
                        className="w-full px-2 py-1 border rounded text-sm"
                      />
                    </div>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        defaultChecked={section.visible}
                        onChange={(e) => handleUpdate(section.id, { visible: e.target.checked })}
                      />
                      Visible
                    </label>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add section button */}
          <button className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            Add Section
          </button>
        </>
      )}
    </div>
  );
}
```

**Integration** (AdminApp.tsx + AdminLayout.tsx):
- `AdminApp.tsx`: Add route `<Route path="/page-builder" element={<PageBuilderPage />} />`
- `AdminLayout.tsx`: Add sidebar item linking to `/gate-vkd-control-2026/page-builder`

**Test criteria**:
- Admin vào `/gate-vkd-control-2026/page-builder` → dropdown default "home" ✓
- Fetch homepage sections (empty hoặc test data) ✓
- Click ↑/↓ buttons → sort_order update Supabase, UI refresh ✓
- Edit section: change title → Save → reload page → title persists ✓
- Delete section → removed from UI + Supabase ✓
- `npx tsc --noEmit` sạch ✓

**Error handling**: Nếu drag quá phức tạp, ↑↓ buttons là MVP-safe.

---

## Task 6: Sharp Image Resize (Optional MVP, có thể skip)

**Purpose**: Upload ảnh → auto-resize thành hero/card/thumb + WebP.

**Option A: Minimal (Recommended)**
- Tạm thời để image_url là text input (admin paste link)
- Sharp setup skip, để cho phiên sau nếu Joe muốn

**Option B: Full Implementation** (nếu có thời gian)

1. `package.json`: Add sharp dependency
```bash
npm install sharp
```

2. `src/server/imageResize.cjs` (CREATE NEW):
```javascript
const sharp = require('sharp');
const path = require('path');

async function resizeImage(inputBuffer, filename) {
  const timestamp = Date.now();
  const basename = path.parse(filename).name;
  
  const sizes = [
    { name: 'hero', width: 1920, height: 1080 },
    { name: 'card', width: 600, height: 400 },
    { name: 'thumb', width: 300, height: 200 },
  ];
  
  const results = {};
  for (const size of sizes) {
    const output = await sharp(inputBuffer)
      .resize(size.width, size.height, { fit: 'cover' })
      .webp({ quality: 80 })
      .toBuffer();
    
    results[size.name] = {
      data: output,
      filename: `${basename}-${size.name}-${timestamp}.webp`,
    };
  }
  return results;
}

module.exports = { resizeImage };
```

3. PageBuilderPage.tsx: Add image uploader input
```typescript
const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;
  
  // TODO: Upload to Supabase storage + Sharp resize
  // For now, just placeholder
};
```

**Test criteria** (if full implementation):
- `npm install sharp` success ✓
- Code compile check (Sharp is Node-only, browser won't run it) ✓

---

## Summary

Ox sẽ làm **3 tasks**:
- Task 4: Pure TypeScript API functions (safest)
- Task 5: React admin UI (main work)
- Task 6: Optional image resize (can skip MVP)

**Báo lại khi xong**:
- Commit message cho tasks
- `npx tsc --noEmit` output (phải sạch)
- Test results từ mỗi task

---

## Quick Checklist (Ox)
- [ ] Task 4: API functions add to siteContentApi + adminApi, TypeScript ok
- [ ] Task 5: PageBuilderPage UI renders, drag-reorder works, edit/delete works
- [ ] Task 6: Optional - Sharp installed (or skipped for MVP)
- [ ] `npx tsc --noEmit` passes
- [ ] Ready to merge with Qwen's tasks
