export interface FilipinoMusicDto {
	id: string;
	name: string;
	description: string;
	examples: string[];
}

export interface AddFilipinoToExampleDto {
	name: string;
	example: string;
}

export interface DeleteFilipinoFromExampleDto {
	name: string;
	example: string;
}