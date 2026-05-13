import { createPortal } from 'react-dom';
import type { ReactNode } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}

function Modal({ isOpen, onClose, children }: ModalProps) {
    if (!isOpen) return null;

    return createPortal(
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>,
        document.body
    );
}

export default Modal;