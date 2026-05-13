import { Request, Response } from "express";
import { successResponse, errorResponse } from "../models/responseModel";
import * as MusicService from "../services/musicService";

export class MusicController {
    async getAll(req: Request, res: Response) {
        try {
            const userId = (req as any).clerkUserId as string | undefined;
            const data = await MusicService.fetchAllMusic(userId || undefined);
            return res.status(200).json(successResponse(data, "Music retrieved successfully"));
        } catch (err: any) {
            return res.status(err?.statusCode || 500).json(errorResponse(err?.message || 'Internal error'));
        }
    }

    async addMusic(req: Request, res: Response) {
        try {
            const { name, example } = req.body;
            const userId = (req as any).clerkUserId as string | undefined;
            const updated = await MusicService.addMusicToExample(name, example, userId!);
            return res.status(201).json(successResponse(updated, "Music added successfully"));
        } catch (err: any) {
            return res.status(err?.statusCode || 500).json(errorResponse(err?.message || 'Internal error'));
        }
    }

    async deleteMusic(req: Request, res: Response) {
        try {
            const { name, example } = req.body;
            const userId = (req as any).clerkUserId as string | undefined;
            const result = await MusicService.deleteMusicFromExample(name, example, userId!);
            return res.status(200).json(successResponse(result, "Music deleted successfully"));
        } catch (err: any) {
            return res.status(err?.statusCode || 500).json(errorResponse(err?.message || 'Internal error'));
        }
    }
}
