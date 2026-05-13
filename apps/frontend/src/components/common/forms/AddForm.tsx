
/**
 * Architecture note:
 * - Presentational add form component， renders form select and input text and buttons.
 * - Uses useAddForm hook for presentation logic (local form state, submit/cancel handlers).
 * - OnSubmit prop will calls a service， this service will acesss to a repository
 *   the component itself does not contain business rules.
 * - Why: separates UI concerns (this component + hook) from business logic (services)
 *   and data access (repo), keeping the code easier to maintain and test. This one can
 *  be changed easier without affecting business rules in the future.
 */
import { useAddForm } from '../../../hooks/useAddForm';
import type { AddFormProps } from '../../../interface/AddFormProps';

export default function AddForm({ field1Label, field2Label, field1Options, onSubmit, onClose, className }: AddFormProps) {
    const {
        field1,
        field2,
        handleSubmit,
        handleCancel,
        handleField1Change,
        handleField2Change,
    } = useAddForm(onSubmit, onClose);

    return (
        <div className={`add-form ${className || ''}`}>
            <h2 className="form-title">add new {field1Label}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="field1" className="form-label">
                        {field1Label}:
                    </label>
                    <select
                        id="field1"
                        value={field1}
                        onChange={(e) => handleField1Change(e.target.value)}
                        className="form-select"
                        required
                    >
                        <option value="">Please select {field1Label}</option>
                        {field1Options.map((option, index) => (
                            <option key={index} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>
                
                <div className="form-group">
                    <label htmlFor="field2" className="form-label">
                        {field2Label}:
                    </label>
                    <input
                        type="text"
                        id="field2"
                        value={field2}
                        onChange={(e) => handleField2Change(e.target.value)}
                        className="form-input"
                        placeholder={`please enter ${field2Label}`}
                        required
                    />
                </div>
                
                <div className="form-buttons">
                    <button 
                        type="button" 
                        onClick={handleCancel}
                        className="btn btn-cancel"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit"
                        className="btn btn-submit"
                    >
                        Add
                    </button>
                </div>
            </form>
        </div>
    );
}