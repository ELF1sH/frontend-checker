import express, { Router } from 'express';
import { testController } from '../controllers/test';
import auth from '../middlewares/auth';

const router: Router = express.Router();

router.post('/test-task-bank', auth, testController.testTaskBank);
router.post('/test-simple-project', auth, testController.testSimpleProject);
router.get('/get-html', auth, testController.getHtml);
router.post('/upload-src', auth, testController.uploadSrc);

export default router;
