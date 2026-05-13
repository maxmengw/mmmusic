import { useState } from "react";
import * as addFormService from "../services/addFormService";
export function useAddForm(onSubmit, onClose) {
    const initialState = addFormService.getInitialFormState();
    const [field1, setField1] = useState(initialState.field1);
    const [field2, setField2] = useState(initialState.field2);
    // Clear form fields
    const clearForm = () => {
        const initialState = addFormService.getInitialFormState();
        setField1(initialState.field1);
        setField2(initialState.field2);
    };
    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        // Validate form before submission
        const validation = addFormService.validateAddForm(field1, field2);
        if (!validation.isValid) {
            addFormService.handleValidationError(validation.message);
            return;
        }
        // Submit form data
        addFormService.submitFormData(field1, field2, onSubmit);
        // Clear form and close
        clearForm();
        onClose();
    };
    // Handle form cancellation
    const handleCancel = () => {
        clearForm();
        onClose();
    };
    // Handle field1 change
    const handleField1Change = (value) => {
        const processedValue = addFormService.handleFieldChange(value);
        setField1(processedValue);
    };
    // Handle field2 change
    const handleField2Change = (value) => {
        const processedValue = addFormService.handleFieldChange(value);
        setField2(processedValue);
    };
    return {
        field1,
        field2,
        handleSubmit,
        handleCancel,
        handleField1Change,
        handleField2Change,
        clearForm,
    };
}
