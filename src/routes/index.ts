import express, { Router } from 'express';
import { testController } from '../controllers/test';
import auth from '../middlewares/auth';

const router: Router = express.Router();

router.post('/test-localhost-task-bank', auth, testController.testLocalhostTaskBank);
router.post('/test-google', auth, testController.testGoogle);
router.get('/get-html', auth, testController.getHtml);

export default router;
