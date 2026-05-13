import { jsx as _jsx } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom";
export default function ThreeButtons() {
    const navigate = useNavigate();
    const handleNavigateKoreanMusic = () => {
        navigate("/KoreanMusic");
    };
    return (_jsx("div", { className: "three-buttons", children: _jsx("button", { className: "inter-thin", onClick: handleNavigateKoreanMusic, children: "Music" }) }));
}
