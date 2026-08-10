import React, { useState, useRef } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';
import { storage } from '../../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface AudioRecorderProps {
  onAudioReady: (url: string) => void;
}

export default function AudioRecorder({ onAudioReady }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await uploadAudio(audioBlob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Microphone access is required to record audio.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const uploadAudio = async (audioBlob: Blob) => {
    setIsUploading(true);
    try {
      const fileName = `audio_${Date.now()}.webm`;
      const audioRef = ref(storage, `messages/audio/${fileName}`);
      await uploadBytes(audioRef, audioBlob);
      const url = await getDownloadURL(audioRef);
      onAudioReady(url);
    } catch (error) {
      console.error("Error uploading audio:", error);
      alert("Failed to upload audio message.");
    } finally {
      setIsUploading(false);
    }
  };

  if (isUploading) {
    return (
      <button disabled className="p-2 bg-neutral-200 text-neutral-500 rounded-xl flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin" />
      </button>
    );
  }

  return (
    <button
      onClick={isRecording ? stopRecording : startRecording}
      className={`p-2 rounded-xl transition-colors flex items-center justify-center ${
        isRecording ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
      }`}
      title={isRecording ? "Stop recording" : "Record audio"}
    >
      {isRecording ? <Square className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
    </button>
  );
}
