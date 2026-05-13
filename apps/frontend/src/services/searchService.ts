import type { MusicData } from '@shared/types/MusicData';
import * as ChineseMusicService  from "./chinese/chineseMusicService";
import * as FilipinoMusicService from './filipino/filipinoMusicService';
import * as KoreanMusicService from './korean/koreanMusicService';

export interface SearchResult {
    country: string;
    categoryName: string;
    categoryDescription: string;
    examples: string[];
    matchType: 'category' | 'example' | 'description';
}

export const getAllMusicData = async (sessionToken?: string): Promise<MusicData[]> => {
    const koreanMusicData = await KoreanMusicService.getKoreaMusics(sessionToken);
    const chineseMusicData = await ChineseMusicService.getChineseMusics(sessionToken);
    const filipinoMusicData = await FilipinoMusicService.getFilipinoMusics(sessionToken);
    return [chineseMusicData, koreanMusicData, filipinoMusicData];
};

export const searchMusic = async (query: string, sessionToken?: string): Promise<SearchResult[]> => {
    if (!query.trim() || query.length < 2) {
        return [];
    }

    const results: SearchResult[] = [];
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

export const getAllCategories = async (sessionToken?: string): Promise<SearchResult[]> => {
    const allMusicData = await getAllMusicData(sessionToken);
    const results: SearchResult[] = [];

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

const extractCountryName = (title: string): string => {
    return title.replace(" Music", ""); 
};

const findMatchInCategory = (category: any, query: string): { hasMatch: boolean; matchType: 'category' | 'example' | 'description' } => {
    const categoryNameMatch = category.name.toLowerCase().includes(query);
    
    if (categoryNameMatch) {
        return { hasMatch: true, matchType: 'category' };
    }
    
    const exampleMatches = category.examples.some((example: string) => 
        example.toLowerCase().includes(query)
    );
    
    if (exampleMatches) {
        return { hasMatch: true, matchType: 'example' };
    }
    
    const descriptionMatch = category.description.toLowerCase().includes(query);
    
    if (descriptionMatch) {
        return { hasMatch: true, matchType: 'description' };
    }
    
    return { hasMatch: false, matchType: 'category' };
};


const sortSearchResults = (results: SearchResult[]): SearchResult[] => {
    const priority = { 'category': 3, 'example': 2, 'description': 1 };
    
    return results.sort((a, b) => {
        // First by match type priority
        const priorityDiff = priority[b.matchType] - priority[a.matchType];
        if (priorityDiff !== 0) return priorityDiff;
        
        // Then by country alphabetically
        return a.country.localeCompare(b.country);
    });
};