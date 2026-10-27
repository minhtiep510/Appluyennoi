import { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { SOCKET_BASE_URL } from '../api/client';
import { evaluationService } from '../api/evaluation.service';

/**
 * Hàm chấm điểm phát âm từng từ Real-time tại Client (dùng song song với Socket.IO hoặc khi dùng thử không cần đăng nhập)
 */
function evaluatePronunciationLocal(dialogueLineId, targetText = '', spokenText = '') {
  const cleanWord = (w) => w.toLowerCase().replace(/[^a-z0-9']/g, '');
  const targetWordsRaw = targetText.trim().split(/\s+/).filter(Boolean);
  const spokenWordsClean = spokenText
    .trim()
    .split(/\s+/)
    .map(cleanWord)
    .filter(Boolean);

  if (targetWordsRaw.length === 0) {
    return {
      dialogueLineId,
      accuracyScore: 0,
      feedback: 'Hãy bắt đầu nói...',
      wordAnalysis: [],
      mispronouncedWords: [],
    };
  }

  let matchedCount = 0;
  const matchedWords = [];
  const mispronouncedWords = [];

  const wordAnalysis = targetWordsRaw.map((rawWord, idx) => {
    const expected = cleanWord(rawWord);
    const isMatched =
      spokenWordsClean[idx] === expected || spokenWordsClean.includes(expected);

    if (isMatched) {
      matchedCount += 1;
      matchedWords.push(expected);
      return { word: rawWord, status: 'correct' };
    }

    if (idx < spokenWordsClean.length) {
      mispronouncedWords.push(rawWord.replace(/[^a-zA-Z0-9']/g, ''));
      return { word: rawWord, status: 'wrong' };
    }

    return { word: rawWord, status: 'pending' };
  });

  const accuracyScore =
    spokenWordsClean.length === 0
      ? 0
      : Math.round((matchedCount / targetWordsRaw.length) * 100);

  let feedback = 'Đang lắng nghe và phân tích từng từ...';
  if (accuracyScore >= 90) {
    feedback = 'Tuyệt vời! Phát âm chuẩn xác và trôi chảy chuẩn Band 8.0+ 🌟';
  } else if (accuracyScore >= 70) {
    feedback = 'Khá tốt! Hãy chú ý nhấn trọng âm rõ hơn ở các từ màu đỏ nhé 👍';
  } else if (accuracyScore > 0) {
    feedback = 'Hãy nghe lại câu mẫu và đọc chậm rãi từng cụm từ nhé 💪';
  }

  return {
    dialogueLineId,
    accuracyScore,
    spokenText,
    feedback,
    wordAnalysis,
    matchedWords,
    mispronouncedWords,
  };
}

/**
 * Hook Nhận dạng giọng nói Real-time (Web Speech API) kết hợp Socket.IO Streaming
 */
export function useSpeechToText({ activeLine, onCompletedScore }) {
  const [socketConnected, setSocketConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const [liveEval, setLiveEval] = useState(null);
  const [speechError, setSpeechError] = useState('');

  const socketRef = useRef(null);
  const recognitionRef = useRef(null);
  const latestSpokenRef = useRef('');
  const activeLineRef = useRef(activeLine);

  useEffect(() => {
    activeLineRef.current = activeLine;
  }, [activeLine]);

  // Khởi tạo kết nối Socket.IO Real-time
  useEffect(() => {
    const token = localStorage.getItem('token');
    const socket = io(SOCKET_BASE_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => setSocketConnected(true));
    socket.on('disconnect', () => setSocketConnected(false));

    socket.on('practice:live-score', (data) => {
      if (activeLineRef.current && data.dialogueLineId === activeLineRef.current.id) {
        setLiveEval(data);
      }
    });

    socket.on('practice:completed', (result) => {
      setLiveEval(result);
      onCompletedScore?.(result);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, []);

  // Stream câu đang nói để tô màu từng từ Real-time
  const streamText = useCallback((text, lineOverride) => {
    const targetLine = lineOverride || activeLineRef.current;
    if (!targetLine) return;

    // Chấm điểm tức thì trên giao diện để không có độ trễ
    const instantEval = evaluatePronunciationLocal(targetLine.id, targetLine.text, text);
    setLiveEval(instantEval);

    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('practice:stream', {
        dialogueLineId: targetLine.id,
        targetText: targetLine.text,
        spokenText: text,
      });
    }
  }, []);

  // Chốt điểm và lưu lịch sử vào Database (hoặc chấm điểm trực tiếp khi dùng thử)
  const finalizePractice = useCallback(
    async (textToSubmit, lineOverride) => {
      const targetLine = lineOverride || activeLineRef.current;
      const finalSpoken = (textToSubmit ?? latestSpokenRef.current).trim();
      if (!finalSpoken || !targetLine) return;

      const localResult = evaluatePronunciationLocal(
        targetLine.id,
        targetLine.text,
        finalSpoken
      );
      setLiveEval(localResult);

      if (socketRef.current && socketConnected) {
        socketRef.current.emit('practice:finish', {
          dialogueLineId: targetLine.id,
          spokenText: finalSpoken,
        });
      } else {
        try {
          const result = await evaluationService.submitPractice({
            dialogueLineId: targetLine.id,
            spokenText: finalSpoken,
          });
          setLiveEval(result);
          onCompletedScore?.(result);
        } catch {
          // Chế độ dùng thử miễn phí / Offline vẫn trả kết quả chấm điểm đầy đủ
          onCompletedScore?.(localResult);
        }
      }
    },
    [socketConnected, onCompletedScore]
  );

  // Bật / Tắt thu âm giọng nói
  const toggleRecording = useCallback(
    ({ onStartAudio, onStopAudio } = {}) => {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setSpeechError(
          'Trình duyệt không hỗ trợ Web Speech API (Vui lòng sử dụng Chrome hoặc Edge để thu âm giọng nói).'
        );
        return;
      }

      if (isRecording) {
        recognitionRef.current?.stop();
        onStopAudio?.();
        setIsRecording(false);
        return;
      }

      setSpeechError('');
      setSpokenText('');
      latestSpokenRef.current = '';

      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = true;
      recognition.continuous = false;

      recognition.onstart = () => {
        setIsRecording(true);
        onStartAudio?.();
      };

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setSpokenText(transcript);
        latestSpokenRef.current = transcript;
        streamText(transcript);
      };

      recognition.onerror = (event) => {
        setSpeechError(
          `Không nhận được âm thanh từ Micro (${event.error}). Hãy kiểm tra quyền truy cập Micro và thử nói lại nhé!`
        );
        setIsRecording(false);
        onStopAudio?.();
      };

      recognition.onend = () => {
        setIsRecording(false);
        onStopAudio?.();
        if (latestSpokenRef.current.trim()) {
          finalizePractice(latestSpokenRef.current);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    },
    [isRecording, streamText, finalizePractice]
  );

  const resetLineSpeech = useCallback((initialEval = null) => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsRecording(false);
    setSpokenText('');
    latestSpokenRef.current = '';
    setLiveEval(initialEval);
    setSpeechError('');
  }, []);

  return {
    socketConnected,
    isRecording,
    spokenText,
    setSpokenText,
    liveEval,
    setLiveEval,
    speechError,
    toggleRecording,
    streamText,
    finalizePractice,
    resetLineSpeech,
  };
}
