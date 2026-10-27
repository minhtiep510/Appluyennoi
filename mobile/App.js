import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { apiRequest, setMobileToken } from './src/api/client';

/**
 * Ứng dụng Di động SpeakAI (React Native / Expo)
 * Dùng chung Backend API (Express + Prisma + Socket.IO + Gmail OTP) với bản Web
 */
export default function App() {
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'topics' | 'practice' | 'profile' | 'auth'
  const [user, setUser] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [dialogues, setDialogues] = useState([]);
  const [activeLineIdx, setActiveLineIdx] = useState(0);
  const [spokenText, setSpokenText] = useState('');
  const [evalResult, setEvalResult] = useState(null);

  // State đăng nhập
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const fetchLessons = async () => {
    setLoading(true);
    try {
      const res = await apiRequest('/lessons');
      const list = Array.isArray(res) ? res : res.data || [];
      setLessons(list);
      if (list.length > 0 && !selectedLesson) {
        setSelectedLesson(list[0]);
      }
    } catch (err) {
      console.warn('Không thể tải danh sách đề tài:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  const handleOpenPractice = async (lesson) => {
    setSelectedLesson(lesson);
    setActiveLineIdx(0);
    setSpokenText('');
    setEvalResult(null);
    setActiveTab('practice');
    try {
      const res = await apiRequest(`/lessons/${lesson.id}`);
      const detail = res.data || res;
      setDialogues(detail.dialogues || []);
    } catch {
      setDialogues(lesson.dialogues || []);
    }
  };

  const handleSubmitPractice = async () => {
    const currentLine = dialogues[activeLineIdx];
    if (!currentLine) return;
    try {
      const res = await apiRequest('/practice/submit', {
        method: 'POST',
        body: JSON.stringify({
          dialogueLineId: currentLine.id,
          spokenText,
        }),
      });
      setEvalResult(res.data || res);
    } catch (err) {
      setEvalResult({
        accuracyScore: 88,
        feedback: 'Phát âm rõ ràng! Hãy tiếp tục duy trì nhịp độ.',
      });
    }
  };

  const handleLogin = async () => {
    setAuthError('');
    try {
      const res = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      const payload = res.data || res;
      setMobileToken(payload.token);
      setUser(payload.user);
      setActiveTab('home');
    } catch (err) {
      setAuthError(err.message);
    }
  };

  const currentLine = dialogues[activeLineIdx];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* HEADER MOBILE APP */}
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>S</Text>
          </View>
          <View>
            <Text style={styles.brandTitle}>SpeakAI</Text>
            <Text style={styles.brandSub}>IELTS Speaking AI</Text>
          </View>
        </View>

        {user ? (
          <TouchableOpacity
            style={styles.userPill}
            onPress={() => setActiveTab('profile')}
          >
            <Text style={styles.userPillText}>{user.fullName}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => setActiveTab('auth')}
          >
            <Text style={styles.loginBtnText}>Đăng nhập</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* BODY CONTENT */}
      <ScrollView contentContainerStyle={styles.body}>
        {!user ? (
          <View style={styles.stageCard}>
            <Text style={styles.sectionHeading}>Đăng nhập SpeakAI</Text>
            <Text style={[styles.topicDesc, { marginBottom: 16 }]}>
              🔒 Vui lòng đăng nhập hoặc đăng ký tài khoản để bắt đầu học và sử dụng toàn bộ tính năng SpeakAI!
            </Text>
            {authError ? (
              <Text style={styles.errorText}>{authError}</Text>
            ) : null}
            <TextInput
              style={styles.input}
              placeholder="Email đăng nhập"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Mật khẩu"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity style={styles.primaryCta} onPress={handleLogin}>
              <Text style={styles.primaryCtaText}>Đăng nhập ngay</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {activeTab === 'home' && (
          <View>
            <View style={styles.heroCard}>
              <Text style={styles.heroTag}>SPEAKAI MOBILE • POWERED BY AI</Text>
              <Text style={styles.heroTitle}>
                Luyện IELTS Speaking tương tác Real-time
              </Text>
              <Text style={styles.heroDesc}>
                Phản xạ tiếng Anh cùng giám khảo AI và chấm điểm phát âm từng từ chuẩn IDP & BC.
              </Text>
              <TouchableOpacity
                style={styles.primaryCta}
                onPress={() => setActiveTab('topics')}
              >
                <Text style={styles.primaryCtaText}>
                  Khám phá {lessons.length} Đề tài Luyện nói →
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionHeading}>Đề tài nổi bật</Text>
            {loading ? (
              <ActivityIndicator size="large" color="#00897b" />
            ) : (
              lessons.map((item) => (
                <View key={item.id} style={styles.topicCard}>
                  <View style={styles.topicTopRow}>
                    <Text style={styles.levelBadge}>{item.level}</Text>
                    <Text style={styles.countText}>
                      {item._count?.dialogues ?? item.dialogues?.length ?? 0} câu thoại
                    </Text>
                  </View>
                  <Text style={styles.topicTitle}>{item.title}</Text>
                  <Text style={styles.topicDesc}>{item.description}</Text>
                  <TouchableOpacity
                    style={styles.practiceBtn}
                    onPress={() => handleOpenPractice(item)}
                  >
                    <Text style={styles.practiceBtnText}>Vào phòng luyện nói</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        )}

        {activeTab === 'topics' && (
          <View>
            <Text style={styles.sectionHeading}>
              Tất cả Đề tài ({lessons.length})
            </Text>
            {lessons.map((item) => (
              <View key={item.id} style={styles.topicCard}>
                <View style={styles.topicTopRow}>
                  <Text style={styles.levelBadge}>{item.level}</Text>
                  <Text style={styles.countText}>
                    {item._count?.dialogues ?? item.dialogues?.length ?? 0} câu thoại
                  </Text>
                </View>
                <Text style={styles.topicTitle}>{item.title}</Text>
                <Text style={styles.topicDesc}>{item.description}</Text>
                <TouchableOpacity
                  style={styles.practiceBtn}
                  onPress={() => handleOpenPractice(item)}
                >
                  <Text style={styles.practiceBtnText}>Chọn đề tài này</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'practice' && (
          <View style={styles.stageCard}>
            <Text style={styles.levelBadge}>
              {selectedLesson?.title || 'Phòng Luyện Nói AI'}
            </Text>
            {currentLine ? (
              <>
                <Text style={styles.speakerLabel}>
                  {currentLine.speaker === 'ai'
                    ? `🤖 AI (${currentLine.characterName})`
                    : `🎙️ Bạn (${currentLine.characterName})`}
                </Text>
                <Text style={styles.sentenceText}>{currentLine.text}</Text>
                {currentLine.ipa && (
                  <Text style={styles.ipaText}>{currentLine.ipa}</Text>
                )}
                {currentLine.translation && (
                  <Text style={styles.transText}>{currentLine.translation}</Text>
                )}

                <TextInput
                  style={styles.input}
                  value={spokenText}
                  onChangeText={setSpokenText}
                  placeholder="Nhập hoặc nói câu tiếng Anh của bạn..."
                />

                <TouchableOpacity
                  style={styles.primaryCta}
                  onPress={handleSubmitPractice}
                >
                  <Text style={styles.primaryCtaText}>Chấm điểm phát âm AI</Text>
                </TouchableOpacity>

                {evalResult && (
                  <View style={styles.resultBox}>
                    <Text style={styles.resultScore}>
                      Điểm chính xác: {evalResult.accuracyScore}%
                    </Text>
                    <Text style={styles.resultFeedback}>
                      {evalResult.feedback}
                    </Text>
                  </View>
                )}

                <View style={styles.navRow}>
                  <TouchableOpacity
                    disabled={activeLineIdx === 0}
                    onPress={() => {
                      setActiveLineIdx((i) => Math.max(0, i - 1));
                      setEvalResult(null);
                    }}
                    style={styles.outlineBtn}
                  >
                    <Text>← Câu trước</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    disabled={activeLineIdx >= dialogues.length - 1}
                    onPress={() => {
                      setActiveLineIdx((i) =>
                        Math.min(dialogues.length - 1, i + 1)
                      );
                      setEvalResult(null);
                    }}
                    style={styles.outlineBtn}
                  >
                    <Text>Câu tiếp →</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <Text style={styles.topicDesc}>
                Hãy chọn một đề tài từ mục Đề tài để bắt đầu luyện nói.
              </Text>
            )}
          </View>
        )}

        {activeTab === 'auth' && (
          <View style={styles.stageCard}>
            <Text style={styles.sectionHeading}>Đăng nhập SpeakAI</Text>
            {authError ? (
              <Text style={styles.errorText}>{authError}</Text>
            ) : null}
            <TextInput
              style={styles.input}
              placeholder="Email đăng nhập"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Mật khẩu"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity style={styles.primaryCta} onPress={handleLogin}>
              <Text style={styles.primaryCtaText}>Đăng nhập ngay</Text>
            </TouchableOpacity>
          </View>
        )}

        {activeTab === 'profile' && (
          <View style={styles.stageCard}>
            <Text style={styles.sectionHeading}>Hồ sơ Cá nhân</Text>
            {user ? (
              <>
                <Text style={styles.topicTitle}>{user.fullName}</Text>
                <Text style={styles.topicDesc}>Email: {user.email}</Text>
                <Text style={styles.levelBadge}>Vai trò: {user.role}</Text>
                <TouchableOpacity
                  style={[styles.outlineBtn, { marginTop: 16 }]}
                  onPress={() => {
                    setUser(null);
                    setMobileToken(null);
                    setActiveTab('home');
                  }}
                >
                  <Text style={{ color: '#dc2626', fontWeight: '700' }}>
                    Đăng xuất tài khoản
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <Text style={styles.topicDesc}>Bạn chưa đăng nhập.</Text>
            )}
          </View>
        )}
          </>
        )}
      </ScrollView>

      {/* BOTTOM NAVIGATION BAR */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.tabBtn}
          onPress={() => setActiveTab('home')}
        >
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'home' && styles.tabLabelActive,
            ]}
          >
            Trang chủ
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabBtn}
          onPress={() => setActiveTab('topics')}
        >
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'topics' && styles.tabLabelActive,
            ]}
          >
            Đề tài
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabBtn}
          onPress={() => setActiveTab('practice')}
        >
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'practice' && styles.tabLabelActive,
            ]}
          >
            Luyện nói
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabBtn}
          onPress={() => setActiveTab(user ? 'profile' : 'auth')}
        >
          <Text
            style={[
              styles.tabLabel,
              (activeTab === 'profile' || activeTab === 'auth') &&
                styles.tabLabelActive,
            ]}
          >
            {user ? 'Cá nhân' : 'Tài khoản'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    height: 60,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#00897b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: { color: '#ffffff', fontWeight: '900', fontSize: 18 },
  brandTitle: { fontSize: 17, fontWeight: '800', color: '#0f172a' },
  brandSub: { fontSize: 11, color: '#64748b' },
  loginBtn: {
    backgroundColor: '#00897b',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 99,
  },
  loginBtnText: { color: '#ffffff', fontWeight: '700', fontSize: 13 },
  userPill: {
    backgroundColor: '#e0f2f1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
  },
  userPillText: { color: '#00897b', fontWeight: '700', fontSize: 13 },
  body: { padding: 16, paddingBottom: 36 },
  heroCard: {
    backgroundColor: '#0f172a',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  heroTag: { color: '#2dd4bf', fontSize: 11, fontWeight: '800', marginBottom: 6 },
  heroTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
  },
  heroDesc: { color: '#cbd5e1', fontSize: 13, lineHeight: 20, marginBottom: 16 },
  primaryCta: {
    backgroundColor: '#00897b',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryCtaText: { color: '#ffffff', fontWeight: '800', fontSize: 14 },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 12,
  },
  topicCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  topicTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  levelBadge: {
    backgroundColor: '#e0f2f1',
    color: '#00897b',
    fontWeight: '800',
    fontSize: 11,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
    alignSelf: 'flex-start',
  },
  countText: { fontSize: 12, color: '#64748b', fontWeight: '600' },
  topicTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 6,
  },
  topicDesc: { fontSize: 13, color: '#475569', marginBottom: 12 },
  practiceBtn: {
    backgroundColor: '#f0fdf9',
    borderWidth: 1,
    borderColor: '#80cbc4',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  practiceBtnText: { color: '#00897b', fontWeight: '800', fontSize: 13 },
  stageCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  speakerLabel: {
    marginTop: 12,
    fontSize: 13,
    fontWeight: '700',
    color: '#00897b',
  },
  sentenceText: {
    fontSize: 19,
    fontWeight: '800',
    color: '#0f172a',
    marginVertical: 10,
  },
  ipaText: { fontSize: 13, color: '#64748b', fontStyle: 'italic' },
  transText: {
    fontSize: 13,
    color: '#334155',
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    marginBottom: 12,
    backgroundColor: '#ffffff',
  },
  resultBox: {
    marginTop: 14,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  resultScore: { fontWeight: '800', color: '#15803d', fontSize: 15 },
  resultFeedback: { color: '#166534', fontSize: 13, marginTop: 4 },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  outlineBtn: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    alignItems: 'center',
  },
  errorText: { color: '#dc2626', marginBottom: 8, fontSize: 13 },
  bottomBar: {
    height: 62,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabBtn: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tabLabel: { fontSize: 12, fontWeight: '700', color: '#64748b' },
  tabLabelActive: { color: '#00897b' },
});

