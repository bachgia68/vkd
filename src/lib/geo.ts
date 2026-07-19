export const PROVINCE_COORDS: Record<string, { lat: number; lng: number }> = {
  'Đà Nẵng': { lat: 16.05, lng: 108.2 },
  'Hà Nội': { lat: 21.03, lng: 105.85 },
  'TP.HCM': { lat: 10.78, lng: 106.7 },
  Huế: { lat: 16.46, lng: 107.59 },
  'Kon Tum': { lat: 14.35, lng: 108.0 },
  'Cần Thơ': { lat: 10.03, lng: 105.79 },
};

export function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
}

export function nearestProvince(point: { lat: number; lng: number }): string {
  let best = '';
  let bestDist = Infinity;
  for (const [province, coord] of Object.entries(PROVINCE_COORDS)) {
    const d = haversineKm(point, coord);
    if (d < bestDist) {
      bestDist = d;
      best = province;
    }
  }
  return best;
}
