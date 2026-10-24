const express = require('express');
const router = express.Router();

const authController = require('../controllers/authConttroller');
const lessonController = require('../controllers/lessonController');
const dialogueLineController = require('../controllers/dialogueLineController');
const userController = require('../controllers/userController');

// Middlewares
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');

// DTOs
const { registerDto, loginDto, verifyOtpDto, resendOtpDto } = require('../dtos/authDto');
const { createLessonDto, updateLessonDto } = require('../dtos/lessonDto');
const { createDialogueLineDto, updateDialogueLineDto, reorderDialoguesDto } = require('../dtos/dialogueLineDto');
const { queryUsersDto, createUserDto, updateUserDto } = require('../dtos/userDto');

// ==================== 1. AUTH ROUTES ====================
router.post('/auth/register', validate(registerDto), authController.register);
router.post('/auth/verify-otp', validate(verifyOtpDto), authController.verifyOtp);
router.post('/auth/resend-otp', validate(resendOtpDto), authController.resendOtp);
router.post('/auth/login', validate(loginDto), authController.login);
router.get('/auth/me', verifyToken, authController.getProfile);

// ==================== 2. PUBLIC / LESSON ROUTES ====================
router.get('/lessons', lessonController.getLessons);
router.get('/lessons/:lessonId', lessonController.getLessonById);

// ==================== 3. ADMIN LESSON MANAGEMENT ====================
router.post('/admin/lessons', verifyToken, requireAdmin, validate(createLessonDto), lessonController.postLesson);
router.put('/admin/lessons/:lessonId', verifyToken, requireAdmin, validate(updateLessonDto), lessonController.updateLesson);
router.delete('/admin/lessons/:lessonId', verifyToken, requireAdmin, lessonController.deleteLesson);

// ==================== 4. ADMIN DIALOGUE LINE MANAGEMENT ====================
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

// ==================== 5. ADMIN USER MANAGEMENT ====================
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

module.exports = router;
