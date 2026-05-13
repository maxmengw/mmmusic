import * as MusicRepo from '../../apis/music/musicRepo';
import type { MusicData } from "@shared/types/MusicData";
import type { MusicDto } from "@shared/types/MusicDto";

function mapMusicToName(music: MusicDto) {
    return {
        name: music.name,
        description: music.description || "",
        examples: Array.isArray(music.examples) ? music.examples : []
    };
}

export async function getMusics(sessionToken?: string): Promise<MusicData> {
    const musics = await MusicRepo.getMusics(sessionToken);

    return {
        title: "Music",
        categories: musics.map(mapMusicToName)
    };
}

export async function addMusicToExample(name: string, example: string, sessionToken: string): Promise<string | undefined> {
    const result = await MusicRepo.addMusicToExample(name, example, sessionToken);
    return result.message;
}

export async function deleteMusicFromExample(name: string, example: string, sessionToken: string): Promise<string | undefined> {
    const result = await MusicRepo.deleteMusicFromExample(name, example, sessionToken);
    return result.message;
}
// Legacy re-exports removed; use new `getMusics`, `addMusicToExample`, `deleteMusicFromExample`
