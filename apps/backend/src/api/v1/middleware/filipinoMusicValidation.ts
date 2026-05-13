import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../models/responseModel";
import prisma from "../../../../prisma/client";
import { AddFilipinoToExampleDto, DeleteFilipinoFromExampleDto } from "@shared/types/FilipinoMusicDto";
import { addToExampleSchema, deleteFromExampleSchema } from "./musicSchemas";
import { getBearerAuth } from "./bearerAuth";
import { upsertUser } from "../utils/userHelper";

export async function validateFilipinoAddToExample(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> {
	const { error, value } = addToExampleSchema.validate(req.body, {
		abortEarly: false,
		stripUnknown: true,
	});

	if (error) {
		const errorMessage = error.details[0]?.message;
		res.status(400).json(errorResponse(errorMessage, "VALIDATION_ERROR"));
		return;
	}

	req.body = value;
	const { name, example } = req.body as AddFilipinoToExampleDto;

	try {
		const { userId } = getBearerAuth(req);

		if (!userId) {
			res.status(401).json(errorResponse("User not authenticated.", "UNAUTHORIZED"));
			return;
		}

		const user = await upsertUser(userId);

		const nameData = await prisma.filipinoMusic.findFirst({
			where: { name, userId: user.id },
		});

		if (!nameData) {
			res.status(404).json(errorResponse("Category not found.", "NOT_FOUND"));
			return;
		}

		const currentExamples = Array.isArray(nameData.examples) ? (nameData.examples as string[]) : [];

		if (currentExamples.includes(example.trim())) {
			res
				.status(400)
				.json(
					errorResponse(
						"A music example with the same name already exists.",
						"VALIDATION_ERROR"
					)
				);
			return;
		}

		next();
	} catch (error) {
		res.status(500).json(errorResponse("Database error during validation", "DATABASE_ERROR"));
	}
}

export async function validateFilipinoDeleteFromExample(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> {
	const { error, value } = deleteFromExampleSchema.validate(req.body, {
		abortEarly: false,
		stripUnknown: true,
	});

	if (error) {
		const errorMessage = error.details[0]?.message;
		res.status(400).json(errorResponse(errorMessage, "VALIDATION_ERROR"));
		return;
	}

	req.body = value;
	const { name, example } = req.body as DeleteFilipinoFromExampleDto;

	try {
		const { userId } = getBearerAuth(req);

		if (!userId) {
			res.status(401).json(errorResponse("User not authenticated.", "UNAUTHORIZED"));
			return;
		}

		const user = await upsertUser(userId);

		const nameData = await prisma.filipinoMusic.findFirst({
			where: { name, userId: user.id },
		});

		if (!nameData) {
			res.status(404).json(errorResponse("Category not found.", "NOT_FOUND"));
			return;
		}

		const currentExamples = Array.isArray(nameData.examples) ? (nameData.examples as string[]) : [];

		if (!currentExamples.includes(example.trim())) {
			res
				.status(404)
				.json(
					errorResponse(
						"Music not found in this category.",
						"NOT_FOUND"
					)
				);
			return;
		}

		next();
	} catch (error) {
		res.status(500).json(errorResponse("Database error during validation", "DATABASE_ERROR"));
	}
}