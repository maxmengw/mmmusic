import { useNavigate } from "react-router-dom";

export default function ThreeButtons() {
    const navigate = useNavigate();

    const handleNavigateChineseMusic = () => {
        navigate("/ChineseMusic");
    };

    const handleNavigateKoreanMusic = () => {
        navigate("/KoreanMusic");
    };

    const handleNavigateFilipinoMusic = () => {
        navigate("/FilipinoMusic");
    };

    return (
        <div className="three-buttons">
            <button className="inter-thin" onClick={handleNavigateChineseMusic}>Chinese Music</button>
            <button className="inter-thin" onClick={handleNavigateKoreanMusic}>Korean Music</button>
            <button className="inter-thin" onClick={handleNavigateFilipinoMusic}>Filipino Music</button>
        </div>
    );
}
