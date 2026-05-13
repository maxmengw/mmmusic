import { useNavigate } from "react-router-dom";

export default function ThreeButtons() {
    const navigate = useNavigate();

    const handleNavigateKoreanMusic = () => {
        navigate("/KoreanMusic");
    };

    return (
        <div className="three-buttons">
            <button className="inter-thin" onClick={handleNavigateKoreanMusic}>Music</button>
        </div>
    );
}
