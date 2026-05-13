export interface KoreanMusicDto {
	id?: string;
	name: string;
	description: string;
	examples: string[];
}

export interface AddKoreanToExampleDto {
	name: string;
	example: string;
}

export interface DeleteKoreanFromExampleDto {
	name: string;
	example: string;
}