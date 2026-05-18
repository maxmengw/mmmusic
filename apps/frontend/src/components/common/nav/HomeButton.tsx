import { useNavigate } from "react-router-dom";

export default function HomeButton() {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <button className="back-button inter-thin" onClick={handleGoBack}>Back</button>
    );
}
