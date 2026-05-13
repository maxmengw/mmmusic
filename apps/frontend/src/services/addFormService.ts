import type { AddFormProps } from "../interface/AddFormProps";

// Validate add form fields
export const validateAddForm = (
    field1: string, 
    field2: string
): { isValid: boolean; message?: string } => {
    if (!field1.trim()) {
        return { 
            isValid: false, 
            message: 'Please select a category' 
        };
    }
    
    if (!field2.trim()) {
        return { 
            isValid: false, 
            message: 'Please enter an example' 
        };
    }
    
    return { isValid: true };
};

// Handle validation error with user notification
export const handleValidationError = (message: string): void => {
    alert(message || 'Sweety, please fill in this, Thank you! :)');
};

// Process form data before submission
export const processFormData = (field1: string, field2: string) => {
    return {
        category: field1.trim(),
        example: field2.trim()
    };
};

// Submit form data
export const submitFormData = (
    field1: string,
    field2: string,
    onSubmit: AddFormProps["onSubmit"]
): void => {
    const processedData = processFormData(field1, field2);
    onSubmit(processedData.category, processedData.example);
};

// Get initial form state
export const getInitialFormState = () => ({
    field1: "",
    field2: ""
});

// Handle field value change with validation
export const handleFieldChange = (value: string): string => {
    return value;
};