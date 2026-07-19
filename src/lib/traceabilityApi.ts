import { supabase } from './supabaseClient';
import { nearestProvince } from './geo';

export interface PublicBatch {
  id: string;
  batch_id: string;
  product_name: string;
  product_image_url: string | null;
  cultivation_region_name: string | null;
  cultivation_province: string | null;
  harvest_date: string | null;
  qc_status: string;
  qc_lab: string | null;
  gacp_who_certified: boolean;
  photo_urls: string[];
}

export async function fetchBatchByQr(qrHash: string): Promise<PublicBatch | null> {
  const { data, error } = await supabase
    .from('batches')
    .select(
      'id, batch_id, harvest_date, qc_status, qc_lab, gacp_who_certified, photo_urls, products(name_vi, image_url), cultivation_regions(name_vi, province)'
    )
    .eq('qr_hash', qrHash)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;

  const row = data as unknown as {
    id: string;
    batch_id: string;
    harvest_date: string | null;
    qc_status: string;
    qc_lab: string | null;
    gacp_who_certified: boolean;
    photo_urls: string[] | null;
    products: { name_vi: string; image_url: string | null } | { name_vi: string; image_url: string | null }[] | null;
    cultivation_regions: { name_vi: string; province: string } | { name_vi: string; province: string }[] | null;
  };
  const product = Array.isArray(row.products) ? row.products[0] : row.products;
  const region = Array.isArray(row.cultivation_regions) ? row.cultivation_regions[0] : row.cultivation_regions;

  return {
    id: row.id,
    batch_id: row.batch_id,
    product_name: product?.name_vi ?? '',
    product_image_url: product?.image_url ?? null,
    cultivation_region_name: region?.name_vi ?? null,
    cultivation_province: region?.province ?? null,
    harvest_date: row.harvest_date,
    qc_status: row.qc_status,
    qc_lab: row.qc_lab,
    gacp_who_certified: row.gacp_who_certified ?? false,
    photo_urls: row.photo_urls ?? [],
  };
}

async function getBrowserRegion(): Promise<string | null> {
  if (!('geolocation' in navigator)) return null;
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve(nearestProvince({ lat: pos.coords.latitude, lng: pos.coords.longitude })),
      () => resolve(null),
      { timeout: 5000, maximumAge: 300000 }
    );
  });
}

export async function logScanEvent(batchId: string): Promise<void> {
  const region = await getBrowserRegion();

  let suspect = false;
  if (region) {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data: recent } = await supabase
      .from('qr_scan_events')
      .select('region')
      .eq('batch_id', batchId)
      .gte('scanned_at', since)
      .not('region', 'is', null);
    if (recent && recent.some((r: { region: string | null }) => r.region && r.region !== region)) {
      suspect = true;
    }
  }

  await supabase.from('qr_scan_events').insert({ batch_id: batchId, region, suspect });
}
