import { Router, Request, Response } from "express";
import { requireBearerAuth } from "../api/v1/middleware/bearerAuth";
import { KoreanMusicController } from "../api/v1/controllers/koreanMusicController";
import {
	validateKoreanAddToExample,
	validateKoreanDeleteFromExample,
} from "../api/v1/middleware/koreanMusicValidation";

const router = Router();
const controller = new KoreanMusicController();

router.get("/koreanmusic", requireBearerAuth, async (req: Request, res: Response) => {
	return controller.getAll(req, res);
});

router.post(
	"/koreanmusic/add",
	requireBearerAuth,
	validateKoreanAddToExample,
	async (req: Request, res: Response) => {
		return controller.addKoreanMusic(req.body, req, res);
	}
);

router.delete(
	"/koreanmusic/delete",
	requireBearerAuth,
	validateKoreanDeleteFromExample,
	async (req: Request, res: Response) => {
		return controller.deleteKoreanMusic(req.body, req, res);
	}
);

export default router;