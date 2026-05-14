import { useNavigate } from "react-router-dom";

export default function ThreeButtons() {
    const navigate = useNavigate();

    const handleNavigateMusic = () => {
        navigate("/Music");
    };

    return (
        <div className="three-buttons">
            <button className="inter-thin" onClick={handleNavigateMusic}>Music</button>
        </div>
    );
}
