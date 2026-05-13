import { Router, Request, Response } from 'express';
import { requireBearerAuth } from '../api/v1/middleware/bearerAuth';
import { YouTubeMusicController } from '../api/v1/controllers/youtubeMusicController';

const router = Router();
const controller = new YouTubeMusicController();

router.get('/youtubemusicslist', requireBearerAuth, async (req: Request, res: Response) => {
  return controller.getAll(req, res);
});

router.get('/playlist', requireBearerAuth, async (req: Request, res: Response) => {
  return controller.getPlaylist(req, res);
});

router.post('/playlist/add', requireBearerAuth, async (req: Request, res: Response) => {
  return controller.addToPlaylist(req.body, req, res);
});

router.delete('/playlist/:videoId', requireBearerAuth, async (req: Request, res: Response) => {
  const { videoId } = req.params;
  return controller.deleteFromPlaylist(videoId, req, res);
});

export default router;
