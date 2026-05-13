export interface AddFormProps {
    field1Label: string; // "Name", "Artist", "Category"
    field2Label: string; //  "Example", "Song", "Track"
    field1Options: string[]; // field1's dropdown options
    onSubmit: (field1: string, field2: string) => void;
    onClose: () => void;
    className?: string;
}