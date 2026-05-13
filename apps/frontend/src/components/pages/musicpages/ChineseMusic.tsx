/**
 * Architecture note:
 * - Shows Chinese music categories and examples.
 * - Fetches data via useChineseMusics hook which then calls the service (chineseMusicsService) and the repository (chineseMusicsRepository).
 * - Add/Delete handled by useChineseMusicForm hook with modals.
 * - Why: this keeps presentation (UI) and logic (hooks/services) separated. 
 *   it will make the code more maintainable and testable.
 *   repo handles data access, services handle business rules, while hooks manage presentation logic (UI state and interactions).
 */
import HomeButton from "../../common/nav/HomeButton"
import ChineseMusicList from "../../musicintro/ChineseMusicIntro"
import Modal from "../../common/ui/Modal";
import AddForm from "../../common/forms/AddForm"
import DeleteForm from "../../common/forms/DeleteForm";
import { useChineseMusics } from "../../../hooks/chinese/useChineseMusics";
import { useChineseMusicForm } from "../../../hooks/chinese/useChineseMusicForm";

export default function ChineseMusic() {
    const { data, refetch } = useChineseMusics();
    const {
        showAddModal,
        setShowAddModal,
        showDeleteModal,
        setShowDeleteModal,
        handleAddMusic,
        handleDeleteMusic
    } = useChineseMusicForm(refetch);

    const nameOptions = data?.categories.map(category => category.name) || [];

    if (!data || !data.categories || data.categories.length === 0) {
        return (
            <div className="chinese-music-page">
                <HomeButton />
                <div className="no-data-message">No Data</div>
            </div>
        );
    }

    return (
        <div className="chinese-music-page">
            <HomeButton />
            <ChineseMusicList data={data} />

            <button className="add-button inter-thin" onClick={() => setShowAddModal(true)}>
                Add
            </button>
            <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
                <AddForm 
                    className='chinese-form'
                    field1Label='name'
                    field2Label='example'
                    field1Options={nameOptions}
                    onSubmit={handleAddMusic}
                    onClose={() => setShowAddModal(false)}
                />
            </Modal>

            <button className="delete-button inter-thin" onClick={() => setShowDeleteModal(true)}>
                Delete
            </button>
            <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                <DeleteForm
                    className="chinese-form"
                    categoryLabel="Category"
                    exampleLabel="Example"
                    categories={data.categories}
                    onSubmit={handleDeleteMusic}
                    onClose={() => setShowDeleteModal(false)}
                />
            </Modal>
        </div>
    );
}