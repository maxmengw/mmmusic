import HomeButton from "../../common/nav/HomeButton";
import MusicList from "../../musicintro/MusicIntro";
import { Button } from '../../ui';
import Modal from "../../common/ui/Modal";
import AddForm from "../../common/forms/AddForm";
import DeleteForm from "../../common/forms/DeleteForm";
import { useMusic } from "../../../hooks/music/useMusic";
import { useMusicForm } from "../../../hooks/music/useMusicForm";

export default function Music() {
    const { data, refetch } = useMusic();
    const {
        showAddModal,
        setShowAddModal,
        showDeleteModal,
        setShowDeleteModal,
        handleAddMusic,
        handleDeleteMusic
    } = useMusicForm(refetch);

    const nameOptions = data?.categories.map((category: any) => category.name) || [];

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
            <MusicList data={data} />

            <Button className="add-button inter-thin" onClick={() => setShowAddModal(true)}>
                Add
            </Button>
            <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
                <AddForm 
                    className='music-form'
                    field1Label='name'
                    field2Label='reference track'
                    field1Options={nameOptions}
                    onSubmit={handleAddMusic}
                    onClose={() => setShowAddModal(false)}
                />
            </Modal>

            <Button className="delete-button inter-thin" onClick={() => setShowDeleteModal(true)}>
                Delete
            </Button>
            <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                <DeleteForm
                    className="music-form"
                    categoryLabel="Category"
                    exampleLabel="Reference Track"
                    categories={data.categories}
                    onSubmit={handleDeleteMusic}
                    onClose={() => setShowDeleteModal(false)}
                />
            </Modal>
        </div>
    );
}
