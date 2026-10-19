const express = require('express');
const router = express.Router();

const authController = require('../controllers/authConttroller');
const lessonController = require('../controllers/lessonController');
const dialogueLineController = require('../controllers/dialogueLineController');
const userController = require('../controllers/userController');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');

// --- Auth Routes ---
router.post('/auth/register', authController.register);
router.post('/auth/verify-otp', authController.verifyOtp);
router.post('/auth/resend-otp', authController.resendOtp);
router.post('/auth/login', authController.login);
router.get('/auth/me', verifyToken, authController.getProfile);

// --- Public/User Lesson Routes ---
router.get('/lessons', lessonController.getLessons);
router.get('/lessons/:lessonId', lessonController.getLessonById);

// --- Admin Lesson Management ---
router.post('/admin/lessons', verifyToken, requireAdmin, lessonController.postLesson);
router.put('/admin/lessons/:lessonId', verifyToken, requireAdmin, lessonController.updateLesson);
router.delete('/admin/lessons/:lessonId', verifyToken, requireAdmin, lessonController.deleteLesson);

// --- Admin Dialogue Line Management ---
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
  dialogueLineController.createDialogueLine
);
router.put(
  '/admin/dialogues/:id',
  verifyToken,
  requireAdmin,
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
  dialogueLineController.reorderDialogues
);

// --- Admin User Management ---
router.get('/admin/users', verifyToken, requireAdmin, userController.getAllUsers);
router.get('/admin/users/:userId', verifyToken, requireAdmin, userController.getUserById);
router.post('/admin/users', verifyToken, requireAdmin, userController.createUser);
router.put('/admin/users/:userId', verifyToken, requireAdmin, userController.updateUser);
router.delete('/admin/users/:userId', verifyToken, requireAdmin, userController.deleteUser);

module.exports = router;
