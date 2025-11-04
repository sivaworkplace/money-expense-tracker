import React, { useState, useEffect } from 'react';
import { Camera, X, Image as ImageIcon } from 'lucide-react';
import { PhotoService } from '@/services/photo';
import Button from './Button';

interface PhotoUploadProps {
  value?: string; // imagePath
  onChange: (imagePath: string | null) => void;
  label?: string;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ value, onChange, label = 'Attach Photo' }) => {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadPhoto = async () => {
      if (value) {
        setLoading(true);
        try {
          const url = await PhotoService.getPhotoUrl(value);
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
  }, [value]);

  const handleCapturePhoto = async () => {
    setLoading(true);
    try {
      const imagePath = await PhotoService.capturePhoto('camera');
      if (imagePath) {
        onChange(imagePath);
      }
    } catch (error) {
      console.error('Error capturing photo:', error);
      alert('Failed to capture photo. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFromGallery = async () => {
    setLoading(true);
    try {
      const imagePath = await PhotoService.capturePhoto('gallery');
      if (imagePath) {
        onChange(imagePath);
      }
      // If imagePath is null, it means user cancelled or permission denied - no need to alert
    } catch (error: any) {
      console.error('Error selecting photo:', error);
      // Only alert if it's not a cancellation or permission error (those are handled in PhotoService)
      if (!error?.message?.toLowerCase().includes('cancel') && 
          !error?.message?.toLowerCase().includes('permission')) {
        alert('Failed to select photo. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (value) {
      await PhotoService.deletePhoto(value);
    }
    onChange(null);
    setPhotoUrl(null);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>

      {photoUrl ? (
        <div className="relative">
          <div className="relative w-full h-48 rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden bg-gray-100 dark:bg-gray-800">
            <img
              src={photoUrl}
              alt="Attached"
              className="w-full h-full object-contain"
            />
            <button
              type="button"
              onClick={handleRemovePhoto}
              className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors"
              title="Remove photo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Photo attached. Tap to remove.
          </p>
        </div>
      ) : (
        <div className="flex gap-2">
          <div className="flex-1">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCapturePhoto}
              disabled={loading}
              fullWidth
            >
              <div className="flex items-center justify-center gap-2">
                <Camera className="w-4 h-4" />
                {loading ? 'Capturing...' : 'Take Photo'}
              </div>
            </Button>
          </div>
          <div className="flex-1">
            <Button
              type="button"
              variant="secondary"
              onClick={handleSelectFromGallery}
              disabled={loading}
              fullWidth
            >
              <div className="flex items-center justify-center gap-2">
                <ImageIcon className="w-4 h-4" />
                {loading ? 'Loading...' : 'Gallery'}
              </div>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;

