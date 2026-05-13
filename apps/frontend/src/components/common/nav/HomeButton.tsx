import { useNavigate } from "react-router-dom";

export default function HomeButton() {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate("/Landing");
    };

    return (
        <button className="back-button inter-thin" onClick={handleGoHome}>Back</button>
    );
}
