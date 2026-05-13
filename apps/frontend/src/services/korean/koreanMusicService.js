import * as KoreanMusicRepo from '../../apis/korean/koreanMusicRepo';
function mapMusicToName(koreanMusic) {
    return {
        name: koreanMusic.name,
        description: koreanMusic.description || "",
        examples: Array.isArray(koreanMusic.examples) ? koreanMusic.examples : []
    };
}
export async function getKoreaMusics(sessionToken) {
    const koreaMusics = await KoreanMusicRepo.getKoreaMusics(sessionToken);
    return {
        title: "Korean Musics",
        categories: koreaMusics.map(mapMusicToName)
    };
}
export async function addKoreanMusicToExample(name, example, sessionToken) {
    const result = await KoreanMusicRepo.addKoreanMusicToExample(name, example, sessionToken);
    return result.message;
}
export async function deleteKoreanMusicFromExample(name, example, sessionToken) {
    const result = await KoreanMusicRepo.deleteKoreanMusicFromExample(name, example, sessionToken);
    return result.message;
}
