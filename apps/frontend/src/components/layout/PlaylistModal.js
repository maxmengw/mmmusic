import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Modal from '../common/ui/Modal';
const PlaylistModal = ({ open, onClose, musics, onDelete }) => {
    return (_jsx(Modal, { isOpen: open, onClose: onClose, children: _jsxs("div", { className: "playlist-modal", onClick: e => e.stopPropagation(), children: [_jsxs("div", { className: "playlist-modal-header", children: [_jsx("span", { children: "Playlist" }), _jsx("button", { className: "playlist-modal-close", onClick: onClose, children: "\u00D7" })] }), _jsx("ul", { className: "playlist-modal-list", children: musics.map((music) => (_jsxs("li", { className: "playlist-modal-item", children: [_jsxs("div", { className: "playlist-modal-meta", children: [_jsx("span", { className: "playlist-modal-title", children: music.title }), _jsx("span", { className: "playlist-modal-artist", children: music.artist })] }), _jsx("div", { className: "playlist-modal-actions", children: _jsx("button", { className: "playlist-modal-delete", onClick: () => onDelete && onDelete(music.id), children: "Delete" }) })] }, music.id))) })] }) }));
};
export default PlaylistModal;
