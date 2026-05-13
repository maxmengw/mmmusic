
import HomeButton from "../../common/nav/HomeButton"
import FilipinoMusicList from "../../musicintro/FilipinoMusicIntro"
import Modal from "../../common/ui/Modal";
import AddForm from "../../common/forms/AddForm"
import DeleteForm from "../../common/forms/DeleteForm";
import { useFilipinoMusics } from "../../../hooks/filipino/useFilipinoMusic";
import { useFilipinoMusicForm } from "../../../hooks/filipino/useFilipinoMusicForm";

export default function FilipinoMusic() {
    const { data, refetch } = useFilipinoMusics();
    const {
        showAddModal,
        setShowAddModal,
        showDeleteModal,
        setShowDeleteModal,
        handleAddMusic,
        handleDeleteMusic
    } = useFilipinoMusicForm(refetch);

    const nameOptions = data?.categories.map(category => category.name) || [];

    if (!data || !data.categories || data.categories.length === 0) {
        return (
            <div className="filipino-music-page">
                <HomeButton />
                <div className="no-data-message">No Data</div>
            </div>
        );
    }

    return (
        <div className="filipino-music-page">
            <HomeButton />
            <FilipinoMusicList data={data} />

            <button className="add-button inter-thin" onClick={() => setShowAddModal(true)}>
                Add
            </button>
            <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
                <AddForm 
                    className='filipino-form'
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
                    className="filipino-form"
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