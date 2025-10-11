// components/ImageWithFallback.jsx
import { useState } from 'react';

const ImageWithFallback = ({ 
  src, 
  fallbackSrc = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f8fafc'/%3E%3Crect x='50' y='50' width='300' height='200' fill='%23e2e8f0' stroke='%23cbd5e1' stroke-width='2'/%3E%3Ctext x='200' y='165' font-family='Arial, sans-serif' font-size='16' fill='%234b5563' text-anchor='middle'%3EImage%3C/text%3E%3Ctext x='200' y='185' font-family='Arial, sans-serif' font-size='16' fill='%234b5563' text-anchor='middle'%3ENot Available%3C/text%3E%3C/svg%3E",
  alt, 
  className = '',
  width,
  height,
  ...props 
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      console.warn(`Image failed to load: ${src}. Using fallback.`);
      setImgSrc(fallbackSrc);
      setHasError(true);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      width={width}
      height={height}
      onError={handleError}
      {...props}
    />
  );
};

export default ImageWithFallback;