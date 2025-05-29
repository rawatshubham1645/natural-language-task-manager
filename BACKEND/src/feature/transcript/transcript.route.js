import { Router } from 'express';
import TranscriptController from './transcript.controller.js';

const router = Router();
const transcriptController = new TranscriptController();

// Parse meeting transcript and extract tasks
router.post('/parse', (req, res, next) => transcriptController.parseTranscript(req, res, next));

export default router;
