import { useState, useRef, useCallback } from 'react';

/**
 * Hook quản lý phát âm thanh mẫu (TTS) và thu âm giọng nói (MediaRecorder)
 */
export function useAudioRecorder() {
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  // Đọc câu tiếng Anh mẫu bằng Web Speech Synthesis
  const speakText = useCallback((text, onEnd) => {
    if (!('speechSynthesis' in window) || !text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.95;
    if (onEnd) utterance.onend = onEnd;
    window.speechSynthesis.speak(utterance);
  }, []);

  // Bắt đầu thu file audio (nếu người dùng muốn nghe lại giọng của chính mình)
  const startAudioCapture = useCallback(async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) return;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
    } catch {
      // Bỏ qua nếu không có mic
    }
  }, []);

  const stopAudioCapture = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  }, []);

  return {
    audioUrl,
    setAudioUrl,
    speakText,
    startAudioCapture,
    stopAudioCapture,
  };
}

