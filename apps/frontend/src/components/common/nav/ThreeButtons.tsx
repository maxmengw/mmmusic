import { useNavigate } from "react-router-dom";

export default function ThreeButtons() {
    const navigate = useNavigate();

    const handleNavigateMusic = () => {
        navigate("/Music");
    };

    const handleNavigateMusicMap = () => {
        try {
            const ev = new CustomEvent('mms-open-musicmap');
            window.dispatchEvent(ev);
        } catch (e) {
            // fallback: navigate immediately
            navigate("/MusicMap");
        }
    };

    return (
        <div className="three-buttons">
            <button type="button" className="inter-thin" onClick={handleNavigateMusic}>Global Music Guide</button>
            <button type="button" className="inter-thin" onClick={handleNavigateMusicMap}>Music Map</button>
        </div>
    );
}
