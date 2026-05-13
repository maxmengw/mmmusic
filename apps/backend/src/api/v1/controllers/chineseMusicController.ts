import "reflect-metadata";
import { Request, Response } from "express";
import * as ChineseMusicService from "../services/chineseMusicService";
import { successResponse } from "../models/responseModel";
import { Controller, Delete, Get, Post, Req, Res, Body, UseBefore } from "routing-controllers";
import { AddChineseToExampleDto, DeleteChineseFromExampleDto } from "@shared/types/ChineseMusicDto";
import { getBearerAuth, requireBearerAuth } from "../middleware/bearerAuth";

@Controller()
export class ChineseMusicController {
	@Get("/chinesemusic")
	@UseBefore(requireBearerAuth)
	async getAll(@Req() req: Request, @Res() res: Response) {
		try {
			const { userId } = getBearerAuth(req);
			const chineseMusic = await ChineseMusicService.fetchAllChineseMusic(userId || undefined);
			return res.status(200).json(successResponse(chineseMusic, "Chinese music retrieved successfully"));
		} catch (error) {
			throw error;
		}
	}

	@Post("/chinesemusic/add")
	@UseBefore(requireBearerAuth)
	async addChineseMusic(@Body() body: AddChineseToExampleDto, @Req() req: Request, @Res() res: Response) {
		try {
			const { name, example } = body;
			const { userId } = getBearerAuth(req);
			const updatedChineseMusic = await ChineseMusicService.addChineseMusicToExample(name, example, userId!);
			return res.status(201).json(successResponse(updatedChineseMusic, "Chinese music added successfully"));
		} catch (error) {
			throw error;
		}
	}

	@Delete("/chinesemusic/delete")
	@UseBefore(requireBearerAuth)
	async deleteChineseMusic(@Body() body: DeleteChineseFromExampleDto, @Req() req: Request, @Res() res: Response) {
		try {
			const { name, example } = body;
			const { userId } = getBearerAuth(req);
			const result = await ChineseMusicService.deleteChineseMusicFromExample(name, example, userId!);
			return res.status(200).json(successResponse(result, "Chinese music deleted successfully"));
		} catch (error) {
			throw error;
		}
	}
}