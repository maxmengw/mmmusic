import type { DeleteFormProps } from "../interface/DeleteFormProps";

// Get available examples based on the selected category
export const getAvailableExamples = (
    categories: DeleteFormProps["categories"], 
    selectedCategory: string
): string[] => {
    if (!selectedCategory) {
        return [];
    }
    
    const foundCategory = categories.find(cat => cat.name === selectedCategory);
    return foundCategory?.examples || [];
};

// Toggle example selection logic
export const toggleExampleSelection = (
    selectedExamples: string[], 
    example: string
): string[] => {
    if (selectedExamples.includes(example)) {
        // Remove example from selectedExamples
        return selectedExamples.filter(item => item !== example);
    } else {
        // Add example to selectedExamples
        return [...selectedExamples, example];
    }
};

// Validate delete form before submission
export const validateDeleteForm = (
    selectedCategory: string, 
    selectedExamples: string[]
): { isValid: boolean; message?: string } => {
    if (!selectedCategory.trim()) {
        return { 
            isValid: false, 
            message: 'Please select a category' 
        };
    }
    
    if (selectedExamples.length === 0) {
        return { 
            isValid: false, 
            message: 'Please select at least one example to delete' 
        };
    }
    
    return { isValid: true };
};

// Handle validation error with user notification
export const handleValidationError = (message: string): void => {
    alert(message);
};

// Process batch deletion
export const processBatchDelete = (
    selectedCategory: string,
    selectedExamples: string[],
    onSubmit: DeleteFormProps["onSubmit"]
): void => {
    for (const example of selectedExamples) {
        onSubmit(selectedCategory, example);
    }
};

// Clear form state
export const getInitialFormState = () => ({
    selectedCategory: "",
    selectedExamples: [] as string[]
});