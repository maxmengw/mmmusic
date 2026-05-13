import { jsx as _jsx } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom";
export default function HomeButton() {
    const navigate = useNavigate();
    const handleGoHome = () => {
        navigate("/Landing");
    };
    return (_jsx("button", { className: "back-button inter-thin", onClick: handleGoHome, children: "Back" }));
}
