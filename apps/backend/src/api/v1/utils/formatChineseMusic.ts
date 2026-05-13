import { ChineseMusic } from "@prisma/client";
import { ChineseMusicDto } from "@shared/types/ChineseMusicDto";

export function formatChineseMusic(data: ChineseMusic): ChineseMusicDto {
	return {
		id: data.id,
		name: data.name,
		description: data.description,
		examples: Array.isArray(data.examples) ? (data.examples as string[]) : []
	};
}