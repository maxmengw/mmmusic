export interface MusicDto {
    id?: string;
    name: string;
    description: string;
    examples: string[];
}

export interface AddMusicToExampleDto {
    name: string;
    example: string;
}

export interface DeleteMusicFromExampleDto {
    name: string;
    example: string;
}
