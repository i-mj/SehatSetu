/**
 * Nurse Care - Reusable Device-Only Profile Picture Uploader
 * Resizes and center-crops uploaded image files to a compact 256x256 JPEG data URL
 * so avatars remain sharp while staying lightweight inside application storage.
 */

import React, { useRef, useState } from 'react';
import { Camera, Trash2, Upload } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ProfileAvatarUploaderProps {
  avatarUrl?: string;
  fullName: string;
  onChange: (nextAvatarUrl: string) => void;
  size?: 'md' | 'lg';
  label?: string;
  helperText?: string;
}

const resizeImageFileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Unable to read image file'));
    reader.onload = () => {
      const result = reader.result as string;
      const img = new Image();
      img.onerror = () => resolve(result);
      img.onload = () => {
        try {
          const targetSize = 256;
          const canvas = document.createElement('canvas');
          canvas.width = targetSize;
          canvas.height = targetSize;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(result);
            return;
          }

          const minSide = Math.min(img.width, img.height);
          const sx = Math.max(0, (img.width - minSide) / 2);
          const sy = Math.max(0, (img.height - minSide) / 2);

          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, targetSize, targetSize);
          ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, targetSize, targetSize);

          resolve(canvas.toDataURL('image/jpeg', 0.85));
        } catch {
          resolve(result);
        }
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  });
};

export const ProfileAvatarUploader: React.FC<ProfileAvatarUploaderProps> = ({
  avatarUrl,
  fullName,
  onChange,
  size = 'lg',
  label = 'Profile Picture',
  helperText = 'Upload a JPG, PNG, or WebP photo from your device (auto-cropped to square).'
}) => {
  const { addToast } = useApp();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const initials = (fullName || 'U')
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast('Invalid File Type', 'Please choose an image file (JPG, PNG, or WebP).', 'error');
      e.target.value = '';
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      addToast('Image Too Large', 'Please select an image smaller than 10 MB.', 'error');
      e.target.value = '';
      return;
    }

    setIsProcessing(true);
    try {
      const compressedDataUrl = await resizeImageFileToDataUrl(file);
      onChange(compressedDataUrl);
      addToast('Photo Ready', 'Profile picture updated. Save changes to persist.', 'success');
    } catch {
      addToast('Upload Failed', 'Could not process the selected image file.', 'error');
    } finally {
      setIsProcessing(false);
      e.target.value = '';
    }
  };

  const avatarBoxClasses =
    size === 'lg'
      ? 'w-16 h-16 rounded-2xl text-xl'
      : 'w-12 h-12 rounded-xl text-sm';

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3.5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
      <div className="relative shrink-0">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={fullName || 'Profile avatar'}
            className={`${avatarBoxClasses} object-cover border border-slate-200 bg-white shadow-2xs`}
          />
        ) : (
          <div
            className={`${avatarBoxClasses} bg-[#0f8672] text-white flex items-center justify-center font-bold shadow-2xs`}
          >
            {initials}
          </div>
        )}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
          className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-lg bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center shadow-xs border border-white cursor-pointer"
          title="Upload photo from device"
        >
          <Camera className="w-3 h-3" />
        </button>
      </div>

      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="text-xs font-bold text-slate-800">{label}</div>
        <p className="text-[11px] text-slate-500 leading-snug">{helperText}</p>
        <div className="flex flex-wrap items-center gap-2 pt-0.5">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            disabled={isProcessing}
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-slate-700 hover:text-[#0f8672] text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{isProcessing ? 'Processing...' : avatarUrl ? 'Change Photo' : 'Upload Photo'}</span>
          </button>

          {avatarUrl && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-rose-600 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
