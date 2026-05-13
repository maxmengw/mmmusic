import { KoreanMusic } from "@prisma/client";
import { KoreanMusicDto } from "@shared/types/KoreanMusicDto";

export function formatKoreanMusic(data: KoreanMusic): KoreanMusicDto {
	return {
		id: data.id,
		name: data.name,
		description: data.description,
		examples: Array.isArray(data.examples) ? (data.examples as string[]) : []
	};
}