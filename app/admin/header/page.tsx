'use client';

import { useState, useEffect } from 'react';
import { SiteHeader } from '@/lib/types/siteConfig';

const STRAPI_BASE = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export default function HeaderSettings() {
  const [header, setHeader] = useState<SiteHeader | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [token] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('strapi-token') || '';
    }
    return '';
  });

  useEffect(() => {
    const fetchHeader = async () => {
      try {
        const response = await fetch(`${STRAPI_BASE}/api/site-headers?filters[isActive][$eq]=true`);
        if (!response.ok) throw new Error('Failed to fetch header');
        const data = await response.json();
        setHeader(data.data?.[0] || {
          id: '',
          navLinks: [],
          isActive: true,
          heroTitle: { vi: '' },
          heroSubtitle: { vi: '' },
          ctaButtonText: { vi: '' },
        });
      } catch (err) {
        alert('Error loading header');
      } finally {
        setLoading(false);
      }
    };
    fetchHeader();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (!header) return;
    setHeader(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleMultilingualChange = (field: string, lang: string, value: string) => {
    if (!header) return;
    setHeader(prev => prev ? {
      ...prev,
      [field]: {
        ...((prev as any)[field] || {}),
        [lang]: value,
      },
    } : null);
  };

  const handleNavLinkChange = (index: number, field: string, lang: string | null, value: string) => {
    if (!header?.navLinks) return;
    const newLinks = [...header.navLinks];
    if (field === 'text' && lang) {
      newLinks[index] = {
        ...newLinks[index],
        text: {
          ...(newLinks[index].text as any),
          [lang]: value,
        },
      };
    } else if (field === 'url') {
      newLinks[index] = {
        ...newLinks[index],
        url: value,
      };
    }
    setHeader({ ...header, navLinks: newLinks });
  };

  const addNavLink = () => {
    if (!header) return;
    const newLink = {
      text: { vi: '', en: '', fr: '', zh: '' },
      url: '',
      target: '_self' as const,
    };
    setHeader({
      ...header,
      navLinks: [...(header.navLinks || []), newLink],
    });
  };

  const removeNavLink = (index: number) => {
    if (!header?.navLinks) return;
    setHeader({
      ...header,
      navLinks: header.navLinks.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!header || !token) {
      alert('Missing header data or token');
      return;
    }

    setSubmitting(true);
    try {
      const url = header.id
        ? `${STRAPI_BASE}/api/site-headers/${header.id}`
        : `${STRAPI_BASE}/api/site-headers`;
      const response = await fetch(url, {
        method: header.id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ data: header }),
      });
      if (!response.ok) throw new Error('Failed to save header');
      alert('Header saved successfully');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error saving header');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!header) return <div className="text-red-600">Failed to load header</div>;

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8">
      <h1 className="text-2xl font-bold mb-6">Header Settings</h1>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
        <input
          type="text"
          name="logoUrl"
          value={header.logoUrl || ''}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h2 className="font-semibold mb-4 text-gray-900">Hero Title (Multilingual)</h2>
        <div className="grid grid-cols-2 gap-4">
          {['vi', 'en', 'fr', 'zh'].map(lang => (
            <div key={lang}>
              <label className="block text-sm text-gray-600 mb-1">{lang.toUpperCase()}</label>
              <input
                type="text"
                value={(header.heroTitle as any)?.[lang] || ''}
                onChange={(e) => handleMultilingualChange('heroTitle', lang, e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h2 className="font-semibold mb-4 text-gray-900">Hero Subtitle (Multilingual)</h2>
        <div className="grid grid-cols-2 gap-4">
          {['vi', 'en', 'fr', 'zh'].map(lang => (
            <div key={lang}>
              <label className="block text-sm text-gray-600 mb-1">{lang.toUpperCase()}</label>
              <textarea
                value={(header.heroSubtitle as any)?.[lang] || ''}
                onChange={(e) => handleMultilingualChange('heroSubtitle', lang, e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-gray-900">Navigation Links</h2>
          <button
            type="button"
            onClick={addNavLink}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Add Link
          </button>
        </div>
        <div className="space-y-4">
          {header.navLinks?.map((link, idx) => (
            <div key={idx} className="bg-white p-4 rounded border">
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">Link Text</label>
                <div className="grid grid-cols-2 gap-2">
                  {['vi', 'en', 'fr', 'zh'].map(lang => (
                    <input
                      key={lang}
                      type="text"
                      placeholder={lang.toUpperCase()}
                      value={(link.text as any)?.[lang] || ''}
                      onChange={(e) => handleNavLinkChange(idx, 'text', lang, e.target.value)}
                      className="px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ))}
                </div>
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
                <input
                  type="text"
                  value={link.url}
                  onChange={(e) => handleNavLinkChange(idx, 'url', null, e.target.value)}
                  className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="button"
                onClick={() => removeNavLink(idx)}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Remove Link
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h2 className="font-semibold mb-4 text-gray-900">CTA Button</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {['vi', 'en', 'fr', 'zh'].map(lang => (
            <div key={lang}>
              <label className="block text-sm text-gray-600 mb-1">Button Text ({lang.toUpperCase()})</label>
              <input
                type="text"
                value={(header.ctaButtonText as any)?.[lang] || ''}
                onChange={(e) => handleMultilingualChange('ctaButtonText', lang, e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>
        <input
          type="text"
          name="ctaButtonLink"
          placeholder="Button Link URL"
          value={header.ctaButtonLink || ''}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          className="px-6 py-2 border rounded-lg hover:bg-gray-50 text-gray-700 font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
        >
          {submitting ? 'Saving...' : 'Save Header'}
        </button>
      </div>
    </form>
  );
}
