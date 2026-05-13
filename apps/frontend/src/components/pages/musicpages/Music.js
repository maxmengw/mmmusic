import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import HomeButton from "../../common/nav/HomeButton";
import MusicList from "../../musicintro/MusicIntro";
import Modal from "../../common/ui/Modal";
import AddForm from "../../common/forms/AddForm";
import DeleteForm from "../../common/forms/DeleteForm";
import { useMusic } from "../../../hooks/music/useMusic";
import { useMusicForm } from "../../../hooks/music/useMusicForm";
export default function Music() {
    const { data, refetch } = useMusic();
    const { showAddModal, setShowAddModal, showDeleteModal, setShowDeleteModal, handleAddMusic, handleDeleteMusic } = useMusicForm(refetch);
    const nameOptions = data?.categories.map((category) => category.name) || [];
    if (!data || !data.categories || data.categories.length === 0) {
        return (_jsxs("div", { className: "music-page", children: [_jsx(HomeButton, {}), _jsx("div", { className: "no-data-message", children: "No Data" })] }));
    }
    return (_jsxs("div", { className: "music-page", children: [_jsx(HomeButton, {}), _jsx(MusicList, { data: data }), _jsx("button", { className: "add-button inter-thin", onClick: () => setShowAddModal(true), children: "Add" }), _jsx(Modal, { isOpen: showAddModal, onClose: () => setShowAddModal(false), children: _jsx(AddForm, { className: 'music-form', field1Label: 'name', field2Label: 'example', field1Options: nameOptions, onSubmit: handleAddMusic, onClose: () => setShowAddModal(false) }) }), _jsx("button", { className: "delete-button inter-thin", onClick: () => setShowDeleteModal(true), children: "Delete" }), _jsx(Modal, { isOpen: showDeleteModal, onClose: () => setShowDeleteModal(false), children: _jsx(DeleteForm, { className: "music-form", categoryLabel: "Category", exampleLabel: "Example", categories: data.categories, onSubmit: handleDeleteMusic, onClose: () => setShowDeleteModal(false) }) })] }));
}
