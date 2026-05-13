import prisma from "../../../../prisma/client";
import { ChineseMusicDto } from "@shared/types/ChineseMusicDto";
import { formatChineseMusic } from "../utils/formatChineseMusic";
import { upsertUser } from "../utils/userHelper";

export const fetchAllChineseMusic = async (clerkUserId?: string): Promise<ChineseMusicDto[]> => {
	if (clerkUserId) {
		const user = await upsertUser(clerkUserId);

		const userChineseMusics = await prisma.chineseMusic.findMany({
			where: { userId: user.id },
			orderBy: {
				name: 'asc'
			}
		});

		if (userChineseMusics.length === 0) {
			const seedChineseMusics = await prisma.chineseMusic.findMany({
				where: { userId: null },
				orderBy: {
					name: 'asc'
				}
			});

			for (const seedMusic of seedChineseMusics) {
				await prisma.chineseMusic.create({
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
			return data.map(formatChineseMusic);
		} else {
			return userChineseMusics.map(formatChineseMusic);
		}
	} else {
	const data = await prisma.chineseMusic.findMany({
		where: { userId: null },
		orderBy: {
			name: 'asc'
		}
	});
	return data.map(formatChineseMusic);
	}
};
	
export const addChineseMusicToExample = async (
	name: string,
	example: string, 
	clerkUserId: string
): Promise<ChineseMusicDto> => {
	const user = await upsertUser(clerkUserId);
	const nameData = await prisma.chineseMusic.findFirst({
		where: { name, userId: user.id }
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

	const updated = await prisma.chineseMusic.update({
		where: { id: nameData.id },
		data: { examples: [...currentExamples, example] }
	});

	return formatChineseMusic(updated);
};

export const deleteChineseMusicFromExample = async (
	name: string,
	example: string,
	clerkUserId: string
): Promise<ChineseMusicDto> => {
	const user = await upsertUser(clerkUserId);
	const nameData = await prisma.chineseMusic.findFirst({
		where: { name, userId: user.id }
	});

	if (!nameData) {
		const error = new Error("Singer not found") as Error & { statusCode?: number };
		error.statusCode = 404;
		throw error;
	}

	const currentExamples = Array.isArray(nameData.examples) ? (nameData.examples as string[]) : [];

	const updated = await prisma.chineseMusic.update({
		where: { id: nameData.id },
		data: { examples: currentExamples.filter((n) => n !== example) }
	});

	return formatChineseMusic(updated);
};