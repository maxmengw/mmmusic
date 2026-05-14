/**
 * Architecture: hook-service-repository architecture
 * - Reads data via hooks (useKoreanMusics) -> service (koreanMusicService) -> repository (koreanMusicRepo) -> test data (mockKoreanMusics)
 * - Manages modal state (showAddModal/showDeleteModal) via hooks (useKoreanMusicForm)
 * - Uses reusable UI components (Modal, AddForm, DeleteForm) for presentation logic
 * - Supports Create/Delete operations with handleAddMusic/handleDeleteMusic functions
 * How: seperate tasks to various layers
 * - UI: provides presentatiion logic (Modal, AddForm, DeleteForm)
 * - Hooks: accesses data (useKoreanMusics), manipulates data (useKoreanMusicForm)
 * - Service: contains business logic and validation (koreanMusicService)
 * - Repository: supports api for CRUD operations (koreanMusicRepo)
 * - Data: stores test data (mockKoreanMusics)
 * Why: easy to maintain and expandable code by hook-service-repository architecture 
 * - Expandable to add new features or switch to real DB
 * - Maintainable to fix bugs and current code
 * - Reusable to use in other music pages (Korean/Chinese/Filipino)
 */
import HomeButton from "../../common/nav/HomeButton"
import KoreanMusicList from "../../musicintro/KoreanMusicIntro"
import Modal from "../../common/ui/Modal";
import AddForm from "../../common/forms/AddForm"
import DeleteForm from "../../common/forms/DeleteForm";
import { useKoreanMusics } from "../../../hooks/korean/useKoreanMusics";
import { useKoreanMusicForm } from "../../../hooks/korean/useKoreanMusicForm";

export default function KoreanMusic() {
    const { data, refetch } = useKoreanMusics();
    const {
        showAddModal,
        setShowAddModal,
        showDeleteModal,
        setShowDeleteModal,
        handleAddMusic,
        handleDeleteMusic
    } = useKoreanMusicForm(refetch);

    const nameOptions = data?.categories.map(category => category.name) || [];

    if (!data || !data.categories || data.categories.length === 0) {
        return (
            <div className="music-page">
                <HomeButton />
                <div className="no-data-message">No Data</div>
            </div>
        );
    }

    return (
        <div className="music-page">
            <HomeButton />
            <KoreanMusicList data={data} />

            <button className="add-button inter-thin" onClick={() => setShowAddModal(true)}>
                Add
            </button>
            <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
                <AddForm 
                    className='music-form'
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
                    className="music-form"
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