import { ImageWithFallback } from "./figma/ImageWithFallback";

interface ProductThumbProps {
  src: string;
  alt: string;
  size?: number;
}

export function ProductThumb({ src, alt, size = 48 }: ProductThumbProps) {
  return (
    <div 
      className="rounded border border-gray-200 overflow-hidden flex-shrink-0 bg-gray-50"
      style={{ width: size, height: size }}
    >
      <ImageWithFallback
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
