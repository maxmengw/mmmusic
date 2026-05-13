/**
 * DeleteForm Component
 * (Reusable form for deleting music examples)
 * 
 * User picks a category, sees checkboxes for all examples,
 * then selects what to delete, then submits.
 * 
 * Works for Filipino, Korean, and Chinese pages.
 * This Component only handles the UI, parent handles calling the service/repo 
 */

import type { DeleteFormProps } from '../../../interface/DeleteFormProps';
import { useDeleteForm } from '../../../hooks/useDeleteForm';

export default function DeleteForm({ categoryLabel, exampleLabel, categories, onSubmit, onClose, className }: DeleteFormProps) {
    const {
        selectedCategory,
        selectedExamples,
        availableExamples,
        handleExampleToggle,
        handleSubmit,
        handleCancel,
        handleCategoryChange,
    } = useDeleteForm(categories, onSubmit, onClose);

    return (
        <div className={`delete-form ${className}`}>
            <h2 className="form-title">delete {exampleLabel}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="category" className="form-label">
                        {categoryLabel}:
                    </label>
                    <select
                        id="category"
                        value={selectedCategory}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        className="form-select"
                        required
                    >
                        <option value="">Please select {categoryLabel}</option>
                        {categories.map((category, index) => (
                            <option key={index} value={category.name}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">
                        Select {exampleLabel}(s) to delete:
                    </label>
                    <div className="checkbox-container">
                        {availableExamples.length > 0 &&
                            availableExamples.map((example, index) => (
                                <div key={index} className="checkbox-item">
                                    <input
                                        type="checkbox"
                                        id={`example-${index}`}
                                        checked={selectedExamples.includes(example)}
                                        onChange={() => handleExampleToggle(example)}
                                        className="form-checkbox"
                                    />
                                    <label htmlFor={`example-${index}`} className="checkbox-label">
                                        {example}
                                    </label>
                                </div>
                            ))}
                    </div>
                </div>

                <div className="form-buttons">
                    <button type="button" onClick={handleCancel} className="btn btn-cancel">
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-delete" disabled={selectedExamples.length === 0}>
                        Delete ({selectedExamples.length})
                    </button>
                </div>
            </form>
        </div>
    );
}