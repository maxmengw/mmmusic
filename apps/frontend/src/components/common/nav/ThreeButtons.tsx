import { useNavigate } from "react-router-dom";

export default function ThreeButtons() {
    const navigate = useNavigate();

    const handleNavigateMusic = () => {
        navigate("/Music");
    };

    const handleNavigateMusicMap = () => {
        navigate("/MusicMap");
    };

    return (
        <div className="three-buttons">
            <button className="inter-thin" onClick={handleNavigateMusic}>Music</button>
            <button className="inter-thin" onClick={handleNavigateMusicMap}>Music Map</button>
        </div>
    );
}
