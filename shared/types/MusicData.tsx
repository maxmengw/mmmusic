export interface MusicData {
    title: string;
    categories: Category[];
}

export interface Category {
    name: string;
    description: string;
    examples: string[];
}