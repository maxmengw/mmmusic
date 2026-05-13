import * as FilipinoMusicRepo from '../../apis/filipino/filipinoMusicRepo';
import type { MusicData } from "@shared/types/MusicData";
import type { FilipinoMusicDto } from "@shared/types/FilipinoMusicDto";

function mapMusicToCategory(filipinoMusic: FilipinoMusicDto) {
    return {
        name: filipinoMusic.name,
        description: filipinoMusic.description || "",
        examples: Array.isArray(filipinoMusic.examples) ? filipinoMusic.examples : []
    };
}

export async function getFilipinoMusics(sessionToken?: string): Promise<MusicData> {
    const filipinoMusics = await FilipinoMusicRepo.getFilipinoMusics(sessionToken);

    return {
        title: "Filipino Music",
        categories: filipinoMusics.map(mapMusicToCategory)
    };
}

export async function addFilipinoMusicToExample(name: string, example: string, sessionToken: string): Promise<string | undefined> {
    const result = await FilipinoMusicRepo.addFilipinoMusicToCategory(name, example, sessionToken);
    return result.message;
}

export async function deleteFilipinoMusicFromExample(name: string, example: string, sessionToken: string): Promise<string | undefined> {
    const result = await FilipinoMusicRepo.deleteFilipinoMusicFromCategory(name, example, sessionToken);
    return result.message;
}