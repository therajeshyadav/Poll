import express from 'express';
import { createUser, getUser } from '../controllers/userController.js';
import { validateUser } from '../middleware/validate.js';

const router = express.Router();

router.post('/', validateUser, createUser);
router.get('/:id', getUser);

export default router;