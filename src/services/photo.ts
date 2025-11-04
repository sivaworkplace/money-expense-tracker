import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';

export class PhotoService {
  private static readonly PHOTO_DIR = 'photos';
  private static readonly PHOTO_QUALITY = 90; // JPEG quality (0-100)

  /**
   * Take a photo or pick from gallery
   */
  static async capturePhoto(source: 'camera' | 'gallery' = 'camera'): Promise<string | null> {
    try {
      if (Capacitor.isNativePlatform()) {
        // Mobile: Use Capacitor Camera
        try {
          const photo = await Camera.getPhoto({
            quality: this.PHOTO_QUALITY,
            allowEditing: false,
            resultType: CameraResultType.Base64, // Use Base64 for easier file handling
            source: source === 'camera' ? CameraSource.Camera : CameraSource.Photos,
            correctOrientation: true,
          });

          // Save photo to permanent storage
          const savedPath = await this.savePhotoToStorage(photo);
          return savedPath;
        } catch (cameraError: any) {
          console.error('Camera error:', cameraError);
          
          // Check for specific error types
          if (cameraError.message?.toLowerCase().includes('cancel') || 
              cameraError.message?.toLowerCase().includes('user cancelled')) {
            // User cancelled - don't show error
            return null;
          }
          
          if (cameraError.message?.toLowerCase().includes('permission') ||
              cameraError.message?.toLowerCase().includes('access denied')) {
            alert('Please grant photo access permission in your device settings to select photos from gallery.');
            return null;
          }
          
          // For gallery specifically, try to provide better error message
          if (source === 'gallery') {
            alert('Unable to access gallery. Please check app permissions in Settings > Apps > Dagger One > Permissions.');
          } else {
            alert('Failed to capture photo. Please check camera permissions and try again.');
          }
          return null;
        }
      } else {
        // Web: Use file input
        return await this.selectFileFromWeb();
      }
    } catch (error: any) {
      console.error('Error capturing photo:', error);
      // Don't alert on user cancel
      if (error?.message && (error.message.toLowerCase().includes('cancel') || error.message.toLowerCase().includes('user cancelled'))) {
        return null;
      }
      
      // Provide more specific error message
      if (source === 'gallery') {
        alert('Failed to select photo from gallery. Please check permissions and try again.');
      } else {
        alert('Failed to capture photo. Please check permissions and try again.');
      }
      return null;
    }
  }

  /**
   * Save photo to permanent storage (mobile)
   */
  private static async savePhotoToStorage(photo: Photo): Promise<string> {
    try {
      let base64Data: string;

      // Handle both Base64 and Uri result types
      if (photo.base64String) {
        // Already in base64 format
        base64Data = photo.base64String;
      } else if (photo.path) {
        // Need to read from file path
        const photoFile = await Filesystem.readFile({
          path: photo.path,
        });
        base64Data = photoFile.data as string;
      } else {
        throw new Error('Photo data not available');
      }

      // Generate unique filename
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 9);
      const filename = `photo_${timestamp}_${randomStr}.jpg`;
      const filepath = `${this.PHOTO_DIR}/${filename}`;

      // Ensure photos directory exists
      try {
        await Filesystem.mkdir({
          path: this.PHOTO_DIR,
          directory: Directory.Documents,
          recursive: true,
        });
      } catch {
        // Directory might already exist, ignore
      }

      // Save to Documents directory (persistent)
      await Filesystem.writeFile({
        path: filepath,
        data: base64Data,
        directory: Directory.Documents,
      });

      // Return the path for storage in database
      return `documents://${filepath}`;
    } catch (error) {
      console.error('Error saving photo:', error);
      throw error;
    }
  }

  /**
   * Select file from web (web browser)
   */
  private static selectFileFromWeb(): Promise<string | null> {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment'; // Prefer rear camera on mobile web

      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) {
          resolve(null);
          return;
        }

        try {
          // Convert to base64 for web storage
          const base64 = await this.fileToBase64(file);
          
          // Store in IndexedDB or localStorage
          const photoId = `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          await this.saveBase64ToWebStorage(photoId, base64);
          
          resolve(`web://${photoId}`);
        } catch (error) {
          console.error('Error processing file:', error);
          resolve(null);
        }
      };

      input.click();
    });
  }

  /**
   * Convert file to base64
   */
  private static fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Save base64 image to web storage (IndexedDB)
   */
  private static async saveBase64ToWebStorage(photoId: string, base64: string): Promise<void> {
    try {
      // Store in IndexedDB
      const db = await this.getWebDB();
      const transaction = db.transaction('photos', 'readwrite');
      const store = transaction.objectStore('photos');
      await new Promise<void>((resolve, reject) => {
        const request = store.put({ id: photoId, data: base64 }, photoId);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      // Fallback to localStorage (with size limit check)
      if (base64.length < 5 * 1024 * 1024) { // 5MB limit
        localStorage.setItem(`photo_${photoId}`, base64);
      } else {
        throw new Error('Image too large for localStorage');
      }
    }
  }

  /**
   * Get IndexedDB database for web photo storage
   */
  private static async getWebDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('PhotoStorage', 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('photos')) {
          db.createObjectStore('photos', { keyPath: 'id' });
        }
      };
    });
  }

  /**
   * Get photo URL for display
   */
  static async getPhotoUrl(imagePath?: string): Promise<string | null> {
    if (!imagePath) return null;

    try {
      if (Capacitor.isNativePlatform()) {
        // Mobile: Read from file system
        if (imagePath.startsWith('documents://')) {
          const path = imagePath.replace('documents://', '');
          try {
            const file = await Filesystem.readFile({
              path,
              directory: Directory.Documents,
            });

            // Return data URL for display
            const data = typeof file.data === 'string' ? file.data : (file.data as any).toString();
            return `data:image/jpeg;base64,${data}`;
          } catch (fileError) {
            console.error('Error reading photo file:', fileError);
            // Return null if file doesn't exist
            return null;
          }
        }
      } else {
        // Web: Get from IndexedDB or localStorage
        if (imagePath.startsWith('web://')) {
          const photoId = imagePath.replace('web://', '');
          
          try {
            const db = await this.getWebDB();
            const photo = await new Promise<any>((resolve, reject) => {
              const request = db.transaction('photos', 'readonly').objectStore('photos').get(photoId);
              request.onsuccess = () => resolve(request.result);
              request.onerror = () => reject(request.error);
            });
            
            return photo?.data || null;
          } catch {
            // Fallback to localStorage
            return localStorage.getItem(`photo_${photoId}`);
          }
        }
      }
    } catch (error) {
      console.error('Error loading photo:', error);
    }

    return null;
  }

  /**
   * Delete photo from storage
   */
  static async deletePhoto(imagePath?: string): Promise<void> {
    if (!imagePath) return;

    try {
      if (Capacitor.isNativePlatform()) {
        if (imagePath.startsWith('documents://')) {
          const path = imagePath.replace('documents://', '');
          await Filesystem.deleteFile({
            path,
            directory: Directory.Documents,
          });
        }
      } else {
        if (imagePath.startsWith('web://')) {
          const photoId = imagePath.replace('web://', '');
          
          try {
            const db = await this.getWebDB();
            await new Promise<void>((resolve, reject) => {
              const request = db.transaction('photos', 'readwrite').objectStore('photos').delete(photoId);
              request.onsuccess = () => resolve();
              request.onerror = () => reject(request.error);
            });
          } catch {
            // Fallback to localStorage
            localStorage.removeItem(`photo_${photoId}`);
          }
        }
      }
    } catch (error) {
      console.error('Error deleting photo:', error);
    }
  }
}

