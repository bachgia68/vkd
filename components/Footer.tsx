'use client';

import { useFooter } from '@/lib/hooks/useFooter';
import { useSocialLinks } from '@/lib/hooks/useSocialLinks';

export default function Footer() {
  const { footer, loading: footerLoading } = useFooter();
  const { links, loading: linksLoading } = useSocialLinks();

  if (footerLoading || linksLoading) {
    return (
      <footer className="w-full bg-navy text-cream py-12">
        <p className="text-center">Đang tải footer...</p>
      </footer>
    );
  }

  return (
    <footer className="w-full bg-navy text-cream py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-gold">
              {footer?.companyName || 'TA'}
            </h4>
            <p className="text-sm">{footer?.companyAddress}</p>
            <p className="text-sm">{footer?.companyPhone}</p>
            <p className="text-sm">{footer?.companyEmail}</p>
          </div>

          {/* Footer Links */}
          {footer?.footerLinks?.map((section) => (
            <div key={section.title}>
              <h5 className="font-bold mb-4 text-gold">{section.title}</h5>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.url}>
                    <a href={link.url} className="hover:text-gold transition-colors">
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Social Links */}
          <div>
            <h5 className="font-bold mb-4 text-gold">Theo dõi</h5>
            <div className="flex gap-4 flex-wrap">
              {links.map((link) => (
                <a
                  key={link.platform}
                  href={link.url}
                  target={link.openInNewTab ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  className="text-2xl hover:text-gold transition-colors"
                  title={link.displayText || link.platform}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gold/30 pt-8 text-center text-sm">
          <p>{footer?.copyrightText || '© 2026 TA. All rights reserved.'}</p>
        </div>
      </div>
    </footer>
  );
}
