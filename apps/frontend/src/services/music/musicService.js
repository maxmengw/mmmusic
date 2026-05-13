import * as MusicRepo from '../../apis/music/musicRepo';
function mapMusicToName(music) {
    return {
        name: music.name,
        description: music.description || "",
        examples: Array.isArray(music.examples) ? music.examples : []
    };
}
export async function getMusics(sessionToken) {
    const musics = await MusicRepo.getMusics(sessionToken);
    return {
        title: "Music",
        categories: musics.map(mapMusicToName)
    };
}
export async function addMusicToExample(name, example, sessionToken) {
    const result = await MusicRepo.addMusicToExample(name, example, sessionToken);
    return result.message;
}
export async function deleteMusicFromExample(name, example, sessionToken) {
    const result = await MusicRepo.deleteMusicFromExample(name, example, sessionToken);
    return result.message;
}
// Legacy re-exports removed; use new `getMusics`, `addMusicToExample`, `deleteMusicFromExample`
