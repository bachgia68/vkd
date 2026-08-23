# B2: Nodes n8n cần thêm — đọc research_queue tự động

Ngày tạo: 2026-08-20  
Trạng thái: research_queue đã có 16 dòng thật. Cần sửa workflow n8n.

## Tổng quan thay đổi

Workflow hiện tại: Webhook → Chọn trụ nội dung (hardcode) → Xay dung Prompt → ...

Workflow sau B2:  
Webhook → **Lay Nghien Cuu Tu Queue** (Supabase) → **Xay dung Prompt (v2)** → ...

Các node KHÔNG đổi: Chuẩn hoá → Đăng blog → Telegram duyệt → ...

---

## Node 1: "Lay Nghien Cuu Tu Queue"

**Type:** Supabase (hoặc HTTP Request nếu dùng REST API)

### Option A — Dùng Supabase node (nếu đã có credential)

- **Operation:** Get Many
- **Table:** `research_queue`
- **Filter:** `used = false`
- **Sort:** `created_at` ASC (lấy cũ nhất trước)
- **Limit:** 1

Kết quả: 1 row JSON → truyền sang node tiếp theo.

### Option B — Dùng HTTP Request (luôn hoạt động, không cần Supabase node)

- **Method:** GET
- **URL:** `https://YOUR_SUPABASE_URL/rest/v1/research_queue?used=eq.false&order=created_at.asc&limit=1`
- **Headers:**
  ```
  apikey: YOUR_SUPABASE_ANON_KEY
  Authorization: Bearer YOUR_SUPABASE_ANON_KEY
  ```
- **Response:** Array[1 object]

Sau đó thêm **Set node** để flatten:
```
research = {{ $json[0] }}
research_title = {{ $json[0].title }}
research_doi = {{ $json[0].doi }}
research_summary = {{ $json[0].abstract_vn }}
research_angle = {{ $json[0].angle }}
```

---

## Node 2: "Xay dung Prompt (v2)" — thay thế node cũ

**Type:** Code (JavaScript)

```javascript
const research = $('Lay Nghien Cuu Tu Queue').first().json;

// Fallback nếu queue rỗng — dùng lại 8 trụ cũ
if (!research || !research.title) {
  const TRUS = [
    "chống lão hoá / trẻ hoá tế bào",
    "tăng miễn dịch tự nhiên",
    "giảm stress / cải thiện giấc ngủ",
    "tăng cường trí nhớ / tập trung",
    "hỗ trợ huyết áp / tim mạch",
    "detox gan / thải độc",
    "tăng sinh lực / chống mệt mỏi",
    "hỗ trợ chống ung thư (dẫn nguồn khoa học)"
  ];
  const tru = TRUS[Math.floor(Math.random() * TRUS.length)];
  return [{
    prompt: `Viết bài blog về sâm Ngọc Linh, góc: "${tru}". Dẫn nguồn PubMed nếu có.`,
    source_doi: null,
    research_id: null
  }];
}

const prompt = `Bạn là chuyên gia thẩm định độc lập về sâm Ngọc Linh (Panax vietnamensis).

Nghiên cứu mới: "${research.title}"
DOI: ${research.doi}
Tóm tắt khoa học: ${research.abstract_vn}
Góc nội dung đề xuất: ${research.angle}

Viết 1 bài blog tiếng Việt (600-800 chữ) theo format:
1. Tiêu đề hấp dẫn (không clickbait, phải đúng nội dung nghiên cứu)
2. Mở bài: 1 sự thật bất ngờ từ nghiên cứu (không nói "nhiều người nghĩ...")
3. Thân bài: giải thích cơ chế khoa học bằng ngôn ngữ dễ hiểu, có ví dụ cụ thể
4. Ứng dụng thực tế: dùng sâm Ngọc Linh nhà Khánh như thế nào để đạt hiệu quả này
5. Kết: 1 câu nhắc nguồn DOI (VD: "Nghiên cứu đăng tại ${research.doi}")

KHÔNG:
- Không hứa hẹn chữa bệnh
- Không nói "theo chuyên gia" mà không dẫn nguồn cụ thể
- Không dùng từ "thần kỳ", "thần dược"

Thêm 3 caption ngắn cho Facebook (mỗi caption < 150 chữ, góc khác nhau).`;

return [{
  prompt,
  source_doi: research.doi,
  research_id: research.id
}];
```

---

## Node 3: "Danh Dau Da Dung" — thêm SAU khi bài đã sinh xong

**Type:** HTTP Request (PATCH Supabase)

Đặt ngay trước node "Chuan Hoa" hoặc ngay sau "Xay dung Prompt".

- **Method:** PATCH
- **URL:** `https://YOUR_SUPABASE_URL/rest/v1/research_queue?id=eq={{ $('Xay dung Prompt (v2)').first().json.research_id }}`
- **Headers:**
  ```
  apikey: YOUR_SUPABASE_ANON_KEY
  Authorization: Bearer YOUR_SUPABASE_ANON_KEY
  Content-Type: application/json
  Prefer: return=minimal
  ```
- **Body (JSON):**
  ```json
  { "used": true, "used_at": "{{ $now }}" }
  ```

**Chỉ chạy node này khi `research_id` không null** — thêm IF node trước:
- Condition: `{{ $('Xay dung Prompt (v2)').first().json.research_id }}` ≠ empty

---

## Node 4: Lưu source_doi vào blog_posts

Trong node "Luu Vao Supabase" (node tạo bài blog), thêm field:
- **source_doi:** `{{ $('Xay dung Prompt (v2)').first().json.source_doi }}`

Cột `source_doi` đã được thêm vào bảng `blog_posts` (done 2026-08-20).

---

## Thứ tự làm khi Docker lên

1. Mở n8n (`localhost:5678`)
2. Mở workflow chính (AUTO_CONTENT_CREATOR hoặc tên tương đương)
3. Thêm node "Lay Nghien Cuu Tu Queue" — đặt SAU Webhook, TRƯỚC "Xay dung Prompt"
4. Sửa node "Xay dung Prompt" → thành "Xay dung Prompt (v2)" — paste code JS ở trên
5. Thêm node "Danh Dau Da Dung" — đặt NGAY SAU "Xay dung Prompt (v2)"
6. Sửa node "Luu Vao Supabase" — thêm field `source_doi`
7. Test: trigger webhook thủ công → xem bài sinh ra có dùng dữ liệu từ research_queue không
8. Kiểm tra: `SELECT * FROM research_queue WHERE used=true` — phải thấy 1 dòng

## Điều kiện hoàn thành B2

- [x] `research_queue` tồn tại, có 16 dòng nghiên cứu thật (done 2026-08-20)
- [x] `source_doi` column trong `blog_posts` (done 2026-08-20)
- [ ] Nodes 1-4 đã thêm vào n8n
- [ ] Test thành công: 1 bài tự động sinh từ research_queue, research_queue.used=true
