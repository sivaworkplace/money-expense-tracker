import React, { useState, useEffect } from 'react';
import { PhotoService } from '@/services/photo';
import { Image, X } from 'lucide-react';

interface PhotoViewProps {
  imagePath?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const PhotoView: React.FC<PhotoViewProps> = ({ imagePath, className = '', size = 'md' }) => {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);

  useEffect(() => {
    const loadPhoto = async () => {
      if (imagePath) {
        setLoading(true);
        try {
          const url = await PhotoService.getPhotoUrl(imagePath);
          setPhotoUrl(url);
        } catch (error) {
          console.error('Error loading photo:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setPhotoUrl(null);
      }
    };
    loadPhoto();
  }, [imagePath]);

  if (!imagePath || !photoUrl) {
    return null;
  }

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  if (loading) {
    return (
      <div className={`${sizeClasses[size]} rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center ${className}`}>
        <Image className="w-5 h-5 text-gray-400 animate-pulse" />
      </div>
    );
  }

  return (
    <>
      <div
        className={`${sizeClasses[size]} rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-pointer hover:opacity-80 transition-opacity ${className}`}
        onClick={() => setShowFullscreen(true)}
        title="Click to view full size"
      >
        <img
          src={photoUrl}
          alt="Attachment"
          className="w-full h-full object-cover"
        />
      </div>

      {showFullscreen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setShowFullscreen(false)}
        >
          <button
            className="absolute top-4 right-4 p-2 bg-white rounded-full hover:bg-gray-200 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setShowFullscreen(false);
            }}
          >
            <X className="w-6 h-6 text-gray-900" />
          </button>
          <img
            src={photoUrl || ''}
            alt="Attachment"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};

export default PhotoView;

