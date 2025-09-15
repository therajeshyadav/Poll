import express from 'express';
import { createPoll, getPolls, getPollById, updatePoll, deletePoll } from '../controllers/pollController.js';

const router = express.Router();

router.post('/', createPoll);
router.get('/', getPolls);
router.get('/:id', getPollById);
router.put('/:id', updatePoll);
router.delete('/:id', deletePoll);
export default router;
