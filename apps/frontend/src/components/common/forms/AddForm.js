import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
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
export default function AddForm({ field1Label, field2Label, field1Options, onSubmit, onClose, className }) {
    const { field1, field2, handleSubmit, handleCancel, handleField1Change, handleField2Change, } = useAddForm(onSubmit, onClose);
    return (_jsxs("div", { className: `add-form ${className || ''}`, children: [_jsxs("h2", { className: "form-title", children: ["add new ", field1Label] }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { className: "form-group", children: [_jsxs("label", { htmlFor: "field1", className: "form-label", children: [field1Label, ":"] }), _jsxs("select", { id: "field1", value: field1, onChange: (e) => handleField1Change(e.target.value), className: "form-select", required: true, children: [_jsxs("option", { value: "", children: ["Please select ", field1Label] }), field1Options.map((option, index) => (_jsx("option", { value: option, children: option }, index)))] })] }), _jsxs("div", { className: "form-group", children: [_jsxs("label", { htmlFor: "field2", className: "form-label", children: [field2Label, ":"] }), _jsx("input", { type: "text", id: "field2", value: field2, onChange: (e) => handleField2Change(e.target.value), className: "form-input", placeholder: `please enter ${field2Label}`, required: true })] }), _jsxs("div", { className: "form-buttons", children: [_jsx("button", { type: "button", onClick: handleCancel, className: "btn btn-cancel", children: "Cancel" }), _jsx("button", { type: "submit", className: "btn btn-submit", children: "Add" })] })] })] }));
}
