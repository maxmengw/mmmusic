import "reflect-metadata";
import { Request, Response } from "express";
import * as KoreaMusicService from "../services/koreanMusicService";
import { successResponse } from "../models/responseModel";
import { Controller, Delete, Get, Post, Req, Res, Body, UseBefore } from "routing-controllers";
import { requireBearerAuth, getBearerAuth } from "../middleware/bearerAuth";
import { AddKoreanToExampleDto, DeleteKoreanFromExampleDto } from "@shared/types/KoreanMusicDto";

@Controller()
export class KoreanMusicController {
	@Get("/koreanmusic")
	@UseBefore(requireBearerAuth)
	async getAll(@Req() req: Request, @Res() res: Response) {
		try {
			const { userId } = getBearerAuth(req);
			const koreanMusic = await KoreaMusicService.fetchAllKoreanMusic(userId || undefined);
			return res.status(200).json(successResponse(koreanMusic, "Korean music retrieved successfully"));
		} catch (error) {
			throw error;
		}
	}

	@Post("/koreanmusic/add")
	@UseBefore(requireBearerAuth)
	async addKoreanMusic(@Body() body: AddKoreanToExampleDto, @Req() req: Request, @Res() res: Response) {
		try {
			const { name, example } = body;
			const { userId } = getBearerAuth(req);
			const updatedKoreanMusic = await KoreaMusicService.addKoreanMusicToExample(name, example, userId!);
			return res.status(201).json(successResponse(updatedKoreanMusic, "Korean music added successfully"));
		} catch (error) {
			throw error;
		}
	}

	@Delete("/koreanmusic/delete")
	@UseBefore(requireBearerAuth)
	async deleteKoreanMusic(@Body() body: DeleteKoreanFromExampleDto, @Req() req: Request, @Res() res: Response) {
		try {
			const { name, example } = body;
			const { userId } = getBearerAuth(req);
			const result = await KoreaMusicService.deleteKoreanMusicFromExample(name, example, userId!);
			return res.status(200).json(successResponse(result, "Korean music deleted successfully"));
		} catch (error) {
			throw error;
		}
	}
}