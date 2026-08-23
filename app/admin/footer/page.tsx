'use client';

import { useState, useEffect } from 'react';
import { SiteFooter } from '@/lib/types/siteConfig';

const STRAPI_BASE = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export default function FooterSettings() {
  const [footer, setFooter] = useState<SiteFooter | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [token] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('strapi-token') || '';
    }
    return '';
  });

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const response = await fetch(`${STRAPI_BASE}/api/site-footers?filters[isActive][$eq]=true`);
        if (!response.ok) throw new Error('Failed to fetch footer');
        const data = await response.json();
        setFooter(data.data?.[0] || {
          id: '',
          companyName: { vi: '' },
          companyAddress: { vi: '' },
          companyPhone: '',
          companyEmail: '',
          footerLinks: [],
          copyrightText: { vi: '' },
          isActive: true,
        });
      } catch (err) {
        alert('Error loading footer');
      } finally {
        setLoading(false);
      }
    };
    fetchFooter();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (!footer) return;
    setFooter(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleMultilingualChange = (field: string, lang: string, value: string) => {
    if (!footer) return;
    setFooter(prev => prev ? {
      ...prev,
      [field]: {
        ...((prev as any)[field] || {}),
        [lang]: value,
      },
    } : null);
  };

  const addFooterLinkSection = () => {
    if (!footer) return;
    const newSection = {
      title: { vi: '', en: '', fr: '', zh: '' },
      links: [],
    };
    setFooter({
      ...footer,
      footerLinks: [...(footer.footerLinks || []), newSection],
    });
  };

  const addFooterLink = (sectionIdx: number) => {
    if (!footer?.footerLinks) return;
    const sections = [...footer.footerLinks];
    sections[sectionIdx].links.push({
      text: { vi: '', en: '', fr: '', zh: '' },
      url: '',
    });
    setFooter({ ...footer, footerLinks: sections });
  };

  const updateFooterLink = (sectionIdx: number, linkIdx: number, field: string, lang: string | null, value: string) => {
    if (!footer?.footerLinks) return;
    const sections = [...footer.footerLinks];
    const link = sections[sectionIdx].links[linkIdx];
    if (field === 'text' && lang) {
      link.text = {
        ...(link.text || {}),
        [lang]: value,
      };
    } else if (field === 'url') {
      link.url = value;
    }
    setFooter({ ...footer, footerLinks: sections });
  };

  const removeFooterLink = (sectionIdx: number, linkIdx: number) => {
    if (!footer?.footerLinks) return;
    const sections = [...footer.footerLinks];
    sections[sectionIdx].links = sections[sectionIdx].links.filter((_, i) => i !== linkIdx);
    setFooter({ ...footer, footerLinks: sections });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!footer || !token) {
      alert('Missing footer data or token');
      return;
    }

    setSubmitting(true);
    try {
      const url = footer.id
        ? `${STRAPI_BASE}/api/site-footers/${footer.id}`
        : `${STRAPI_BASE}/api/site-footers`;
      const response = await fetch(url, {
        method: footer.id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ data: footer }),
      });
      if (!response.ok) throw new Error('Failed to save footer');
      alert('Footer saved successfully');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error saving footer');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!footer) return <div className="text-red-600">Failed to load footer</div>;

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8">
      <h1 className="text-2xl font-bold mb-6">Footer Settings</h1>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h2 className="font-semibold mb-4 text-gray-900">Company Name (Multilingual)</h2>
        <div className="grid grid-cols-2 gap-4">
          {['vi', 'en', 'fr', 'zh'].map(lang => (
            <div key={lang}>
              <label className="block text-sm text-gray-600 mb-1">{lang.toUpperCase()}</label>
              <input
                type="text"
                value={(footer.companyName as any)?.[lang] || ''}
                onChange={(e) => handleMultilingualChange('companyName', lang, e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h2 className="font-semibold mb-4 text-gray-900">Company Address (Multilingual)</h2>
        <div className="grid grid-cols-1 gap-4">
          {['vi', 'en', 'fr', 'zh'].map(lang => (
            <div key={lang}>
              <label className="block text-sm text-gray-600 mb-1">{lang.toUpperCase()}</label>
              <textarea
                value={(footer.companyAddress as any)?.[lang] || ''}
                onChange={(e) => handleMultilingualChange('companyAddress', lang, e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Company Phone</label>
          <input
            type="tel"
            name="companyPhone"
            value={footer.companyPhone || ''}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Company Email</label>
          <input
            type="email"
            name="companyEmail"
            value={footer.companyEmail || ''}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-gray-900">Footer Link Sections</h2>
          <button
            type="button"
            onClick={addFooterLinkSection}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Add Section
          </button>
        </div>
        <div className="space-y-6">
          {footer.footerLinks?.map((section, sIdx) => (
            <div key={sIdx} className="bg-white p-4 rounded border">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                <div className="grid grid-cols-2 gap-2">
                  {['vi', 'en', 'fr', 'zh'].map(lang => (
                    <input
                      key={lang}
                      type="text"
                      placeholder={lang.toUpperCase()}
                      value={(section.title as any)?.[lang] || ''}
                      onChange={(e) => {
                        const sections = [...(footer.footerLinks || [])];
                        sections[sIdx].title = {
                          ...(section.title || {}),
                          [lang]: e.target.value,
                        };
                        setFooter({ ...footer, footerLinks: sections });
                      }}
                      className="px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Links</label>
                  <button
                    type="button"
                    onClick={() => addFooterLink(sIdx)}
                    className="text-sm bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                  >
                    + Add Link
                  </button>
                </div>
                <div className="space-y-2">
                  {section.links.map((link, lIdx) => (
                    <div key={lIdx} className="bg-gray-50 p-2 rounded">
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        {['vi', 'en', 'fr', 'zh'].map(lang => (
                          <input
                            key={lang}
                            type="text"
                            placeholder={`Text ${lang.toUpperCase()}`}
                            value={(link.text as any)?.[lang] || ''}
                            onChange={(e) => updateFooterLink(sIdx, lIdx, 'text', lang, e.target.value)}
                            className="px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="URL"
                          value={link.url}
                          onChange={(e) => updateFooterLink(sIdx, lIdx, 'url', null, e.target.value)}
                          className="flex-1 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => removeFooterLink(sIdx, lIdx)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium px-2"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h2 className="font-semibold mb-4 text-gray-900">Copyright Text (Multilingual)</h2>
        <div className="grid grid-cols-2 gap-4">
          {['vi', 'en', 'fr', 'zh'].map(lang => (
            <div key={lang}>
              <label className="block text-sm text-gray-600 mb-1">{lang.toUpperCase()}</label>
              <input
                type="text"
                value={(footer.copyrightText as any)?.[lang] || ''}
                onChange={(e) => handleMultilingualChange('copyrightText', lang, e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>
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
          {submitting ? 'Saving...' : 'Save Footer'}
        </button>
      </div>
    </form>
  );
}
