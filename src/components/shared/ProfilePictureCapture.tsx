import React, { useRef, useState } from 'react';
import { Camera, FolderUp, RefreshCw, Save } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { storage } from '../../lib/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useToast } from '../../context/ToastContext';

export default function ProfilePictureCapture() {
  const { userProfile, setUserProfile } = useAppContext();
  const { addToast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraOpen(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      addToast('error', 'Could not access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setIsCameraOpen(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        // Match the video dimensions
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        
        const imageData = canvasRef.current.toDataURL('image/jpeg', 0.85);
        setCapturedImage(imageData);
        stopCamera();
      }
    }
  };

  const chooseFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return addToast('error', 'Choose an image file (JPG, PNG, or WebP).');
    if (file.size > 5_000_000) return addToast('error', 'Choose an image smaller than 5 MB.');
    const reader = new FileReader();
    reader.onerror = () => addToast('error', 'Could not read the selected image.');
    reader.onload = () => setCapturedImage(String(reader.result));
    reader.readAsDataURL(file);
  };

  const savePhoto = async () => {
    if (!userProfile || !capturedImage) return;
    
    try {
      const imageBlob = await (await fetch(capturedImage)).blob();
      const imageRef = ref(storage, `profile-images/${userProfile.id}/${Date.now()}.jpg`);
      await uploadBytes(imageRef, imageBlob, { contentType: imageBlob.type || 'image/jpeg' });
      const photoURL = await getDownloadURL(imageRef);
      const userRef = doc(db, 'users', userProfile.id);
      await updateDoc(userRef, { photoURL });
      setUserProfile({ ...userProfile, photoURL } as any);
      addToast('success', 'Profile picture updated successfully!');
      setCapturedImage(null);
    } catch (err) {
      console.error(err);
      addToast('error', 'Failed to save profile picture.');
    }
  };

  const cancelPhoto = () => {
    setCapturedImage(null);
    stopCamera();
  };

  return (
    <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm max-w-2xl mb-6">
      <h3 className="text-xl font-bold text-neutral-900 mb-6">Profile Picture</h3>
      
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-neutral-100 flex items-center justify-center border-4 border-neutral-200 flex-shrink-0">
          {userProfile?.photoURL ? (
            <img src={userProfile.photoURL} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <span className="text-4xl font-bold text-neutral-400">
              {userProfile?.name?.charAt(0) || 'U'}
            </span>
          )}
        </div>
        
        <div className="flex-1 w-full">
          {!isCameraOpen && !capturedImage && (
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={startCamera} className="px-5 py-3 bg-neutral-100 text-neutral-700 font-medium rounded-xl hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2">
                <Camera className="w-5 h-5" /> Use camera
              </button>
              <button onClick={() => fileInputRef.current?.click()} className="px-5 py-3 bg-neutral-100 text-neutral-700 font-medium rounded-xl hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2">
                <FolderUp className="w-5 h-5" /> Upload a file
              </button>
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={chooseFile} className="hidden" />
            </div>
          )}

          {isCameraOpen && (
            <div className="space-y-4">
              <div className="relative rounded-xl overflow-hidden bg-black aspect-video w-full max-w-md">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={capturePhoto}
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors flex-1"
                >
                  Take Photo
                </button>
                <button
                  onClick={stopCamera}
                  className="px-6 py-3 bg-neutral-100 text-neutral-700 font-medium rounded-xl hover:bg-neutral-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {capturedImage && (
            <div className="space-y-4">
              <div className="relative rounded-xl overflow-hidden aspect-video w-full max-w-md border border-neutral-200">
                <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={savePhoto}
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 flex-1"
                >
                  <Save className="w-5 h-5" />
                  Save Picture
                </button>
                <button
                  onClick={cancelPhoto}
                  className="px-6 py-3 bg-neutral-100 text-neutral-700 font-medium rounded-xl hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 flex-1"
                >
                  <RefreshCw className="w-5 h-5" />
                  Retake
                </button>
              </div>
            </div>
          )}
          
          <canvas ref={canvasRef} className="hidden" />
        </div>
      </div>
    </div>
  );
}
