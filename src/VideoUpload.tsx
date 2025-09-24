import { useState, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

export default function VideoUpload({ onUploadComplete }: { onUploadComplete?: () => void }) {
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

      alert('Video uploaded successfully! Refresh the page to see it as background.');
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
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 border border-white/20">
        <h3 className="text-white font-bold mb-2">Upload Background Video</h3>
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleVideoUpload}
          disabled={isUploading}
          className="block w-full text-sm text-white
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-full file:border-0
                     file:text-sm file:font-semibold
                     file:bg-blue-500 file:text-white
                     hover:file:bg-blue-600
                     file:disabled:opacity-50"
        />
        {isUploading && (
          <div className="mt-2">
            <div className="text-xs text-white mb-1">
              Uploading... {Math.round(uploadProgress)}%
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}
        <p className="text-xs text-gray-300 mt-2">
          Max size: 50MB. Formats: MP4, WebM, MOV
        </p>
      </div>
    </div>
  );
}
