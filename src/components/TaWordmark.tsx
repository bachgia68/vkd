interface TaWordmarkProps {
  className?: string;
}

// Stylized text wordmark for standalone brand mentions where the raster logo
// doesn't fit (chat widget title, admin chrome, inline card labels) — echoes
// the gold T / forest-green A of the main logo image without loading an <img>.
export default function TaWordmark({ className = '' }: TaWordmarkProps) {
  return (
    <span className={`font-display italic font-bold tracking-tight ${className}`}>
      <span className="text-gold-500">T</span>
      <span className="text-forest-700">A</span>
    </span>
  );
}
