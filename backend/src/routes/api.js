const express = require('express');
const router = express.Router();

const authController = require('../controllers/authConttroller');
const lessonController = require('../controllers/lessonController');
const dialogueLineController = require('../controllers/dialogueLineController');
const userController = require('../controllers/userController');
const practiceController = require('../controllers/practiceController');
const vocabularyController = require('../controllers/vocabularyController');
const vocabularyPracticeController = require('../controllers/vocabularyPracticeController');

// Middlewares
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');

// DTOs
const {
  registerDto,
  loginDto,
  verifyOtpDto,
  resendOtpDto,
  forgotPasswordDto,
  resetPasswordDto,
  changePasswordDto,
} = require('../dtos/authDto');
const { createLessonDto, updateLessonDto } = require('../dtos/lessonDto');
const { createDialogueLineDto, updateDialogueLineDto, reorderDialoguesDto } = require('../dtos/dialogueLineDto');
const { queryUsersDto, createUserDto, updateUserDto } = require('../dtos/userDto');
const { submitPracticeDto, queryPracticeHistoryDto } = require('../dtos/practiceDto');
const {
  createVocabularyTopicDto,
  updateVocabularyTopicDto,
  createVocabularyDto,
  updateVocabularyDto,
} = require('../dtos/vocabularyDto');

// ==================== 1. AUTH ROUTES ====================
router.post('/auth/register', validate(registerDto), authController.register);
router.post('/auth/verify-otp', validate(verifyOtpDto), authController.verifyOtp);
router.post('/auth/resend-otp', validate(resendOtpDto), authController.resendOtp);
router.post('/auth/login', validate(loginDto), authController.login);
router.post('/auth/forgot-password', validate(forgotPasswordDto), authController.forgotPassword);
router.post('/auth/reset-password', validate(resetPasswordDto), authController.resetPassword);
router.post('/auth/change-password', verifyToken, validate(changePasswordDto), authController.changePassword);
router.get('/auth/me', verifyToken, authController.getProfile);
router.put('/auth/me', verifyToken, authController.updateProfile);
router.delete('/auth/me', verifyToken, authController.deleteAccount);

// ==================== 2. LESSON & VOCABULARY ROUTES (CHO PHÉP XEM DANH SÁCH TỰ DO) ====================
// Người dùng xem được danh sách đề tài và từ vựng từ database mà không bị 401 khi chưa đăng nhập
router.get('/lessons', lessonController.getLessons);
router.get('/lessons/:lessonId', verifyToken, lessonController.getLessonById);

// Lấy danh sách Chủ đề Từ vựng & Từ vựng (Công khai xem)
router.get('/vocabulary-topics', vocabularyController.getTopics);
router.get('/vocabulary-topics/:topicId', vocabularyController.getTopicById);
router.get('/vocabularies', vocabularyController.getVocabularies);

// ==================== VOCABULARY PRACTICE (TRẮC NGHIỆM & GHI CHÉP CHÍNH TẢ) ====================
router.get(
  '/vocabulary-practices/quiz/:topicId',
  verifyToken,
  vocabularyPracticeController.getTopicQuiz
);
router.get(
  '/vocabulary-topics/:topicId/quiz',
  verifyToken,
  vocabularyPracticeController.getTopicQuiz
);
router.get(
  '/vocabulary-practices/dictation/:topicId',
  verifyToken,
  vocabularyPracticeController.getTopicDictation
);
router.post(
  '/vocabulary-practices/check-dictation',
  verifyToken,
  vocabularyPracticeController.checkDictation
);

// Nộp & Xem kết quả Ghi chép chính tả (DICTATION) & Trắc nghiệm (QUIZ) theo bộ Topic
router.post(
  '/vocabulary-practices',
  verifyToken,
  vocabularyPracticeController.submitPractice
);
router.get(
  '/vocabulary-practices/me',
  verifyToken,
  vocabularyPracticeController.getMyPractices
);

// ==================== 3. USER PRACTICE ROUTES (HỌC VIÊN LUYỆN NÓI) ====================
// Nộp kết quả luyện nói (chấm điểm phát âm)
router.post(
  '/practice/submit',
  verifyToken,
  validate(submitPracticeDto),
  practiceController.submitPractice
);

// Xem lịch sử luyện tập cá nhân
router.get(
  '/practice/history',
  verifyToken,
  validate(queryPracticeHistoryDto, 'query'),
  practiceController.getMyPracticeHistories
);

// Xem thống kê tiến độ học (điểm TB, tổng số câu đã luyện)
router.get('/practice/progress', verifyToken, practiceController.getMyProgress);

// ==================== 4. ADMIN LESSON MANAGEMENT ====================
router.post('/admin/lessons', verifyToken, requireAdmin, validate(createLessonDto), lessonController.postLesson);
router.put('/admin/lessons/:lessonId', verifyToken, requireAdmin, validate(updateLessonDto), lessonController.updateLesson);
router.delete('/admin/lessons/:lessonId', verifyToken, requireAdmin, lessonController.deleteLesson);

// ==================== 5. ADMIN DIALOGUE LINE MANAGEMENT ====================
router.get(
  '/admin/lessons/:lessonId/dialogues',
  verifyToken,
  requireAdmin,
  dialogueLineController.getDialoguesByLesson
);
router.post(
  '/admin/lessons/:lessonId/dialogues',
  verifyToken,
  requireAdmin,
  validate(createDialogueLineDto),
  dialogueLineController.createDialogueLine
);
router.put(
  '/admin/dialogues/:id',
  verifyToken,
  requireAdmin,
  validate(updateDialogueLineDto),
  dialogueLineController.updateDialogueLine
);
router.delete(
  '/admin/dialogues/:id',
  verifyToken,
  requireAdmin,
  dialogueLineController.deleteDialogueLine
);
router.put(
  '/admin/lessons/:lessonId/dialogues/reorder',
  verifyToken,
  requireAdmin,
  validate(reorderDialoguesDto),
  dialogueLineController.reorderDialogues
);

// ==================== 6. ADMIN USER MANAGEMENT ====================
router.get(
  '/admin/users',
  verifyToken,
  requireAdmin,
  validate(queryUsersDto, 'query'),
  userController.getAllUsers
);
router.get('/admin/users/:userId', verifyToken, requireAdmin, userController.getUserById);
router.post(
  '/admin/users',
  verifyToken,
  requireAdmin,
  validate(createUserDto),
  userController.createUser
);
router.put(
  '/admin/users/:userId',
  verifyToken,
  requireAdmin,
  validate(updateUserDto),
  userController.updateUser
);
router.delete('/admin/users/:userId', verifyToken, requireAdmin, userController.deleteUser);

// ==================== 7. ADMIN VOCABULARY TOPIC & VOCABULARY MANAGEMENT ====================
router.post(
  '/admin/vocabulary-topics',
  verifyToken,
  requireAdmin,
  validate(createVocabularyTopicDto),
  vocabularyController.createTopic
);
router.put(
  '/admin/vocabulary-topics/:topicId',
  verifyToken,
  requireAdmin,
  validate(updateVocabularyTopicDto),
  vocabularyController.updateTopic
);
router.delete(
  '/admin/vocabulary-topics/:topicId',
  verifyToken,
  requireAdmin,
  vocabularyController.deleteTopic
);

router.post(
  '/admin/vocabularies',
  verifyToken,
  requireAdmin,
  validate(createVocabularyDto),
  vocabularyController.createVocabulary
);
router.put(
  '/admin/vocabularies/:id',
  verifyToken,
  requireAdmin,
  validate(updateVocabularyDto),
  vocabularyController.updateVocabulary
);
router.delete(
  '/admin/vocabularies/:id',
  verifyToken,
  requireAdmin,
  vocabularyController.deleteVocabulary
);

module.exports = router;
