import { useState } from "react";
import * as deleteFormService from "../services/deleteFormService";
export function useDeleteForm(categories, onSubmit, onClose) {
    const initialState = deleteFormService.getInitialFormState();
    const [selectedCategory, setSelectedCategory] = useState(initialState.selectedCategory);
    const [selectedExamples, setSelectedExamples] = useState(initialState.selectedExamples);
    // Get available examples based on the selected category
    const availableExamples = deleteFormService.getAvailableExamples(categories, selectedCategory);
    // Toggle example selection
    const handleExampleToggle = (example) => {
        const updatedSelection = deleteFormService.toggleExampleSelection(selectedExamples, example);
        setSelectedExamples(updatedSelection);
    };
    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        const validation = deleteFormService.validateDeleteForm(selectedCategory, selectedExamples);
        if (!validation.isValid) {
            deleteFormService.handleValidationError(validation.message);
            return;
        }
        deleteFormService.processBatchDelete(selectedCategory, selectedExamples, onSubmit);
        const initialState = deleteFormService.getInitialFormState();
        setSelectedCategory(initialState.selectedCategory);
        setSelectedExamples(initialState.selectedExamples);
        onClose();
    };
    const handleCancel = () => {
        const initialState = deleteFormService.getInitialFormState();
        setSelectedCategory(initialState.selectedCategory);
        setSelectedExamples(initialState.selectedExamples);
        onClose();
    };
    const handleCategoryChange = (newCategory) => {
        setSelectedCategory(newCategory);
        setSelectedExamples([]); // Clear examples when category changes
    };
    return {
        selectedCategory,
        selectedExamples,
        availableExamples,
        handleExampleToggle,
        handleSubmit,
        handleCancel,
        handleCategoryChange,
    };
}
