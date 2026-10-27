import React, { useState, useEffect, useRef } from 'react';
import {
  FiBook,
  FiVolume2,
  FiMic,
  FiCheckCircle,
  FiRefreshCw,
  FiSearch,
  FiLayers,
  FiAward,
  FiArrowRight,
  FiArrowLeft,
  FiStar,
  FiHelpCircle,
  FiEdit3,
  FiEye,
  FiCheck,
  FiX,
} from 'react-icons/fi';
import {
  vocabularyService,
  FALLBACK_VOCAB_TOPICS,
  FALLBACK_VOCABULARIES,
} from '../api/vocabulary.service';
import Button from '../components/common/Button';

/**
 * Trang Học Từ Vựng Theo Bộ Chủ Đề (VocabularyScreen.jsx)
 * Bao gồm 4 chế độ cho từng Bộ Chủ đề (Topic):
 * 1. Danh sách & Luyện Phát âm AI
 * 2. Thẻ lật Flashcard 3D
 * 3. Ghi chép Chính tả (Dictation / Spelling) của bộ Topic đó
 * 4. Trắc nghiệm Ôn tập (Quiz) của bộ Topic đó
 */
export default function VocabularyScreen({
  user,
  onStartPractice,
  onRequireAuth,
  initialTopic = null,
}) {
  const [topics, setTopics] = useState(FALLBACK_VOCAB_TOPICS);
  const [vocabList, setVocabList] = useState(FALLBACK_VOCABULARIES);
  const [loading, setLoading] = useState(true);

  // 'flashcard' | 'list' | 'dictation' | 'quiz'
  const [studyMode, setStudyMode] = useState('flashcard');
  const [selectedTopic, setSelectedTopic] = useState(initialTopic || null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (initialTopic) {
      setSelectedTopic(initialTopic);
    }
  }, [initialTopic]);

  // Danh sách ID các từ đã thuộc (lưu localStorage)
  const [masteredIds, setMasteredIds] = useState(() => {
    try {
      const saved = localStorage.getItem('speakai_mastered_vocab');
      return saved ? JSON.parse(saved) : [1, 4];
    } catch {
      return [1, 4];
    }
  });

  // Danh sách ID các từ đánh dấu "Chưa thuộc / Cần ôn lại"
  const [unmasteredIds, setUnmasteredIds] = useState(() => {
    try {
      const saved = localStorage.getItem('speakai_unmastered_vocab');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Luyện phát âm từng từ bằng Microphone
  const [recordingId, setRecordingId] = useState(null);
  const [wordScores, setWordScores] = useState({});
  const recognitionRef = useRef(null);

  // State cho chế độ Flashcard Lật thẻ & AI Đọc Từ Mới
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [flashcardFilter, setFlashcardFilter] = useState('ALL'); // 'ALL' | 'UNMASTERED' | 'MASTERED'
  const [flashcardFinished, setFlashcardFinished] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null); // 'left' (Chưa thuộc) | 'right' (Đã thuộc)
  const [aiVoiceAccent, setAiVoiceAccent] = useState('en-US'); // 'en-US' | 'en-GB'
  const [autoSpeakNewWord, setAutoSpeakNewWord] = useState(true);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  // Dữ liệu phát âm & phiên âm chuẩn từ điển (Oxford / Free Dictionary API) theo từng từ
  const [dictDataByWord, setDictDataByWord] = useState({});
  const audioPlayerRef = useRef(null);

  // ==================== STATE CHO PHẦN GHI CHÉP CHÍNH TẢ (DICTATION) CỦA BỘ TOPIC ====================
  const [dictationMode, setDictationMode] = useState('word'); // 'word' (Chép từ/cụm từ) | 'sentence' (Chép câu ví dụ)
  const [dictationIndex, setDictationIndex] = useState(0);
  const [dictationInput, setDictationInput] = useState('');
  const [dictationResult, setDictationResult] = useState(null); // { isCorrect, accuracy, expected, userTyped }
  const [showDictationHint, setShowDictationHint] = useState(false);
  const [dictationCorrectCount, setDictationCorrectCount] = useState(0);
  const [dictationHistory, setDictationHistory] = useState([]);
  const [dictationFinished, setDictationFinished] = useState(false);

  // ==================== STATE CHO PHẦN TRẮC NGHIỆM (QUIZ) CỦA BỘ TOPIC ====================
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizDetails, setQuizDetails] = useState([]);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    const fetchVocabData = async () => {
      setLoading(true);
      try {
        const [topicRes, vocabRes] = await Promise.all([
          vocabularyService.getTopics(),
          vocabularyService.getVocabularies(),
        ]);
        if (topicRes?.length) setTopics(topicRes);
        if (vocabRes?.length) setVocabList(vocabRes);
      } catch (err) {
        console.error('Lỗi tải dữ liệu từ vựng:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVocabData();
  }, []);

  useEffect(() => {
    localStorage.setItem('speakai_mastered_vocab', JSON.stringify(masteredIds));
  }, [masteredIds]);

  useEffect(() => {
    localStorage.setItem(
      'speakai_unmastered_vocab',
      JSON.stringify(unmasteredIds)
    );
  }, [unmasteredIds]);

  // Danh sách từ vựng của Bộ Topic đang chọn (CHỈ HIỂN THỊ KHI ĐÃ CHỌN CHỦ ĐỀ)
  const topicVocabList = selectedTopic
    ? vocabList.filter((item) => {
        const topicName = item.topic?.name || item.topic || '';
        return (
          item.topicId === selectedTopic ||
          topicName.toLowerCase() === selectedTopic.toLowerCase() ||
          String(item.topicId) === String(selectedTopic)
        );
      })
    : [];

  // Danh sách từ vựng áp dụng thêm ô tìm kiếm (cho chế độ Danh sách)
  const filteredVocab = topicVocabList.filter((item) => {
    return (
      !searchQuery.trim() ||
      item.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.example || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Bộ từ vựng dùng cho Flashcard, Chính tả & Trắc nghiệm của Topic hiện tại
  const activeTopicWords = topicVocabList;

  // Danh sách thẻ Flashcard theo bộ lọc (Tất cả / Chưa thuộc / Đã thuộc)
  const flashcardDeck = React.useMemo(() => {
    if (flashcardFilter === 'UNMASTERED') {
      const list = activeTopicWords.filter((w) => !masteredIds.includes(w.id));
      return list.length > 0 ? list : activeTopicWords;
    }
    if (flashcardFilter === 'MASTERED') {
      const list = activeTopicWords.filter((w) => masteredIds.includes(w.id));
      return list.length > 0 ? list : activeTopicWords;
    }
    return activeTopicWords;
  }, [activeTopicWords, flashcardFilter, masteredIds]);

  // Phân trang danh sách Chủ đề Từ vựng: đúng 11 chủ đề 1 trang theo yêu cầu
  const [topicCurrentPage, setTopicCurrentPage] = useState(1);
  const TOPICS_PER_PAGE = 11;

  const totalTopicPages = Math.max(
    1,
    Math.ceil(topics.length / TOPICS_PER_PAGE)
  );
  const validTopicPage = Math.min(topicCurrentPage, totalTopicPages);
  const startTopicIdx = (validTopicPage - 1) * TOPICS_PER_PAGE;
  const paginatedTopics = topics.slice(
    startTopicIdx,
    startTopicIdx + TOPICS_PER_PAGE
  );

  const activeTopicObj = selectedTopic
    ? topics.find(
        (t) =>
          t.name.toLowerCase() === selectedTopic.toLowerCase() ||
          t.id === selectedTopic ||
          String(t.id) === String(selectedTopic)
      ) || null
    : null;

  // AI Hỗ trợ Đọc Từ Mới / Câu Ví Dụ (Hỗ trợ chọn giọng Anh-Mỹ / Anh-Anh & tốc độ chuẩn / chậm từng âm)
  const speakText = (text, rate = 0.92, langOverride = aiVoiceAccent) => {
    if (!window.speechSynthesis || !text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langOverride || 'en-US';
    utterance.rate = rate;

    // Ưu tiên chọn giọng AI tự nhiên của trình duyệt nếu có
    const voices = window.speechSynthesis.getVoices?.() || [];
    const matchedVoice =
      voices.find(
        (v) =>
          v.lang.includes(utterance.lang) &&
          (v.name.includes('Natural') ||
            v.name.includes('Google') ||
            v.name.includes('Microsoft'))
      ) || voices.find((v) => v.lang.includes(utterance.lang));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onstart = () => setIsAiSpeaking(true);
    utterance.onend = () => setIsAiSpeaking(false);
    utterance.onerror = () => setIsAiSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  // AI Đọc hướng dẫn trọn vẹn 1 từ mới (Đọc chuẩn -> Đọc chậm từng âm -> Đọc câu ví dụ)
  const speakWordWithAiTutor = (vocabItem, e) => {
    e?.stopPropagation();
    if (!window.speechSynthesis || !vocabItem) return;
    window.speechSynthesis.cancel();

    const uFast = new SpeechSynthesisUtterance(vocabItem.word);
    uFast.lang = aiVoiceAccent;
    uFast.rate = 0.95;

    const uSlow = new SpeechSynthesisUtterance(vocabItem.word);
    uSlow.lang = aiVoiceAccent;
    uSlow.rate = 0.58;

    uFast.onstart = () => setIsAiSpeaking(true);
    if (vocabItem.example) {
      const uExample = new SpeechSynthesisUtterance(vocabItem.example);
      uExample.lang = aiVoiceAccent;
      uExample.rate = 0.9;
      uExample.onend = () => setIsAiSpeaking(false);
      uExample.onerror = () => setIsAiSpeaking(false);
      window.speechSynthesis.speak(uFast);
      window.speechSynthesis.speak(uSlow);
      window.speechSynthesis.speak(uExample);
    } else {
      uSlow.onend = () => setIsAiSpeaking(false);
      uSlow.onerror = () => setIsAiSpeaking(false);
      window.speechSynthesis.speak(uFast);
      window.speechSynthesis.speak(uSlow);
    }
  };

  // Phát âm chuẩn theo Từ điển (Ưu tiên phát file MP3 thu âm chuẩn từ điển UK/US, fallback sang SpeechSynthesis chuẩn)
  const playDictionaryPronunciation = (
    vocabItem,
    accent = 'uk',
    rate = 0.92,
    e
  ) => {
    e?.stopPropagation();
    if (!vocabItem) return;

    const wordKey = vocabItem.word.toLowerCase().trim();
    const cachedDict = dictDataByWord[wordKey];
    const audioUrl =
      accent === 'uk'
        ? cachedDict?.ukAudio || cachedDict?.anyAudio
        : cachedDict?.usAudio || cachedDict?.anyAudio;

    // Nếu có file MP3 thu âm từ điển và đọc tốc độ chuẩn (rate >= 0.85) -> Phát MP3 chuẩn từ điển
    if (audioUrl && rate >= 0.85) {
      try {
        if (audioPlayerRef.current) {
          audioPlayerRef.current.pause();
        }
        window.speechSynthesis?.cancel();
        const audio = new Audio(audioUrl);
        audio.playbackRate = rate;
        audioPlayerRef.current = audio;
        setIsAiSpeaking(true);
        audio.onended = () => setIsAiSpeaking(false);
        audio.onerror = () => {
          setIsAiSpeaking(false);
          speakText(
            vocabItem.word,
            rate,
            accent === 'uk' ? 'en-GB' : 'en-US'
          );
        };
        audio.play().catch(() => {
          speakText(
            vocabItem.word,
            rate,
            accent === 'uk' ? 'en-GB' : 'en-US'
          );
        });
        return;
      } catch {
        // Fallback bên dưới
      }
    }

    speakText(vocabItem.word, rate, accent === 'uk' ? 'en-GB' : 'en-US');
  };

  // Phân tích trọng âm & âm tiết từ IPA để hiển thị hướng dẫn nhấn âm chuẩn từ điển
  const getStressGuide = (vocabItem) => {
    if (!vocabItem) return '';
    const ipa = vocabItem.ipa || '';
    const word = vocabItem.word || '';
    if (ipa.includes('ˈ')) {
      return `Nhấn trọng âm chính vào âm tiết ngay sau dấu (ˈ) trong ${ipa}`;
    }
    const words = word.split(/\s+/);
    if (words.length > 1) {
      return `Cụm từ (${words.length} từ) — Nhấn rõ trọng âm ở danh từ/động từ chính`;
    }
    return `Phát âm rõ âm cuối theo phiên âm từ điển ${ipa}`;
  };

  // Lật thẻ Flashcard + Tự động phát âm đúng chuẩn theo Từ điển ngay khi lật thẻ
  const handleFlipCard = () => {
    const nextFlipped = !isFlipped;
    setIsFlipped(nextFlipped);

    const activeCard =
      flashcardDeck[cardIndex % Math.max(1, flashcardDeck.length)] ||
      vocabList[0];

    if (activeCard) {
      const accentKey = aiVoiceAccent === 'en-GB' ? 'uk' : 'us';
      playDictionaryPronunciation(activeCard, accentKey, 0.94);
    }
  };
  // Đánh dấu Đã thuộc / Chưa thuộc ở chế độ Danh sách
  const toggleMastered = (id) => {
    setMasteredIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Xử lý bấm nút "Đã thuộc" hoặc "Chưa thuộc" trên thẻ Flashcard để tự động sang từ tiếp theo
  const handleFlashcardDecision = (status) => {
    const currentItem =
      flashcardDeck[cardIndex % Math.max(1, flashcardDeck.length)];
    if (!currentItem) return;

    if (status === 'mastered') {
      setSwipeDirection('right');
      setMasteredIds((prev) =>
        prev.includes(currentItem.id) ? prev : [...prev, currentItem.id]
      );
      setUnmasteredIds((prev) => prev.filter((id) => id !== currentItem.id));
    } else {
      setSwipeDirection('left');
      setUnmasteredIds((prev) =>
        prev.includes(currentItem.id) ? prev : [...prev, currentItem.id]
      );
      setMasteredIds((prev) => prev.filter((id) => id !== currentItem.id));
    }

    setTimeout(() => {
      setSwipeDirection(null);
      setIsFlipped(false);

      if (cardIndex + 1 >= flashcardDeck.length) {
        setFlashcardFinished(true);
      } else {
        const nextIdx = cardIndex + 1;
        setCardIndex(nextIdx);
        const nextWord = flashcardDeck[nextIdx];
        if (autoSpeakNewWord && nextWord) {
          setTimeout(() => speakText(nextWord.word, 0.92), 180);
        }
      }
    }, 240);
  };

  const resetFlashcardSession = (filterMode = 'ALL') => {
    setFlashcardFilter(filterMode);
    setCardIndex(0);
    setIsFlipped(false);
    setFlashcardFinished(false);
  };

  // Reset bài Chính tả khi đổi Topic
  const resetDictation = () => {
    setDictationIndex(0);
    setDictationInput('');
    setDictationResult(null);
    setShowDictationHint(false);
    setDictationCorrectCount(0);
    setDictationHistory([]);
    setDictationFinished(false);
  };

  // Reset bài Trắc nghiệm khi đổi Topic
  const handleResetQuiz = () => {
    setQuizIndex(0);
    setSelectedAnswer(null);
    setQuizScore(0);
    setQuizDetails([]);
    setQuizFinished(false);
  };

  // Chọn nhanh Chủ đề + Chế độ học (Học từ / Chính tả / Trắc nghiệm)
  const handleSelectTopicAndMode = (topicName, mode = studyMode) => {
    if (!user) {
      onRequireAuth?.('Vui lòng đăng nhập để bắt đầu học bộ từ vựng này!', {
        type: 'vocab',
        topicName,
        mode,
      });
      return;
    }
    setSelectedTopic(topicName);
    setStudyMode(mode);
    setCardIndex(0);
    setIsFlipped(false);
    setFlashcardFinished(false);
    resetDictation();
    handleResetQuiz();
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      // ignore
    }
  };

  // Chấm điểm phát âm trực tiếp từng từ vựng qua Microphone
  const handlePracticeWord = (vocabItem) => {
    if (!user) {
      onRequireAuth?.('Vui lòng đăng nhập để luyện phát âm từ vựng!');
      return;
    }
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      const simulatedScore = 92;
      setWordScores((prev) => ({
        ...prev,
        [vocabItem.id]: {
          score: simulatedScore,
          spoken: vocabItem.word,
        },
      }));
      if (!masteredIds.includes(vocabItem.id)) {
        toggleMastered(vocabItem.id);
      }
      return;
    }

    if (recordingId === vocabItem.id) {
      recognitionRef.current?.stop();
      setRecordingId(null);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setRecordingId(vocabItem.id);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim();
      const cleanTarget = vocabItem.word.toLowerCase().replace(/[^a-z\s]/g, '');
      const cleanSpoken = transcript.toLowerCase().replace(/[^a-z\s]/g, '');

      let score = 65;
      if (cleanSpoken === cleanTarget || cleanSpoken.includes(cleanTarget)) {
        score = 96;
      } else {
        const targetWords = cleanTarget.split(/\s+/);
        const matched = targetWords.filter((w) => cleanSpoken.includes(w));
        score = Math.max(
          55,
          Math.round((matched.length / targetWords.length) * 95)
        );
      }

      setWordScores((prev) => ({
        ...prev,
        [vocabItem.id]: {
          score,
          spoken: transcript,
        },
      }));

      if (score >= 85 && !masteredIds.includes(vocabItem.id)) {
        setMasteredIds((prev) => [...prev, vocabItem.id]);
      }
      setRecordingId(null);
    };

    recognition.onerror = () => setRecordingId(null);
    recognition.onend = () => setRecordingId(null);

    recognitionRef.current = recognition;
    recognition.start();
  };

  // Xử lý danh sách từ đồng nghĩa
  const parseSynonyms = (synonymsField) => {
    if (!synonymsField) return [];
    if (Array.isArray(synonymsField)) return synonymsField;
    return String(synonymsField)
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  };

  // ==================== XỬ LÝ GHI CHÉP CHÍNH TẢ (DICTATION) CỦA BỘ TOPIC ====================
  const currentDictationItem =
    activeTopicWords[dictationIndex % Math.max(1, activeTopicWords.length)] ||
    FALLBACK_VOCABULARIES[0];

  const targetDictationText =
    dictationMode === 'sentence' && currentDictationItem?.example
      ? currentDictationItem.example
      : currentDictationItem?.word || '';

  // Gợi ý che bớt ký tự (VD: M _ _ o r   i _)
  const getMaskedHint = (text) => {
    return text
      .split(' ')
      .map((word) => {
        if (word.length <= 2) return word[0] + '_';
        return (
          word[0] +
          ' ' +
          Array(word.length - 2)
            .fill('_')
            .join(' ') +
          ' ' +
          word[word.length - 1]
        );
      })
      .join('   ');
  };

  const handleCheckDictation = (e) => {
    e?.preventDefault();
    if (!dictationInput.trim() || dictationResult) return;

    const cleanExpected = targetDictationText
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    const cleanTyped = dictationInput
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    const isExact = cleanTyped === cleanExpected;

    // Tính độ khớp từng từ
    const expectedWords = cleanExpected.split(' ');
    const typedWords = cleanTyped.split(' ');
    const matchedWords = expectedWords.filter((w, i) => typedWords[i] === w);
    const accuracy = isExact
      ? 100
      : Math.round((matchedWords.length / expectedWords.length) * 100);

    const isCorrect = isExact || accuracy >= 85;
    if (isCorrect) {
      setDictationCorrectCount((c) => c + 1);
      if (!masteredIds.includes(currentDictationItem.id)) {
        setMasteredIds((prev) => [...prev, currentDictationItem.id]);
      }
    }

    const resultEntry = {
      id: currentDictationItem.id,
      word: currentDictationItem.word,
      meaning: currentDictationItem.meaning,
      expected: targetDictationText,
      userTyped: dictationInput.trim(),
      isCorrect,
      accuracy,
    };

    setDictationResult(resultEntry);
    setDictationHistory((prev) => [...prev, resultEntry]);
    speakText(targetDictationText, 0.95);
  };

  const handleNextDictation = async () => {
    if (dictationIndex + 1 >= activeTopicWords.length) {
      setDictationFinished(true);
      const total = activeTopicWords.length;
      const finalScore = Math.round((dictationCorrectCount / total) * 100);
      if (activeTopicObj?.id) {
        await vocabularyService.submitPractice({
          topicId: activeTopicObj.id,
          practiceType: 'DICTATION',
          score: finalScore,
          correctCount: dictationCorrectCount,
          totalQuestions: total,
          details: dictationHistory,
        });
      }
    } else {
      const nextIdx = dictationIndex + 1;
      setDictationIndex(nextIdx);
      setDictationInput('');
      setDictationResult(null);
      setShowDictationHint(false);
      const nextItem = activeTopicWords[nextIdx];
      if (nextItem) {
        setTimeout(() => {
          speakText(
            dictationMode === 'sentence' && nextItem.example
              ? nextItem.example
              : nextItem.word
          );
        }, 250);
      }
    }
  };

  // ==================== XỬ LÝ TRẮC NGHIỆM (QUIZ) CỦA BỘ TOPIC ====================
  const currentQuizItem =
    activeTopicWords[quizIndex % Math.max(1, activeTopicWords.length)] ||
    FALLBACK_VOCABULARIES[0];

  const quizOptions = React.useMemo(() => {
    // Lấy các phương án nhiễu từ cùng bộ Topic hoặc toàn bộ kho từ
    const pool =
      activeTopicWords.length >= 4 ? activeTopicWords : vocabList;
    const others = pool
      .filter((item) => item.id !== currentQuizItem.id)
      .slice(0, 3)
      .map((item) => item.meaning);
    const all = [currentQuizItem.meaning, ...others];
    return all.sort((a, b) => a.localeCompare(b));
  }, [quizIndex, currentQuizItem, activeTopicWords, vocabList]);

  const handleAnswerQuiz = (option) => {
    if (selectedAnswer) return;
    setSelectedAnswer(option);
    const isCorrect = option === currentQuizItem.meaning;
    if (isCorrect) {
      setQuizScore((s) => s + 1);
      speakText(currentQuizItem.word);
    }
    setQuizDetails((prev) => [
      ...prev,
      {
        word: currentQuizItem.word,
        meaning: currentQuizItem.meaning,
        chosen: option,
        isCorrect,
      },
    ]);
  };

  const handleNextQuiz = async () => {
    if (quizIndex + 1 >= activeTopicWords.length) {
      setQuizFinished(true);
      const total = activeTopicWords.length;
      const finalScore = Math.round((quizScore / total) * 100);
      if (activeTopicObj?.id) {
        await vocabularyService.submitPractice({
          topicId: activeTopicObj.id,
          practiceType: 'QUIZ',
          score: finalScore,
          correctCount: quizScore,
          totalQuestions: total,
          details: quizDetails,
        });
      }
    } else {
      setQuizIndex((i) => i + 1);
      setSelectedAnswer(null);
    }
  };

  const currentFlashcard =
    flashcardDeck[cardIndex % Math.max(1, flashcardDeck.length)] ||
    vocabList[0];

  // Tự động tra cứu phiên âm & file âm thanh MP3 chuẩn từ điển Quốc tế (Oxford / Free Dictionary API) cho thẻ hiện tại
  useEffect(() => {
    if (!currentFlashcard?.word) return;
    const rawWord = currentFlashcard.word.toLowerCase().trim();
    if (dictDataByWord[rawWord]) return;

    // Nếu là cụm nhiều từ thì lấy từ chính (dài nhất) hoặc từ đầu tiên để tra từ điển
    const headWord = rawWord.includes(' ')
      ? rawWord
          .split(/\s+/)
          .sort((a, b) => b.length - a.length)[0]
          .replace(/[^a-z]/g, '')
      : rawWord.replace(/[^a-z-]/g, '');

    if (!headWord) return;

    let isCancelled = false;
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${headWord}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isCancelled || !Array.isArray(data) || !data[0]) return;
        const entry = data[0];
        const phonetics = entry.phonetics || [];
        const ukPhonetic = phonetics.find(
          (p) => p.audio && p.audio.includes('-uk')
        );
        const usPhonetic = phonetics.find(
          (p) => p.audio && p.audio.includes('-us')
        );
        const anyAudioPhonetic = phonetics.find((p) => p.audio);
        const defaultIpa =
          entry.phonetic ||
          phonetics.find((p) => p.text)?.text ||
          currentFlashcard.ipa;
        const englishDef =
          entry.meanings?.[0]?.definitions?.[0]?.definition || '';

        setDictDataByWord((prev) => ({
          ...prev,
          [rawWord]: {
            headWord,
            ukIpa: ukPhonetic?.text || defaultIpa || currentFlashcard.ipa,
            usIpa: usPhonetic?.text || defaultIpa || currentFlashcard.ipa,
            ukAudio: ukPhonetic?.audio || '',
            usAudio: usPhonetic?.audio || '',
            anyAudio: anyAudioPhonetic?.audio || '',
            englishDef,
          },
        }));
      })
      .catch(() => {
        // Fallback dùng IPA có sẵn trong database
      });

    return () => {
      isCancelled = true;
    };
  }, [currentFlashcard?.word]);

  const currentDictInfo =
    dictDataByWord[currentFlashcard?.word?.toLowerCase()?.trim()] || null;

  const unmasteredInTopicCount = activeTopicWords.filter(
    (w) => !masteredIds.includes(w.id)
  ).length;
  const masteredInTopicCount = activeTopicWords.filter((w) =>
    masteredIds.includes(w.id)
  ).length;

  return (
    <section
      className="lexispeak-window-frame animate-page-enter"
      style={{ marginTop: '2rem' }}
    >
      {/* THANH TIÊU ĐỀ CỬA SỔ TỪ VỰNG */}
      <div className="lexispeak-window-topbar">
        <div className="lexispeak-brand-group">
          <span className="lexispeak-title">SpeakAI</span>
          <span className="lexispeak-slash">/</span>
          <span className="lexispeak-tagline">
            Học Từ Vựng, Ghi Chép Chính Tả &amp; Trắc Nghiệm Theo Chủ Đề
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
          <Button variant="outline" onClick={() => onStartPractice?.(1)}>
            <FiMic className="react-icon" /> Áp dụng vào Phòng Luyện Nói
          </Button>
        </div>
      </div>

      <div className="lexispeak-window-body">
        {loading ? (
          <div className="loading-state">Đang tải kho từ vựng từ hệ thống...</div>
        ) : !selectedTopic ? (
          /* ==================== TRANG 1: DANH SÁCH 24 CHỦ ĐỀ TỪ VỰNG (TOPIC CATALOG) ==================== */
          <div className="vocab-catalog-page animate-page-enter">
            {/* HERO BANNER KHO CHỦ ĐỀ */}
            <div className="vocab-catalog-hero">
              <div className="lexi-powered-pill" style={{ margin: '0 0 0.85rem 0' }}>
                <FiLayers className="react-icon" />
                <span>KHO CHỦ ĐỀ TỪ VỰNG TIẾNG ANH</span>
                <span>|</span>
                <span>24 CHỦ ĐỀ CHUẨN IELTS & GIAO TIẾP</span>
              </div>

              <h2>Khám phá các Chủ đề Từ vựng (B1 – C2)</h2>
              <p>
                Chọn một chủ đề bất kỳ bên dưới để chuyển sang <b>Trang học từ vựng riêng biệt</b> với Thẻ lật Flashcard 3D, Luyện phát âm AI, Ghi chép chính tả và Trắc nghiệm ôn tập.
              </p>

              {/* THỐNG KÊ TIẾN ĐỘ 3 THẺ */}
              <div className="vocab-catalog-stats-row">
                <div className="vocab-stat-box">
                  <span className="vocab-stat-num">{topics.length}</span>
                  <span className="vocab-stat-label">Chủ đề học thuật &amp; đời sống</span>
                </div>
                <div className="vocab-stat-box">
                  <span className="vocab-stat-num">{vocabList.length}</span>
                  <span className="vocab-stat-label">Từ vựng &amp; Cụm từ chuyên sâu</span>
                </div>
                <div className="vocab-stat-box">
                  <span className="vocab-stat-num highlighted">
                    {vocabList.length > 0
                      ? Math.round(
                          (masteredIds.length / vocabList.length) * 100
                        )
                      : 0}
                    %
                  </span>
                  <span className="vocab-stat-label">Tiến độ từ vựng đã thuộc</span>
                </div>
              </div>
            </div>

            {/* GRID DANH SÁCH CHỦ ĐỀ HÀNG DỌC (PHÂN TRANG 11 CHỦ ĐỀ / TRANG) */}
            <div className="vocab-catalog-grid">
              {paginatedTopics.map((t, idx) => {
                const topicWords = vocabList.filter(
                  (v) =>
                    v.topicId === t.id ||
                    v.topic?.name === t.name ||
                    String(v.topicId) === String(t.id)
                );
                const wordCount = t._count?.vocabularies ?? topicWords.length;
                const masteredInThisTopic = topicWords.filter((w) =>
                  masteredIds.includes(w.id)
                ).length;
                const progressPercent =
                  wordCount > 0
                    ? Math.round((masteredInThisTopic / wordCount) * 100)
                    : 0;

                return (
                  <div
                    key={t.id}
                    className="vocab-catalog-card animate-card-up"
                    style={{ animationDelay: `${idx * 0.02}s` }}
                    onClick={() => handleSelectTopicAndMode(t.name, 'flashcard')}
                  >
                    <div className="vocab-catalog-img-wrap">
                      <img
                        src={
                          t.imageUrl ||
                          'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80'
                        }
                        alt={t.name}
                        loading="lazy"
                      />
                      <span
                        className={`vocab-catalog-level-pill level-${(
                          t.level || 'B1'
                        ).toLowerCase()}`}
                      >
                        Level {t.level || 'B1'}
                      </span>
                      <span className="vocab-catalog-count-pill">
                        {wordCount} từ
                      </span>
                    </div>

                    <div className="vocab-catalog-content">
                      <div className="vocab-catalog-header-row">
                        <h3 className="vocab-catalog-title">{t.name}</h3>
                        <span
                          className={`badge-level level-${(
                            t.level || 'A1'
                          ).toLowerCase()}`}
                        >
                          Level {t.level || 'A1'}
                        </span>
                        <span
                          style={{
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            color: '#0f766e',
                          }}
                        >
                          • {wordCount} từ vựng
                        </span>
                      </div>
                      <p className="vocab-catalog-desc">{t.description}</p>

                      <div className="vocab-catalog-progress">
                        <div className="progress-labels">
                          <span>Tiến độ</span>
                          <span>{progressPercent}%</span>
                        </div>
                        <div className="progress-bar-track">
                          <div
                            className="progress-bar-fill"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="vocab-catalog-cta-wrap">
                      <button
                        type="button"
                        className="btn-enter-topic"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectTopicAndMode(t.name, 'flashcard');
                        }}
                      >
                        Vào học chủ đề này <FiArrowRight className="react-icon" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* THANH PHÂN TRANG: 11 CHỦ ĐỀ / TRANG */}
            {totalTopicPages > 1 && (
              <div className="speakai-pagination-wrap animate-card-up">
                <div className="pagination-info">
                  Hiển thị <b>{startTopicIdx + 1}</b> –{' '}
                  <b>
                    {Math.min(
                      startTopicIdx + TOPICS_PER_PAGE,
                      topics.length
                    )}
                  </b>{' '}
                  trên tổng số <b>{topics.length}</b> chủ đề
                </div>

                <div className="speakai-pagination">
                  <button
                    type="button"
                    className="pagination-btn"
                    disabled={validTopicPage <= 1}
                    onClick={() => {
                      setTopicCurrentPage((p) => Math.max(1, p - 1));
                      window.scrollTo({ top: 320, behavior: 'smooth' });
                    }}
                  >
                    <FiArrowLeft className="react-icon" /> Trang trước
                  </button>

                  <div className="pagination-numbers">
                    {Array.from({ length: totalTopicPages }, (_, i) => i + 1).map(
                      (num) => (
                        <button
                          key={num}
                          type="button"
                          className={`pagination-number ${
                            validTopicPage === num ? 'active' : ''
                          }`}
                          onClick={() => {
                            setTopicCurrentPage(num);
                            window.scrollTo({ top: 320, behavior: 'smooth' });
                          }}
                        >
                          {num}
                        </button>
                      )
                    )}
                  </div>

                  <button
                    type="button"
                    className="pagination-btn"
                    disabled={validTopicPage >= totalTopicPages}
                    onClick={() => {
                      setTopicCurrentPage((p) =>
                        Math.min(totalTopicPages, p + 1)
                      );
                      window.scrollTo({ top: 320, behavior: 'smooth' });
                    }}
                  >
                    Trang sau <FiArrowRight className="react-icon" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ==================== TRANG 2: TRANG HỌC CHI TIẾT CỦA BỘ TOPIC ĐÃ CHỌN ==================== */
          <div className="vocab-topic-study-page animate-page-enter">
            {/* THANH ĐIỀU HƯỚNG QUAY LẠI TRANG DANH SÁCH CHỦ ĐỀ */}
            <div className="vocab-study-top-nav animate-card-up">
              <div className="top-nav-left">
                <button
                  type="button"
                  className="btn-back-to-catalog"
                  onClick={() => setSelectedTopic(null)}
                >
                  <FiArrowLeft className="react-icon" /> Quay lại danh sách Chủ đề
                </button>

                <div className="vocab-breadcrumbs">
                  <span
                    className="crumb-root"
                    onClick={() => setSelectedTopic(null)}
                  >
                    Kho Chủ Đề
                  </span>
                  <span className="crumb-sep">/</span>
                  <span className="crumb-current">
                    {activeTopicObj?.name || selectedTopic}
                  </span>
                </div>
              </div>
            </div>

            {/* HERO BANNER CHO RIÊNG CHỦ ĐỀ ĐANG HỌC */}
            <div className="vocab-study-topic-hero animate-card-up">
              <div className="topic-hero-thumb">
                <img
                  src={
                    activeTopicObj?.imageUrl ||
                    'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80'
                  }
                  alt={activeTopicObj?.name || selectedTopic}
                />
                <span className="badge-level">
                  Level {activeTopicObj?.level || 'B1'}
                </span>
              </div>

              <div className="topic-hero-info">
                <div className="topic-hero-header">
                  <h2>{activeTopicObj?.name || selectedTopic}</h2>
                  <span className="topic-total-words">
                    ({activeTopicWords.length} từ vựng)
                  </span>
                </div>
                <p className="topic-hero-desc">
                  {activeTopicObj?.description ||
                    'Học và ghi nhớ bộ từ vựng chuyên sâu theo chủ đề này.'}
                </p>

                <div className="topic-hero-progress-box">
                  <div className="progress-text-row">
                    <span>Tiến độ hoàn thành</span>
                    <span className="progress-percent">
                      {activeTopicWords.length > 0
                        ? Math.round(
                            (masteredInTopicCount /
                              activeTopicWords.length) *
                              100
                          )
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="progress-bar-track">
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${
                          activeTopicWords.length > 0
                            ? Math.round(
                                (masteredInTopicCount /
                                  activeTopicWords.length) *
                                  100
                              )
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* THANH CHỌN 4 CHẾ ĐỘ HỌC CỦA RIÊNG BỘ TOPIC NÀY */}
            <div className="sub-tabs" style={{ marginBottom: '1.35rem' }}>
              <button
                className={studyMode === 'flashcard' ? 'active' : ''}
                onClick={() => {
                  setStudyMode('flashcard');
                  setCardIndex(0);
                  setIsFlipped(false);
                  setFlashcardFinished(false);
                }}
              >
                <FiLayers className="react-icon" /> Lật thẻ Từ mới ({activeTopicWords.length})
              </button>
              <button
                className={studyMode === 'list' ? 'active' : ''}
                onClick={() => setStudyMode('list')}
              >
                <FiBook className="react-icon" /> Danh sách &amp; Phát âm
              </button>
              <button
                className={studyMode === 'dictation' ? 'active' : ''}
                onClick={() => {
                  setStudyMode('dictation');
                  resetDictation();
                }}
              >
                <FiEdit3 className="react-icon" /> Ghi chép Chính tả ({activeTopicWords.length})
              </button>
              <button
                className={studyMode === 'quiz' ? 'active' : ''}
                onClick={() => {
                  setStudyMode('quiz');
                  handleResetQuiz();
                }}
              >
                <FiHelpCircle className="react-icon" /> Trắc nghiệm Topic ({activeTopicWords.length})
              </button>
            </div>
            {/* ==================== CHẾ ĐỘ 1: DANH SÁCH TỪ VỰNG & LUYỆN PHÁT ÂM AI ==================== */}
            {studyMode === 'list' && (
              <>
                <div className="filter-bar" style={{ marginBottom: '1.35rem' }}>
                  <div className="search-form">
                    <input
                      type="text"
                      placeholder="Tìm kiếm từ vựng tiếng Anh, nghĩa tiếng Việt hoặc câu mẫu..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button type="button">
                      <FiSearch className="react-icon" /> Tìm từ
                    </Button>
                  </div>
                </div>

                <div className="vocab-cards-grid">
                  {filteredVocab.map((item, idx) => {
                    const isMastered = masteredIds.includes(item.id);
                    const isRecording = recordingId === item.id;
                    const scoreObj = wordScores[item.id];
                    const topicLabel =
                      item.topic?.name || item.topic || 'General';
                    const synonymsList = parseSynonyms(item.synonyms);

                    return (
                      <div
                        key={item.id}
                        className={`vocab-item-card animate-card-up ${
                          isMastered ? 'mastered' : ''
                        }`}
                        style={{ animationDelay: `${idx * 0.05}s` }}
                      >
                        <div className="vocab-card-header">
                          <div className="vocab-tags-row">
                            <span className="badge-level">
                              Level {item.level || item.band || 'B1'}
                            </span>
                            <span className="vocab-topic-tag">
                              {topicLabel}
                            </span>
                            <span className="vocab-pos-tag">{item.pos}</span>
                          </div>

                          <button
                            type="button"
                            className={`vocab-master-btn ${
                              isMastered ? 'active' : ''
                            }`}
                            onClick={() => toggleMastered(item.id)}
                            title="Đánh dấu đã thuộc từ này"
                          >
                            <FiCheckCircle className="react-icon" />
                            {isMastered ? 'Đã thuộc' : 'Chưa thuộc'}
                          </button>
                        </div>

                        <div className="vocab-word-main">
                          <div>
                            <h3 className="vocab-word-title">{item.word}</h3>
                            <span className="vocab-ipa-text">{item.ipa}</span>
                          </div>

                          <button
                            type="button"
                            className="vocab-audio-circle"
                            onClick={() => speakText(item.word)}
                            title="Nghe phát âm chuẩn"
                          >
                            <FiVolume2 />
                          </button>
                        </div>

                        <div className="vocab-meaning-box">
                          <strong>Nghĩa:</strong> {item.meaning}
                        </div>

                        {synonymsList.length > 0 && (
                          <div className="vocab-synonyms-row">
                            <span>Đồng nghĩa:</span>
                            {synonymsList.map((syn) => (
                              <span key={syn} className="synonym-pill">
                                {syn}
                              </span>
                            ))}
                          </div>
                        )}

                        {item.example && (
                          <div className="vocab-example-box">
                            <div className="vocab-example-en">
                              “{item.example}”
                              <button
                                type="button"
                                className="btn-listen-inline"
                                onClick={() => speakText(item.example, 0.95)}
                                title="Nghe cả câu ví dụ"
                              >
                                <FiVolume2 /> Nghe câu
                              </button>
                            </div>
                            <div className="vocab-example-vi">
                              {item.exampleTrans}
                            </div>
                          </div>
                        )}

                        <div className="vocab-practice-footer">
                          <button
                            type="button"
                            className={`btn-vocab-mic ${
                              isRecording ? 'recording' : ''
                            }`}
                            onClick={() => handlePracticeWord(item)}
                          >
                            <FiMic className="react-icon" />
                            {isRecording
                              ? 'Đang nghe bạn đọc...'
                              : 'Luyện đọc từ này với AI'}
                          </button>

                          {scoreObj && (
                            <div className="vocab-score-badge">
                              <FiAward className="react-icon" />{' '}
                              {scoreObj.score}% chuẩn
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* ==================== CHẾ ĐỘ 2: LẬT THẺ TỪ MỚI (FLASHCARD 3D + AI ĐỌC TỪ MỚI + ĐÃ THUỘC / CHƯA THUỘC) ==================== */}
            {studyMode === 'flashcard' && currentFlashcard && (
              <div className="flashcard-stage-container animate-card-up">
                {/* Thanh công cụ AI Hỗ trợ Đọc Từ Mới & Bộ lọc Đã thuộc / Chưa thuộc */}
                <div className="flashcard-ai-toolbar">
                  <div className="flashcard-filter-pills">
                    <button
                      type="button"
                      className={flashcardFilter === 'ALL' ? 'active' : ''}
                      onClick={() => resetFlashcardSession('ALL')}
                    >
                      Tất cả ({activeTopicWords.length})
                    </button>
                    <button
                      type="button"
                      className={
                        flashcardFilter === 'UNMASTERED' ? 'active warning' : ''
                      }
                      onClick={() => resetFlashcardSession('UNMASTERED')}
                    >
                      Chưa thuộc ({unmasteredInTopicCount})
                    </button>
                    <button
                      type="button"
                      className={
                        flashcardFilter === 'MASTERED' ? 'active success' : ''
                      }
                      onClick={() => resetFlashcardSession('MASTERED')}
                    >
                      Đã thuộc ({masteredInTopicCount})
                    </button>
                  </div>

                  <div className="flashcard-ai-voice-settings">
                    <div className="voice-accent-switch">
                      <button
                        type="button"
                        className={aiVoiceAccent === 'en-US' ? 'active' : ''}
                        onClick={() => setAiVoiceAccent('en-US')}
                      >
                        🇺🇸 AI Mỹ (US)
                      </button>
                      <button
                        type="button"
                        className={aiVoiceAccent === 'en-GB' ? 'active' : ''}
                        onClick={() => setAiVoiceAccent('en-GB')}
                      >
                        🇬🇧 AI Anh (UK)
                      </button>
                    </div>

                    <label className="auto-speak-checkbox">
                      <input
                        type="checkbox"
                        checked={autoSpeakNewWord}
                        onChange={(e) => setAutoSpeakNewWord(e.target.checked)}
                      />
                      AI tự đọc khi sang từ mới
                    </label>
                  </div>
                </div>

                {flashcardFinished ? (
                  <div className="quiz-result-card">
                    <FiAward style={{ fontSize: '3.2rem', color: '#00897b' }} />
                    <h2>
                      Hoàn thành lượt lật thẻ Chủ đề:{' '}
                      {selectedTopic === 'ALL' ? 'Tổng hợp' : selectedTopic}
                    </h2>
                    <p>
                      Trong chủ đề này bạn đã thuộc{' '}
                      <strong style={{ color: '#00897b', fontSize: '1.2rem' }}>
                        {masteredInTopicCount} / {activeTopicWords.length}
                      </strong>{' '}
                      từ vựng • Còn{' '}
                      <strong style={{ color: '#ea580c', fontSize: '1.2rem' }}>
                        {unmasteredInTopicCount}
                      </strong>{' '}
                      từ chưa thuộc.
                    </p>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '0.85rem',
                        marginTop: '1.35rem',
                        flexWrap: 'wrap',
                      }}
                    >
                      {unmasteredInTopicCount > 0 && (
                        <Button
                          onClick={() => resetFlashcardSession('UNMASTERED')}
                        >
                          <FiRefreshCw className="react-icon" /> Ôn lại{' '}
                          {unmasteredInTopicCount} từ Chưa thuộc
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        onClick={() => resetFlashcardSession('ALL')}
                      >
                        <FiLayers className="react-icon" /> Lật lại toàn bộ thẻ
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setStudyMode('dictation');
                          resetDictation();
                        }}
                      >
                        <FiEdit3 className="react-icon" /> Luyện Chính tả Topic này
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedTopic(null)}
                      >
                        <FiArrowLeft className="react-icon" /> Chọn Chủ đề khác
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flashcard-progress-text">
                      Từ số <b>{(cardIndex % flashcardDeck.length) + 1}</b> /{' '}
                      <b>{flashcardDeck.length}</b> • Chủ đề:{' '}
                      <b>
                        {currentFlashcard.topic?.name ||
                          currentFlashcard.topic ||
                          'IELTS'}
                      </b>
                    </div>

                    {/* THẺ LẬT 3D CHÍNH */}
                    <div
                      className={`flashcard-3d-box ${
                        isFlipped ? 'flipped' : ''
                      } ${
                        swipeDirection === 'right'
                          ? 'swipe-right-anim'
                          : swipeDirection === 'left'
                          ? 'swipe-left-anim'
                          : ''
                      }`}
                      onClick={handleFlipCard}
                    >
                      {!isFlipped ? (
                        <div className="flashcard-face front">
                          <div className="flashcard-top-badges">
                            <span className="badge-level">
                              Level{' '}
                              {currentFlashcard.level ||
                                currentFlashcard.band ||
                                'B1'}
                            </span>
                            <span className="vocab-pos-tag">
                              {currentFlashcard.pos}
                            </span>
                            <span
                              className={`flashcard-status-pill ${
                                masteredIds.includes(currentFlashcard.id)
                                  ? 'mastered'
                                  : 'learning'
                              }`}
                            >
                              {masteredIds.includes(currentFlashcard.id)
                                ? '✓ Đã thuộc'
                                : '● Chưa thuộc'}
                            </span>
                          </div>

                          <h2 className="flashcard-big-word">
                            {currentFlashcard.word}
                          </h2>
                          <p className="flashcard-big-ipa">
                            {currentFlashcard.ipa}
                          </p>

                          <span className="flashcard-flip-hint">
                            <FiRefreshCw className="react-icon" /> Chạm vào thẻ để lật &amp; nghe phát âm chuẩn từ điển
                          </span>
                        </div>
                      ) : (
                        <div className="flashcard-face back horizontal-card-layout">
                          <div className="flashcard-horizontal-split">
                            {/* CỘT TRÁI: TỪ VỰNG, PHIÊN ÂM TỪ ĐIỂN & NGHĨA */}
                            <div className="flashcard-split-col left">
                              <div className="flashcard-top-badges">
                                <span className="badge-level">
                                  Level {currentFlashcard.level || 'B1'}
                                </span>
                                <span className="vocab-pos-tag">
                                  {currentFlashcard.pos}
                                </span>
                              </div>

                              <h2 className="flashcard-back-word">
                                {currentFlashcard.word}
                              </h2>

                              {/* Phiên âm UK & US từ điển nằm ngang */}
                              <div className="dict-phonetics-inline-row">
                                <div className="dict-accent-item">
                                  <span className="dict-flag-tag uk">🇬🇧 UK</span>
                                  <code className="dict-ipa-code">
                                    {currentDictInfo?.ukIpa ||
                                      currentFlashcard.ipa}
                                </code>
                                </div>
                                <div className="dict-accent-item">
                                  <span className="dict-flag-tag us">🇺🇸 US</span>
                                  <code className="dict-ipa-code">
                                    {currentDictInfo?.usIpa ||
                                      currentFlashcard.ipa}
                                </code>
                                </div>
                              </div>

                              <div className="flashcard-meaning-highlight">
                                <strong>Nghĩa:</strong> {currentFlashcard.meaning}
                              </div>

                              {parseSynonyms(currentFlashcard.synonyms).length >
                                0 && (
                                <div className="vocab-synonyms-row">
                                  <span>Đồng nghĩa:</span>
                                  {parseSynonyms(currentFlashcard.synonyms).map(
                                    (syn) => (
                                      <span key={syn} className="synonym-pill">
                                        {syn}
                                      </span>
                                    )
                                  )}
                                </div>
                              )}
                            </div>

                            {/* CỘT PHẢI: CÂU VÍ DỤ, DỊCH NGHĨA & HƯỚNG DẪN TRỌNG ÂM */}
                            <div className="flashcard-split-col right">
                              <div className="flashcard-example-card">
                                <span className="example-tag-label">Ngữ cảnh &amp; Ví dụ:</span>
                                <p className="en">“{currentFlashcard.example}”</p>
                                <p className="vi">{currentFlashcard.exampleTrans}</p>
                              </div>

                              <div className="dict-stress-note">
                                💡 <b>Trọng âm:</b>{' '}
                                {getStressGuide(currentFlashcard)}
                              </div>

                              {currentDictInfo?.englishDef && (
                                <div className="dict-en-definition">
                                  📘 <b>Định nghĩa:</b>{' '}
                                  <i>{currentDictInfo.englishDef}</i>
                                </div>
                              )}
                            </div>
                          </div>

                          <span className="flashcard-flip-hint">
                            <FiRefreshCw className="react-icon" /> Chạm vào thẻ để lật lại &amp; nghe phát âm
                          </span>
                        </div>
                      )}
                    </div>

                    {/* HAI NÚT CHUYỂN TỪ THEO HÀNG NGANG: CHƯA THUỘC & ĐÃ THUỘC */}
                    <div className="flashcard-decision-bar horizontal">
                      <button
                        type="button"
                        className="flashcard-decision-btn unmastered"
                        onClick={() => handleFlashcardDecision('unmastered')}
                      >
                        <FiX className="decision-icon" />
                        <span>Chưa thuộc (Ôn lại)</span>
                      </button>

                      <button
                        type="button"
                        className="flashcard-decision-btn mastered"
                        onClick={() => handleFlashcardDecision('mastered')}
                      >
                        <FiCheck className="decision-icon" />
                        <span>Đã thuộc (Nhớ từ)</span>
                      </button>
                    </div>

                    {/* Điều hướng phụ */}
                    <div className="flashcard-sub-nav">
                      <button
                        type="button"
                        className="btn-text-nav"
                        onClick={() => {
                          setIsFlipped(false);
                          setCardIndex((i) =>
                            i === 0 ? flashcardDeck.length - 1 : i - 1
                          );
                        }}
                      >
                        <FiArrowLeft className="react-icon" /> Quay lại từ trước
                      </button>
                      <button
                        type="button"
                        className="btn-text-nav"
                        onClick={() => {
                          setIsFlipped(false);
                          setCardIndex((i) => (i + 1) % flashcardDeck.length);
                        }}
                      >
                        Bỏ qua sang từ tiếp <FiArrowRight className="react-icon" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ==================== CHẾ ĐỘ 3: GHI CHÉP CHÍNH TẢ (DICTATION) CỦA BỘ TOPIC ==================== */}
            {studyMode === 'dictation' && (
              <div className="quiz-stage-container animate-card-up">
                {dictationFinished ? (
                  <div className="quiz-result-card">
                    <FiAward style={{ fontSize: '3.2rem', color: '#00897b' }} />
                    <h2>
                      Hoàn thành Ghi Chép Chính Tả Topic:{' '}
                      {selectedTopic === 'ALL' ? 'Tổng hợp' : selectedTopic}
                    </h2>
                    <p>
                      Bạn đã viết đúng chính tả{' '}
                      <strong style={{ color: '#00897b', fontSize: '1.25rem' }}>
                        {dictationCorrectCount} / {activeTopicWords.length}
                      </strong>{' '}
                      từ vựng (
                      {Math.round(
                        (dictationCorrectCount / activeTopicWords.length) * 100
                      )}
                      %).
                    </p>

                    {/* Bảng tổng kết từng từ đã chép trong bộ Topic */}
                    <div className="dictation-summary-list">
                      {dictationHistory.map((h, i) => (
                        <div
                          key={i}
                          className={`dictation-summary-item ${
                            h.isCorrect ? 'ok' : 'err'
                          }`}
                        >
                          <div>
                            <strong>
                              {i + 1}. {h.expected}
                            </strong>{' '}
                            <span>({h.meaning})</span>
                            <div style={{ fontSize: '0.82rem', color: '#475569' }}>
                              Bạn đã gõ: <b>“{h.userTyped}”</b>
                            </div>
                          </div>
                          <span className="badge-level">{h.accuracy}%</span>
                        </div>
                      ))}
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '0.85rem',
                        marginTop: '1.35rem',
                        flexWrap: 'wrap',
                      }}
                    >
                      <Button onClick={resetDictation}>
                        <FiRefreshCw className="react-icon" /> Luyện Chính tả lại
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setStudyMode('quiz');
                          handleResetQuiz();
                        }}
                      >
                        <FiHelpCircle className="react-icon" /> Chuyển sang Trắc nghiệm Topic này
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedTopic(null)}
                      >
                        <FiArrowLeft className="react-icon" /> Chọn Chủ đề khác
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="quiz-question-card">
                    <div className="quiz-header-meta">
                      <div>
                        <span className="vocab-topic-tag">
                          Topic:{' '}
                          {selectedTopic === 'ALL'
                            ? currentDictationItem.topic?.name || 'Tất cả'
                            : selectedTopic}
                        </span>{' '}
                        <span style={{ marginLeft: '0.5rem' }}>
                          Từ số <b>{dictationIndex + 1}</b> /{' '}
                          {activeTopicWords.length}
                        </span>
                      </div>

                      <div className="sub-tabs" style={{ marginBottom: 0 }}>
                        <button
                          type="button"
                          className={dictationMode === 'word' ? 'active' : ''}
                          onClick={() => {
                            setDictationMode('word');
                            setDictationInput('');
                            setDictationResult(null);
                          }}
                        >
                          Chép Từ vựng
                        </button>
                        <button
                          type="button"
                          className={
                            dictationMode === 'sentence' ? 'active' : ''
                          }
                          onClick={() => {
                            setDictationMode('sentence');
                            setDictationInput('');
                            setDictationResult(null);
                          }}
                        >
                          Chép Câu ví dụ
                        </button>
                      </div>
                    </div>

                    {/* Khung nghe âm thanh & gợi ý nghĩa tiếng Việt */}
                    <div className="quiz-prompt-box">
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          gap: '0.5rem',
                          marginBottom: '0.65rem',
                        }}
                      >
                        <span className="badge-level">
                          Level {currentDictationItem.level || 'B1'}
                        </span>
                        <span className="vocab-pos-tag">
                          {currentDictationItem.pos}
                        </span>
                      </div>

                      <h3 style={{ margin: '0 0 0.35rem', color: '#0f172a' }}>
                        Nghĩa: “
                        {dictationMode === 'sentence' &&
                        currentDictationItem.exampleTrans
                          ? currentDictationItem.exampleTrans
                          : currentDictationItem.meaning}
                        ”
                      </h3>

                      {dictationMode === 'word' && (
                        <p className="vocab-ipa-text">
                          Phiên âm gợi ý: {currentDictationItem.ipa}
                        </p>
                      )}

                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          gap: '0.65rem',
                          marginTop: '0.85rem',
                          flexWrap: 'wrap',
                        }}
                      >
                        <button
                          type="button"
                          className="btn-listen"
                          onClick={() => speakText(targetDictationText, 0.95)}
                        >
                          <FiVolume2 className="react-icon" /> Nghe chuẩn (1.0x)
                        </button>
                        <button
                          type="button"
                          className="btn-outline-sm"
                          onClick={() => speakText(targetDictationText, 0.65)}
                        >
                          <FiVolume2 className="react-icon" /> Nghe chậm (0.7x)
                        </button>
                        <button
                          type="button"
                          className="btn-outline-sm"
                          onClick={() =>
                            setShowDictationHint((prev) => !prev)
                          }
                        >
                          <FiEye className="react-icon" />{' '}
                          {showDictationHint ? 'Ẩn gợi ý chữ' : 'Gợi ý chữ cái'}
                        </button>
                      </div>

                      {showDictationHint && (
                        <div className="dictation-masked-hint">
                          {getMaskedHint(targetDictationText)}
                        </div>
                      )}
                    </div>

                    {/* Ô nhập Ghi chép Chính tả */}
                    <form
                      onSubmit={handleCheckDictation}
                      className="dictation-form-box"
                    >
                      <label className="quiz-instruction">
                        <FiEdit3 className="react-icon teal-text" /> Nghe và gõ chính tả tiếng Anh vào ô bên dưới:
                      </label>
                      <div className="live-input-row">
                        <input
                          type="text"
                          autoFocus
                          disabled={!!dictationResult}
                          placeholder={
                            dictationMode === 'sentence'
                              ? 'Gõ lại cả câu tiếng Anh bạn nghe được...'
                              : 'Gõ từ / cụm từ tiếng Anh tương ứng...'
                          }
                          value={dictationInput}
                          onChange={(e) => setDictationInput(e.target.value)}
                        />
                        {!dictationResult && (
                          <Button type="submit">
                            <FiCheck className="react-icon" /> Kiểm tra
                          </Button>
                        )}
                      </div>
                    </form>

                    {/* Kết quả đối chiếu Chính tả */}
                    {dictationResult && (
                      <div
                        className={`dictation-result-banner ${
                          dictationResult.isCorrect ? 'correct' : 'wrong'
                        }`}
                      >
                        <div>
                          <div className="dictation-status-title">
                            {dictationResult.isCorrect ? (
                              <>
                                <FiCheckCircle className="react-icon" /> Chính xác ({dictationResult.accuracy}%)!
                              </>
                            ) : (
                              <>
                                <FiX className="react-icon" /> Chưa chính xác ({dictationResult.accuracy}%)
                              </>
                            )}
                          </div>
                          <div style={{ marginTop: '0.35rem', fontSize: '0.92rem' }}>
                            Đáp án chuẩn:{' '}
                            <strong style={{ color: '#0f172a' }}>
                              {dictationResult.expected}
                            </strong>
                          </div>
                          {currentDictationItem.example &&
                            dictationMode === 'word' && (
                              <div
                                style={{
                                  fontSize: '0.84rem',
                                  color: '#475569',
                                  marginTop: '0.25rem',
                                }}
                              >
                                Ví dụ: “{currentDictationItem.example}”
                              </div>
                            )}
                        </div>

                        <Button onClick={handleNextDictation}>
                          Từ tiếp theo <FiArrowRight className="react-icon" />
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ==================== CHẾ ĐỘ 4: TRẮC NGHIỆM ÔN TẬP (QUIZ) CỦA BỘ TOPIC ==================== */}
            {studyMode === 'quiz' && (
              <div className="quiz-stage-container animate-card-up">
                {quizFinished ? (
                  <div className="quiz-result-card">
                    <FiAward
                      style={{ fontSize: '3.2rem', color: '#00897b' }}
                    />
                    <h2>
                      Hoàn thành Trắc Nghiệm Topic:{' '}
                      {selectedTopic === 'ALL' ? 'Tổng hợp' : selectedTopic}
                    </h2>
                    <p>
                      Bạn đã trả lời đúng{' '}
                      <strong style={{ color: '#00897b', fontSize: '1.25rem' }}>
                        {quizScore} / {activeTopicWords.length}
                      </strong>{' '}
                      câu hỏi thuộc bộ chủ đề này (
                      {Math.round(
                        (quizScore / activeTopicWords.length) * 100
                      )}
                      %).
                    </p>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '1rem',
                        marginTop: '1.25rem',
                        flexWrap: 'wrap',
                      }}
                    >
                      <Button onClick={handleResetQuiz}>
                        <FiRefreshCw className="react-icon" /> Làm lại Quiz Topic này
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setStudyMode('dictation');
                          resetDictation();
                        }}
                      >
                        <FiEdit3 className="react-icon" /> Luyện Chính tả Topic này
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedTopic(null)}
                      >
                        <FiArrowLeft className="react-icon" /> Chọn Chủ đề khác
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="quiz-question-card">
                    <div className="quiz-header-meta">
                      <div>
                        <span className="vocab-topic-tag">
                          Topic:{' '}
                          {selectedTopic === 'ALL'
                            ? currentQuizItem.topic?.name || 'Tất cả'
                            : selectedTopic}
                        </span>{' '}
                        <span style={{ marginLeft: '0.5rem' }}>
                          Câu hỏi <b>{quizIndex + 1}</b> /{' '}
                          {activeTopicWords.length}
                        </span>
                      </div>
                      <span className="badge-level">
                        Điểm đúng: {quizScore}/{activeTopicWords.length}
                      </span>
                    </div>

                    <div className="quiz-prompt-box">
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          gap: '0.5rem',
                        }}
                      >
                        <span className="badge-level">
                          Level {currentQuizItem.level || 'B1'}
                        </span>
                        <span className="vocab-pos-tag">
                          {currentQuizItem.pos}
                        </span>
                      </div>
                      <h2>{currentQuizItem.word}</h2>
                      <p className="vocab-ipa-text">{currentQuizItem.ipa}</p>
                      <button
                        type="button"
                        className="btn-listen"
                        onClick={() => speakText(currentQuizItem.word)}
                      >
                        <FiVolume2 className="react-icon" /> Nghe phát âm
                      </button>
                    </div>

                    <p className="quiz-instruction">
                      Chọn nghĩa tiếng Việt chính xác nhất của từ thuộc Topic này:
                    </p>

                    <div className="quiz-options-grid">
                      {quizOptions.map((option) => {
                        const isCorrect = option === currentQuizItem.meaning;
                        const isChosen = selectedAnswer === option;

                        let btnClass = 'quiz-option-btn';
                        if (selectedAnswer) {
                          if (isCorrect) btnClass += ' correct';
                          else if (isChosen) btnClass += ' wrong';
                        }

                        return (
                          <button
                            key={option}
                            type="button"
                            className={btnClass}
                            onClick={() => handleAnswerQuiz(option)}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>

                    {selectedAnswer && (
                      <div className="quiz-feedback-footer">
                        <div>
                          <strong>Ví dụ thực tế:</strong> “
                          {currentQuizItem.example}”
                        </div>
                        <Button onClick={handleNextQuiz}>
                          Câu tiếp theo <FiArrowRight className="react-icon" />
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
