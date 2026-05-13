import { jsx as _jsx } from "react/jsx-runtime";
import { createPortal } from 'react-dom';
function Modal({ isOpen, onClose, children }) {
    if (!isOpen)
        return null;
    return createPortal(_jsx("div", { className: "modal-overlay", onClick: onClose, children: _jsx("div", { className: "modal-content", onClick: (e) => e.stopPropagation(), children: children }) }), document.body);
}
export default Modal;
