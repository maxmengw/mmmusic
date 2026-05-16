import { Router, Request, Response } from "express";
import { MusicController } from "../api/v1/controllers/musicController";
import { requireBearerAuth } from "../api/v1/middleware/bearerAuth";
import { validateAddMusic, validateDeleteMusic } from "../api/v1/middleware/musicValidation";
import { fetchMusicMeta } from '../api/v1/services/musicMetaService';
import { MUSIC_MAP_COUNTRIES } from '@shared/data/musicMapCountries';

const router = Router();
const controller = new MusicController();

// Simple in-memory rate limiter per-client (IP) for the public metadata proxy
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 10; // max requests per window per IP
const rateLimitMap = new Map<string, { count: number; reset: number }>();

router.get("/music", requireBearerAuth, async (req: Request, res: Response) => {
    return controller.getAll(req, res);
});

router.post("/music/add", requireBearerAuth, validateAddMusic, async (req: Request, res: Response) => {
    return controller.addMusic(req, res);
});

router.delete("/music/delete", requireBearerAuth, validateDeleteMusic, async (req: Request, res: Response) => {
    return controller.deleteMusic(req, res);
});

// Public proxy endpoint for MusicBrainz metadata + Cover Art Archive
router.get('/music/meta', async (req: Request, res: Response) => {
    try {
        // rate limiting by IP to protect downstream MusicBrainz
        const clientIp = (req.ip || (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown').toString();
        const now = Date.now();
        const existing = rateLimitMap.get(clientIp) || { count: 0, reset: now + RATE_LIMIT_WINDOW_MS };
        if (now > existing.reset) {
            existing.count = 0;
            existing.reset = now + RATE_LIMIT_WINDOW_MS;
        }
        if (existing.count >= RATE_LIMIT_MAX) {
            const retryAfter = Math.ceil((existing.reset - now) / 1000);
            res.setHeader('Retry-After', String(retryAfter));
            return res.status(429).json({ success: false, message: 'Rate limit exceeded. Try again later.' });
        }
        existing.count += 1;
        rateLimitMap.set(clientIp, existing);

        const { artist, title } = req.query as any;
        const meta = await fetchMusicMeta(artist, title);
        return res.status(200).json({ success: true, data: meta });
    } catch (err: any) {
        return res.status(500).json({ success: false, message: err?.message || 'Internal error' });
    }
});

// Serve generated map country dataset to frontend
router.get('/music/mapcountries', async (_req: Request, res: Response) => {
    try {
        return res.status(200).json({ success: true, data: MUSIC_MAP_COUNTRIES });
    } catch (err: any) {
        return res.status(500).json({ success: false, message: err?.message || 'Internal error' });
    }
});

export default router;
