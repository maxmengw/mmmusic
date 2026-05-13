import { FilipinoMusic } from "@prisma/client";
import { FilipinoMusicDto } from "@shared/types/FilipinoMusicDto";

export function formatFilipinoMusic(data: FilipinoMusic): FilipinoMusicDto {
	return {
		id: data.id,
		name: data.name,
		description: data.description,
		examples: Array.isArray(data.examples) ? (data.examples as string[]) : []
	};
}