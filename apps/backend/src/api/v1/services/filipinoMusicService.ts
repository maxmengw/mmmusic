import prisma from "../../../../prisma/client";
import { FilipinoMusicDto } from "@shared/types/FilipinoMusicDto";
import { formatFilipinoMusic } from "../utils/formatFilipinoMusic";
import { upsertUser } from "../utils/userHelper";

export const fetchAllFilipinoMusic = async (clerkUserId?: string): Promise<FilipinoMusicDto[]> => {
	if (clerkUserId) {
		const user = await upsertUser(clerkUserId);

		const userFilipinoMusics = await prisma.filipinoMusic.findMany({
			where: { userId: user.id },
			orderBy: {
				name: 'asc'
			}
		});

		if (userFilipinoMusics.length === 0) {
			const seedFilipinoMusics = await prisma.filipinoMusic.findMany({
				where: { userId: null },
				orderBy: {
					name: 'asc'
				}
			});

			for (const seedMusic of seedFilipinoMusics) {
				await prisma.filipinoMusic.create({
					data: {
						name: seedMusic.name,
						description: seedMusic.description,
						examples: seedMusic.examples as any,
						userId: user.id,
					},
				});
			}

			const data = await prisma.filipinoMusic.findMany({
				where: { userId: user.id },
				orderBy: {
					name: 'asc'
				}
			});
			return data.map(formatFilipinoMusic);
		} else {
			return userFilipinoMusics.map(formatFilipinoMusic);
		}
	} else {
		const data = await prisma.filipinoMusic.findMany({
			where: { userId: null },
			orderBy: {
				name: 'asc'
			}
		});
		return data.map(formatFilipinoMusic);
	}
};

export const addFilipinoMusicToExample = async (
	name: string,
	example: string,
	clerkUserId: string
): Promise<FilipinoMusicDto> => {
	const user = await upsertUser(clerkUserId);

	const nameData = await prisma.filipinoMusic.findFirst({
		where: { name, userId: user.id }
	});

	if (!nameData) {
		const error = new Error("Category not found") as Error & { statusCode?: number };
		error.statusCode = 404;
		throw error;
	}

	const currentExamples = Array.isArray(nameData.examples) ? (nameData.examples as string[]) : [];

	if (currentExamples.includes(example.trim())) {
		const error = new Error("A music example with the same name already exists.") as Error & { statusCode?: number };
		error.statusCode = 400;
		throw error;
	}

	const updated = await prisma.filipinoMusic.update({
		where: { id: nameData.id },
		data: { examples: [...currentExamples, example] }
	});

	return formatFilipinoMusic(updated);
};

export const deleteFilipinoMusicFromExample = async (
	name: string,
	example: string,
	clerkUserId: string
): Promise<FilipinoMusicDto> => {
	const user = await upsertUser(clerkUserId);

	const nameData = await prisma.filipinoMusic.findFirst({
		where: { name, userId: user.id }
	});

	if (!nameData) {
		const error = new Error("Category not found") as Error & { statusCode?: number };
		error.statusCode = 404;
		throw error;
	}

	const currentExamples = Array.isArray(nameData.examples) ? (nameData.examples as string[]) : [];

	const updated = await prisma.filipinoMusic.update({
		where: { id: nameData.id },
		data: { examples: currentExamples.filter((n) => n !== example) }
	});

	return formatFilipinoMusic(updated);
};