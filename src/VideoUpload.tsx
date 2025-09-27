import { useState, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

export default function VideoUpload({ 
  onUploadComplete, 
  onClose 
}: { 
  onUploadComplete?: () => void;
  onClose?: () => void;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const generateUploadUrl = useMutation(api.videos.generateUploadUrl);
  const saveVideo = useMutation(api.videos.saveVideo);

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('video/')) {
      alert('Please select a video file');
      return;
    }

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      alert('Video file must be smaller than 50MB');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Step 1: Get upload URL
      const postUrl = await generateUploadUrl();

      // Step 2: Upload file with progress tracking
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = (e.loaded / e.total) * 100;
          setUploadProgress(progress);
        }
      });

      const uploadPromise = new Promise<any>((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(new Error(`Upload failed: ${xhr.status}`));
          }
        };
        xhr.onerror = () => reject(new Error('Upload failed'));
      });

      xhr.open('POST', postUrl);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(file);

      const result = await uploadPromise;
      const { storageId } = result;

      // Step 3: Save video metadata
      await saveVideo({
        storageId,
        name: file.name,
        type: file.type,
      });

      onUploadComplete?.();
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="fixed top-16 left-4 z-50">
      <div className="bg-black/80 backdrop-blur-sm rounded-lg p-6 border border-white/20 min-w-[300px]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white font-bold text-lg">Upload Background Video</h3>
          {onClose && (
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleVideoUpload}
          disabled={isUploading}
          className="block w-full text-sm text-white mb-4
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-full file:border-0
                     file:text-sm file:font-semibold
                     file:bg-blue-500 file:text-white
                     hover:file:bg-blue-600
                     file:disabled:opacity-50
                     file:cursor-pointer
                     disabled:opacity-50"
        />
        
        {isUploading && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-white mb-2">
              <span>Uploading...</span>
              <span>{Math.round(uploadProgress)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}
        
        <div className="text-xs text-gray-300 space-y-1">
          <p>• Max size: 50MB</p>
          <p>• Formats: MP4, WebM, MOV</p>
          <p>• Video will replace current background</p>
        </div>
      </div>
    </div>
  );
}
