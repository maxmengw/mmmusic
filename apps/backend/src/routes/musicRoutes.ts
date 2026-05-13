import { Router, Request, Response } from "express";
import { MusicController } from "../api/v1/controllers/musicController";
import { requireBearerAuth } from "../api/v1/middleware/bearerAuth";
import { validateAddMusic, validateDeleteMusic } from "../api/v1/middleware/musicValidation";

const router = Router();
const controller = new MusicController();

router.get("/music", requireBearerAuth, async (req: Request, res: Response) => {
    return controller.getAll(req, res);
});

router.post("/music/add", requireBearerAuth, validateAddMusic, async (req: Request, res: Response) => {
    return controller.addMusic(req, res);
});

router.delete("/music/delete", requireBearerAuth, validateDeleteMusic, async (req: Request, res: Response) => {
    return controller.deleteMusic(req, res);
});

export default router;
