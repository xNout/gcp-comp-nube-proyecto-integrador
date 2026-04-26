import { Router, Request, Response } from 'express';
import { MESSAGES } from '../config/messages.config';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.render('index', {
    title: MESSAGES.home.pageTitle,
  });
});

export default router;
