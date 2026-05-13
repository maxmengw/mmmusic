export interface ChineseMusicDto {
	id?: string;
	name: string;
	description: string;
	examples: string[];
}

export interface AddChineseToExampleDto {
	name: string;
	example: string;
}

export interface DeleteChineseFromExampleDto {
	name: string;
	example: string;
}