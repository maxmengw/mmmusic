import { Router, Request, Response } from "express";
import { FilipinoMusicController } from "../api/v1/controllers/filipinoMusicController";
import { requireBearerAuth } from "../api/v1/middleware/bearerAuth";
import {
	validateFilipinoAddToExample,
	validateFilipinoDeleteFromExample,
} from "../api/v1/middleware/filipinoMusicValidation";

const router = Router();
const controller = new FilipinoMusicController();

router.get("/filipinomusic", requireBearerAuth, async (req: Request, res: Response) => {
	return controller.getAll(req, res);
});

router.post(
	"/filipinomusic/add",
	requireBearerAuth,
	validateFilipinoAddToExample,
	async (req: Request, res: Response) => {
		return controller.addFilipinoMusic(req.body, req, res);
	}
);

router.delete(
	"/filipinomusic/delete",
	requireBearerAuth,
	validateFilipinoDeleteFromExample,
	async (req: Request, res: Response) => {
		return controller.deleteFilipinoMusic(req.body, req, res);
	}
);

export default router;