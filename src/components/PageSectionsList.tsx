import { useEffect, useState } from 'react';
import { fetchPageSections, type PageSection } from '../lib/siteContentApi';
import GenericPageSectionBlock from './GenericPageSectionBlock';

interface Props {
  pageKey: string;
  excludeBlockTypes?: string[];
}

// Danh sach block "tu do" cho 1 trang (khong phai trang chu) — Joe them/sua/
// xoa/an qua Page Builder (chon dung pageKey o do), hien qua
// GenericPageSectionBlock. excludeBlockTypes de loai block_type da co
// component rieng xu ly o noi khac trong cung trang (vd About.tsx tu doc
// block_type 'about' rieng, khong can list nay ve lai lan 2).
export default function PageSectionsList({ pageKey, excludeBlockTypes = [] }: Props) {
  const [sections, setSections] = useState<PageSection[]>([]);

  useEffect(() => {
    fetchPageSections(pageKey)
      .then((rows) => setSections(rows.filter((r) => !excludeBlockTypes.includes(r.block_type))))
      .catch(() => setSections([]));
  }, [pageKey, excludeBlockTypes.join(',')]);

  return (
    <>
      {[...sections]
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((s) => (
          <GenericPageSectionBlock key={s.id} section={s} />
        ))}
    </>
  );
}
