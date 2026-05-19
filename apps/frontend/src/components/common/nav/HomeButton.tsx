import { CSSProperties } from "react";
import { useNavigate } from "react-router-dom";

type HomeButtonProps = {
    className?: string;
    style?: CSSProperties;
};

export default function HomeButton({ className, style }: HomeButtonProps) {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <button className={`back-button inter-thin ${className ?? ''}`.trim()} style={style} onClick={handleGoBack}>Back</button>
    );
}
