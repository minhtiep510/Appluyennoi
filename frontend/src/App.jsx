import React, { useState, useEffect } from 'react';
import AuthScreen from './screens/AuthScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import ChangePasswordScreen from './screens/ChangePasswordScreen';
import HomeScreen from './screens/HomeScreen';
import UserTopicsScreen from './screens/UserTopicsScreen';
import VocabularyScreen from './screens/VocabularyScreen';
import PracticeScreen from './screens/PracticeScreen';
import ProfileScreen from './screens/ProfileScreen';
import AdminDashboardScreen from './screens/AdminDashboardScreen';
import AdminLessonsScreen from './screens/AdminLessonsScreen';
import AdminVocabularyScreen from './screens/AdminVocabularyScreen';
import AdminUsersScreen from './screens/AdminUsersScreen';
import AdminLayout from './components/common/AdminLayout';
import CustomerLayout from './components/common/CustomerLayout';
import MobileAppLayout from './components/common/MobileAppLayout';
import Footer from './components/common/Footer';
import PrivacyPolicyScreen from './screens/PrivacyPolicyScreen';
import TermsOfServiceScreen from './screens/TermsOfServiceScreen';
import DeleteAccountPolicyScreen from './screens/DeleteAccountPolicyScreen';
import './App.css';

export default function App() {
  const [user, setUser] = useState(null);
  /**
   * Các trang độc lập hoàn toàn:
   * - Customer / Học viên: 'home' | 'topics' | 'practice' | 'profile' | 'auth'
   * - Admin / Quản trị: 'admin-dashboard' | 'admin-lessons' | 'admin-users'
   */
  const [activeScreen, setActiveScreen] = useState('home');
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [practicingLessonId, setPracticingLessonId] = useState(1);
  const [pendingAction, setPendingAction] = useState(null); // { type: 'practice', lessonId } | { type: 'vocab', topicName, mode }
  const [authNotice, setAuthNotice] = useState('');
  const [selectedVocabTopic, setSelectedVocabTopic] = useState(null);

  /**
   * Chế độ hiển thị song song:
   * - 'web': Giao diện Web (Desktop / Laptop)
   * - 'app': Giao diện Mobile App (Khung iPhone / Bottom Tab Bar / Responsive App)
   */
  const [viewPlatform, setViewPlatform] = useState(() => {
    const savedPlatform = localStorage.getItem('speakai_platform');
    if (savedPlatform === 'app' || savedPlatform === 'web') return savedPlatform;
    return window.innerWidth <= 768 ? 'app' : 'web';
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (savedUser && token) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
      } catch {
        localStorage.clear();
      }
    }

    const handleUnauthorized = () => {
      setUser(null);
      setAuthNotice('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.');
      setActiveScreen('auth');
      setAuthMode('login');
    };

    window.addEventListener('speakai_unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('speakai_unauthorized', handleUnauthorized);
    };
  }, []);

  const handleSwitchPlatform = (mode) => {
    setViewPlatform(mode);
    localStorage.setItem('speakai_platform', mode);
  };

  const handleAuthSuccess = (loggedInUser) => {
    setUser(loggedInUser);
    const pending = pendingAction;
    setPendingAction(null);
    setAuthNotice('');

    // Nếu người dùng đang bấm vào luyện nói trước khi đăng nhập -> chuyển thẳng vào bài luyện nói đó
    if (pending?.type === 'practice') {
      setPracticingLessonId(pending.lessonId || 1);
      setActiveScreen('practice');
      return;
    }

    // Nếu người dùng bấm vào học từ vựng trước khi đăng nhập -> mở đúng chủ đề đó
    if (pending?.type === 'vocab') {
      setSelectedVocabTopic(pending.topicName);
      setActiveScreen('vocabulary');
      return;
    }

    if (loggedInUser.role === 'ADMIN' && viewPlatform === 'web') {
      setActiveScreen('admin-dashboard');
    } else {
      setActiveScreen('home');
    }
  };

  const handleLogout = () => {
    window.speechSynthesis?.cancel();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setPendingAction(null);
    setAuthNotice('');
    setActiveScreen('home');
  };

  // Chỉ bắt đăng nhập khi người dùng bấm vào LUYỆN NÓI
  const handleStartPractice = (lessonId) => {
    if (!user) {
      setPendingAction({ type: 'practice', lessonId: lessonId || 1 });
      setAuthNotice(
        'Vui lòng đăng nhập hoặc tạo tài khoản để bắt đầu phòng Luyện Nói Đối Đáp AI!'
      );
      setAuthMode('login');
      setActiveScreen('auth');
      return;
    }
    if (lessonId) {
      setPracticingLessonId(lessonId);
    }
    setActiveScreen('practice');
  };

  // Chỉ bắt đăng nhập khi người dùng bấm vào HỌC TỪ VỰNG hoặc tính năng cần tài khoản
  const handleRequireAuth = (notice, action = null) => {
    if (action) {
      setPendingAction(action);
    }
    setAuthNotice(notice || 'Vui lòng đăng nhập để sử dụng tính năng này!');
    setAuthMode('login');
    setActiveScreen('auth');
  };

  const handleOpenAuthPage = (mode = 'login', notice = '') => {
    setAuthMode(mode);
    setAuthNotice(notice);
    setActiveScreen('auth');
  };

  const isAdmin = user?.role === 'ADMIN';

  // Nội dung trang hiện tại dùng chung cho cả Web và Mobile App
  const renderScreenContent = () => {
    if (isAdmin && activeScreen === 'admin-dashboard') {
      return (
        <AdminDashboardScreen
          onNavigateAdmin={(screen) => setActiveScreen(screen)}
          onSwitchToUserScreen={() => setActiveScreen('home')}
        />
      );
    }

    if (isAdmin && activeScreen === 'admin-lessons') {
      return (
        <AdminLessonsScreen
          onNavigateAdmin={(screen) => setActiveScreen(screen)}
        />
      );
    }

    if (isAdmin && activeScreen === 'admin-vocabulary') {
      return (
        <AdminVocabularyScreen
          onNavigateAdmin={(screen) => setActiveScreen(screen)}
        />
      );
    }

    if (isAdmin && activeScreen === 'admin-users') {
      return (
        <AdminUsersScreen
          onNavigateAdmin={(screen) => setActiveScreen(screen)}
        />
      );
    }

    if (activeScreen === 'auth') {
      return (
        <AuthScreen
          asPage
          initialMode={authMode}
          noticeMessage={authNotice}
          onAuthSuccess={handleAuthSuccess}
          onBackToHome={() => {
            setAuthNotice('');
            setActiveScreen('home');
          }}
          onNavigateForgot={() => setActiveScreen('forgot-password')}
        />
      );
    }

    if (activeScreen === 'forgot-password') {
      return (
        <ForgotPasswordScreen
          onNavigate={(screen) => setActiveScreen(screen)}
          onOpenAuth={(mode) => handleOpenAuthPage(mode)}
        />
      );
    }

    if (activeScreen === 'change-password') {
      if (!user) {
        return (
          <AuthScreen
            asPage
            initialMode="login"
            noticeMessage="Vui lòng đăng nhập để thực hiện đổi mật khẩu tài khoản!"
            onAuthSuccess={handleAuthSuccess}
            onBackToHome={() => setActiveScreen('home')}
            onNavigateForgot={() => setActiveScreen('forgot-password')}
          />
        );
      }
      return (
        <ChangePasswordScreen
          user={user}
          onNavigate={(screen) => setActiveScreen(screen)}
          onLogout={handleLogout}
        />
      );
    }

    // Bắt đăng nhập khi VÀO PHÒNG LUYỆN NÓI
    if (activeScreen === 'practice') {
      if (!user) {
        return (
          <AuthScreen
            asPage
            initialMode="login"
            noticeMessage={
              authNotice ||
              'Vui lòng đăng nhập hoặc đăng ký tài khoản để bắt đầu phòng Luyện Nói Đối Đáp AI!'
            }
            onAuthSuccess={handleAuthSuccess}
            onBackToHome={() => setActiveScreen('topics')}
            onNavigateForgot={() => setActiveScreen('forgot-password')}
          />
        );
      }
      return (
        <PracticeScreen
          lessonId={practicingLessonId}
          onSelectLesson={(newId) => setPracticingLessonId(newId)}
          onBack={() => setActiveScreen('topics')}
        />
      );
    }

    // Kho đề tài luyện nói: Cho phép xem tự do mọi đề tài
    if (activeScreen === 'topics') {
      return (
        <UserTopicsScreen
          onStartPractice={handleStartPractice}
          onNavigate={(screen) => setActiveScreen(screen)}
        />
      );
    }

    // Kho chủ đề từ vựng: Cho phép xem tự do các chủ đề, chỉ bắt đăng nhập khi bấm vào học
    if (activeScreen === 'vocabulary') {
      return (
        <VocabularyScreen
          user={user}
          initialTopic={selectedVocabTopic}
          onStartPractice={handleStartPractice}
          onRequireAuth={handleRequireAuth}
        />
      );
    }

    if (activeScreen === 'profile') {
      if (!user) {
        return (
          <AuthScreen
            asPage
            initialMode="login"
            noticeMessage="Vui lòng đăng nhập để xem thông tin hồ sơ của bạn!"
            onAuthSuccess={handleAuthSuccess}
            onBackToHome={() => setActiveScreen('home')}
            onNavigateForgot={() => setActiveScreen('forgot-password')}
          />
        );
      }
      return (
        <ProfileScreen
          user={user}
          onUserUpdate={(updated) => setUser(updated)}
          onNavigate={(screen) => setActiveScreen(screen)}
          onOpenAuth={(mode) => handleOpenAuthPage(mode)}
        />
      );
    }

    // Quản trị viên: Nếu chưa đăng nhập hoặc không phải ADMIN mà truy cập admin page
    if (activeScreen.startsWith('admin-') && !isAdmin) {
      return (
        <AuthScreen
          asPage
          initialMode="login"
          noticeMessage="Yêu cầu đăng nhập tài khoản Quản trị viên (ADMIN)!"
          onAuthSuccess={handleAuthSuccess}
          onBackToHome={() => setActiveScreen('home')}
          onNavigateForgot={() => setActiveScreen('forgot-password')}
        />
      );
    }

    // Trang Chính sách bảo mật
    if (activeScreen === 'privacy-policy') {
      return (
        <PrivacyPolicyScreen
          onNavigate={(screen) => setActiveScreen(screen)}
        />
      );
    }

    // Trang Điều khoản sử dụng
    if (activeScreen === 'terms-of-service') {
      return (
        <TermsOfServiceScreen
          onNavigate={(screen) => setActiveScreen(screen)}
        />
      );
    }

    // Trang Chính sách xóa tài khoản
    if (activeScreen === 'delete-account-policy') {
      return (
        <DeleteAccountPolicyScreen
          user={user}
          onNavigate={(screen) => setActiveScreen(screen)}
          onOpenAuth={(mode) => handleOpenAuthPage(mode)}
          onLogout={handleLogout}
        />
      );
    }

    // Trang chủ: Tự do xem trang chủ
    return (
      <HomeScreen
        user={user}
        onNavigate={(screen) => setActiveScreen(screen)}
        onStartPractice={handleStartPractice}
        onOpenAuth={(mode) => handleOpenAuthPage(mode)}
      />
    );
  };

  // ==================== CHẾ ĐỘ 1: GIAO DIỆN MOBILE APP ====================
  if (viewPlatform === 'app') {
    return (
      <MobileAppLayout
        user={user}
        activeScreen={activeScreen}
        onNavigate={(screen) => setActiveScreen(screen)}
        onStartPractice={() => handleStartPractice(practicingLessonId || 1)}
        onOpenAuth={(mode) => handleOpenAuthPage(mode)}
        onLogout={handleLogout}
        onSwitchToWeb={() => handleSwitchPlatform('web')}
      >
        {renderScreenContent()}
      </MobileAppLayout>
    );
  }

  // ==================== CHẾ ĐỘ 2: GIAO DIỆN WEB (ADMIN PORTAL) ====================
  if (isAdmin && activeScreen.startsWith('admin-')) {
    return (
      <AdminLayout
        user={user}
        activeScreen={activeScreen}
        onNavigateAdmin={(screen) => setActiveScreen(screen)}
        onSwitchToUserScreen={() => setActiveScreen('home')}
        onSwitchToApp={() => handleSwitchPlatform('app')}
        onLogout={handleLogout}
      >
        {renderScreenContent()}
      </AdminLayout>
    );
  }

  // ==================== CHẾ ĐỘ 3: GIAO DIỆN WEB (CUSTOMER / PUBLIC PORTAL) ====================
  return (
    <CustomerLayout
      user={user}
      activeScreen={activeScreen}
      authMode={authMode}
      onNavigate={(screen) => setActiveScreen(screen)}
      onOpenAuth={(mode) => handleOpenAuthPage(mode)}
      onLogout={handleLogout}
      onSwitchToApp={() => handleSwitchPlatform('app')}
    >
      {renderScreenContent()}
    </CustomerLayout>
  );
}
