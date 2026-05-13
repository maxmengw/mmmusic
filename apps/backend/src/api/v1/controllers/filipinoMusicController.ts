import "reflect-metadata";
import { Request, Response } from "express";
import * as FilipinoMusicService from "../services/filipinoMusicService";
import { successResponse } from "../models/responseModel";
import { Controller, Delete, Get, Post, Req, Res, Body, UseBefore } from "routing-controllers";
import { AddFilipinoToExampleDto, DeleteFilipinoFromExampleDto } from "@shared/types/FilipinoMusicDto";
import { getBearerAuth, requireBearerAuth } from "../middleware/bearerAuth";

@Controller()
export class FilipinoMusicController {
	@Get("/filipinomusic")
	@UseBefore(requireBearerAuth)
	async getAll(@Req() req: Request, @Res() res: Response) {
		try {
			const { userId } = getBearerAuth(req);
			const filipinoMusic = await FilipinoMusicService.fetchAllFilipinoMusic(userId || undefined);
			return res.status(200).json(successResponse(filipinoMusic, "Filipino music retrieved successfully"));
		} catch (error) {
			throw error;
		}
	}

	@Post("/filipinomusic/add")
	@UseBefore(requireBearerAuth)
	async addFilipinoMusic(@Body() body: AddFilipinoToExampleDto, @Req() req: Request, @Res() res: Response) {
		try {
			const { name, example } = body;
			const { userId } = getBearerAuth(req);
			const updatedFilipinoMusic = await FilipinoMusicService.addFilipinoMusicToExample(name, example, userId!);
			return res.status(201).json(successResponse(updatedFilipinoMusic, "Filipino music added successfully"));
		} catch (error) {
			throw error;
		}
	}

	@Delete("/filipinomusic/delete")
	@UseBefore(requireBearerAuth)
	async deleteFilipinoMusic(@Body() body: DeleteFilipinoFromExampleDto, @Req() req: Request, @Res() res: Response) {
		try {
			const { name, example } = body;
			const { userId } = getBearerAuth(req);
			const result = await FilipinoMusicService.deleteFilipinoMusicFromExample(name, example, userId!);
			return res.status(200).json(successResponse(result, "Filipino music deleted successfully"));
		} catch (error) {
			throw error;
		}
	}
}