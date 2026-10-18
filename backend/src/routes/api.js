import { Router } from 'express';
import { getStatus } from '../controllers/apiController.js';

const router = Router();

router.get('/status', getStatus);

export default router;
