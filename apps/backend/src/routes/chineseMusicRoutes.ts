import { Router, Request, Response } from "express";
import { ChineseMusicController } from "../api/v1/controllers/chineseMusicController";
import { requireBearerAuth } from "../api/v1/middleware/bearerAuth";
import {
	validateChineseAddToExample,
	validateChineseDeleteFromExample,
} from "../api/v1/middleware/chineseMusicValidation";

const router = Router();
const controller = new ChineseMusicController();

router.get("/chinesemusic", requireBearerAuth, async (req: Request, res: Response) => {
	return controller.getAll(req, res);
});

router.post(
	"/chinesemusic/add",
	requireBearerAuth,
	validateChineseAddToExample,
	async (req: Request, res: Response) => {
		return controller.addChineseMusic(req.body, req, res);
	}
);

router.delete(
	"/chinesemusic/delete",
	requireBearerAuth,
	validateChineseDeleteFromExample,
	async (req: Request, res: Response) => {
		return controller.deleteChineseMusic(req.body, req, res);
	}
);

export default router;