import express, { Router } from 'express';
import { testController } from '../controllers/test';
import auth from '../middlewares/auth';

const router: Router = express.Router();

router.post('/test-task-bank', auth, testController.testTaskBank);
router.post('/test-simple-project', auth, testController.testSimpleProject);
router.get('/get-html', auth, testController.getHtml);
router.post('/upload-src', auth, testController.uploadSrc);
router.post('/test', auth, testController.test);
router.post('/test2', auth, testController.test2);

export default router;
