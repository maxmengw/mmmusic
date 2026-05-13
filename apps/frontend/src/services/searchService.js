import * as KoreanMusicService from './music/musicService';
export const getAllMusicData = async (sessionToken) => {
    const musicData = await KoreanMusicService.getMusics(sessionToken);
    return [musicData];
};
export const searchMusic = async (query, sessionToken) => {
    if (!query.trim() || query.length < 2) {
        return [];
    }
    const results = [];
    const allMusicData = await getAllMusicData(sessionToken);
    const lowercaseQuery = query.toLowerCase();
    allMusicData.forEach(musicData => {
        const country = extractCountryName(musicData.title);
        musicData.categories.forEach(category => {
            const match = findMatchInCategory(category, lowercaseQuery);
            if (match.hasMatch) {
                results.push({
                    country,
                    categoryName: category.name,
                    categoryDescription: category.description,
                    examples: category.examples,
                    matchType: match.matchType
                });
            }
        });
    });
    return sortSearchResults(results);
};
export const getAllCategories = async (sessionToken) => {
    const allMusicData = await getAllMusicData(sessionToken);
    const results = [];
    allMusicData.forEach(musicData => {
        const country = extractCountryName(musicData.title);
        musicData.categories.forEach(category => {
            results.push({
                country,
                categoryName: category.name,
                categoryDescription: category.description,
                examples: category.examples,
                matchType: 'category'
            });
        });
    });
    return results;
};
const extractCountryName = (title) => {
    return title.replace(" Music", "");
};
const findMatchInCategory = (category, query) => {
    const categoryNameMatch = category.name.toLowerCase().includes(query);
    if (categoryNameMatch) {
        return { hasMatch: true, matchType: 'category' };
    }
    const exampleMatches = category.examples.some((example) => example.toLowerCase().includes(query));
    if (exampleMatches) {
        return { hasMatch: true, matchType: 'example' };
    }
    const descriptionMatch = category.description.toLowerCase().includes(query);
    if (descriptionMatch) {
        return { hasMatch: true, matchType: 'description' };
    }
    return { hasMatch: false, matchType: 'category' };
};
const sortSearchResults = (results) => {
    const priority = { 'category': 3, 'example': 2, 'description': 1 };
    return results.sort((a, b) => {
        // First by match type priority
        const priorityDiff = priority[b.matchType] - priority[a.matchType];
        if (priorityDiff !== 0)
            return priorityDiff;
        // Then by country alphabetically
        return a.country.localeCompare(b.country);
    });
};
