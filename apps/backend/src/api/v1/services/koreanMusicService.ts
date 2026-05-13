import prisma from "../../../../prisma/client";
import { KoreanMusicDto } from "@shared/types/KoreanMusicDto";
import { formatKoreanMusic } from "../utils/formatKoreanMusic";
import { upsertUser } from "../utils/userHelper";

export const fetchAllKoreanMusic = async (clerkUserId?: string): Promise<KoreanMusicDto[]> => {
	if (clerkUserId) {
		const user = await upsertUser(clerkUserId);

		const userKoreanMusics = await prisma.koreanMusic.findMany({
			where: { userId: user.id },
			orderBy: {
				name: 'asc'
			}
		});

		if (userKoreanMusics.length === 0) {
			const seedKoreanMusics = await prisma.koreanMusic.findMany({
				where: { userId: null },
				orderBy: {
					name: 'asc'
				}
			});

			for (const seedMusic of seedKoreanMusics) {
				await prisma.koreanMusic.create({
					data: {
						name: seedMusic.name,
						description: seedMusic.description,
						examples: seedMusic.examples as any,
						userId: user.id,
					},
				});
			}

			const data = await prisma.koreanMusic.findMany({
				where: { userId: user.id },
				orderBy: {
					name: 'asc'
				}
			});
			return data.map(formatKoreanMusic);
		} else {
			return userKoreanMusics.map(formatKoreanMusic);
		}
	} else {
	const data = await prisma.koreanMusic.findMany({
			where: { userId: null },
		orderBy: {
			name: 'asc'
		}
	});
	return data.map(formatKoreanMusic);
	}
};
	
export const addKoreanMusicToExample = async (
	name: string,
	example: string,
	clerkUserId: string
): Promise<KoreanMusicDto> => {
	const user = await upsertUser(clerkUserId);

	const nameData = await prisma.koreanMusic.findFirst({
		where: {
			name,
			userId: user.id
		}
	});

	if (!nameData) {
		const error = new Error("Singer not found") as Error & { statusCode?: number };
		error.statusCode = 404;
		throw error;
	}

	const currentExamples = Array.isArray(nameData.examples) ? (nameData.examples as string[]) : [];

	if (currentExamples.includes(example.trim())) {
		const error = new Error("A music example with the same name already exists.") as Error & { statusCode?: number };
		error.statusCode = 400;
		throw error;
	}

	const updated = await prisma.koreanMusic.update({
		where: { id: nameData.id },
		data: { examples: [...currentExamples, example] }
	});

	return formatKoreanMusic(updated);
};

export const deleteKoreanMusicFromExample = async (
	name: string,
	example: string,
	clerkUserId: string
): Promise<KoreanMusicDto> => {
	const user = await upsertUser(clerkUserId);

	const nameData = await prisma.koreanMusic.findFirst({
		where: {
			name,
			userId: user.id
		}
	});

	if (!nameData) {
		const error = new Error("Singer not found") as Error & { statusCode?: number };
		error.statusCode = 404;
		throw error;
	}

	const currentExamples = Array.isArray(nameData.examples) ? (nameData.examples as string[]) : [];

	const updated = await prisma.koreanMusic.update({
		where: { id: nameData.id },
		data: { examples: currentExamples.filter((n) => n !== example) }
	});

	return formatKoreanMusic(updated);
};