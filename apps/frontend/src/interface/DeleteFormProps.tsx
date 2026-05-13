export interface DeleteFormProps {
    categoryLabel: string; // "Name", "Category"
    exampleLabel: string; // "Example", "Song"
    categories: { name: string; examples: string[] }[];
    onSubmit: (categoryName: string, example: string) => void;
    onClose: () => void;
    className?: string;
}