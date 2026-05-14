import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../layout/Header";
import { SignInButton, useAuth } from "@clerk/clerk-react";

export default function Login() {
    const navigate = useNavigate();
    const { isSignedIn, isLoaded } = useAuth();

    useEffect(() => {
        if (isLoaded && isSignedIn) {
            navigate("/Landing");
        }
    }, [isLoaded, isSignedIn, navigate]);

    return (
        <div className="login-page">
            <Header />
            {!isSignedIn && (
                <SignInButton mode="modal">
                    <button className="login-button inter-thin">Sign In</button>
                </SignInButton>
            )}
            {isSignedIn && (
                <p className="login-redirecting">Redirecting...</p>
            )}
        </div>
    );
}