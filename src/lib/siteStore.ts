import { useEffect, useState } from 'react';

// Lightweight localStorage-backed store for admin-editable site content
// (addresses/growing regions, contact & social links, blog posts, B2B leads).
// This is per-browser demo persistence, not a real database — see
// manage-admin-mockdata skill notes. Writes fire a custom event so any
// mounted component (admin or public) picks up the change without reload;
// the native 'storage' event additionally syncs across open tabs.

export interface StoredAddress {
  id: string;
  name: string;
  address: string;
  hours: string;
  phone: string;
  category: 'showroom' | 'growing_region';
}

export interface StoredSocialLink {
  id: string;
  platform: string;
  url: string;
}

export interface StoredPhone {
  id: string;
  label: string;
  value: string;
}

export interface StoredContactSettings {
  phones: StoredPhone[];
  socialLinks: StoredSocialLink[];
}

export interface StoredBlogPost {
  id: string;
  title: string;
  excerpt: string;
  body: string;
  createdAt: string;
}

export type B2BLeadType = 'distributor' | 'investor' | 'oem';

export interface StoredB2BLead {
  id: string;
  type: B2BLeadType;
  name: string;
  phone: string;
  email: string;
  message: string;
  createdAt: string;
  status: 'new' | 'contacted';
}

const KEYS = {
  addresses: 'ta_extra_addresses_v1',
  contact: 'ta_contact_settings_v1',
  blog: 'ta_blog_posts_v1',
  leads: 'ta_b2b_leads_v1',
} as const;

const CHANGE_EVENT = 'ta-store-changed';

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: key }));
  } catch {
    // localStorage full/unavailable — demo persistence only, safe to ignore
  }
}

export const DEFAULT_CONTACT_SETTINGS: StoredContactSettings = {
  phones: [{ id: 'p1', label: 'Zalo / WhatsApp', value: '(84) 984 999 309' }],
  socialLinks: [
    { id: 's1', platform: 'Zalo', url: 'https://zalo.me/84984999309' },
    { id: 's2', platform: 'WhatsApp', url: 'https://wa.me/84984999309' },
  ],
};

export function getAddresses(): StoredAddress[] {
  return load(KEYS.addresses, []);
}
export function saveAddresses(list: StoredAddress[]) {
  save(KEYS.addresses, list);
}

export function getContactSettings(): StoredContactSettings {
  return load(KEYS.contact, DEFAULT_CONTACT_SETTINGS);
}
export function saveContactSettings(settings: StoredContactSettings) {
  save(KEYS.contact, settings);
}

export function getBlogPosts(): StoredBlogPost[] {
  return load(KEYS.blog, []);
}
export function saveBlogPosts(list: StoredBlogPost[]) {
  save(KEYS.blog, list);
}

export function getLeads(): StoredB2BLead[] {
  return load(KEYS.leads, []);
}
export function saveLeads(list: StoredB2BLead[]) {
  save(KEYS.leads, list);
}

function useLiveStore<T>(getter: () => T): T {
  const [data, setData] = useState<T>(getter);
  useEffect(() => {
    const refresh = () => setData(getter());
    window.addEventListener('storage', refresh);
    window.addEventListener(CHANGE_EVENT, refresh);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener(CHANGE_EVENT, refresh);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return data;
}

export function useAddresses() {
  return useLiveStore(getAddresses);
}
export function useContactSettings() {
  return useLiveStore(getContactSettings);
}
export function useBlogPosts() {
  return useLiveStore(getBlogPosts);
}
export function useLeads() {
  return useLiveStore(getLeads);
}

export function genId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
