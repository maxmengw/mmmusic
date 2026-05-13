import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../layout/Header";
import { SignInButton, SignedIn, SignedOut, useAuth } from "@clerk/clerk-react";

export default function Login() {
    const navigate = useNavigate();
    const { isSignedIn } = useAuth();

    useEffect(() => {
        if (isSignedIn) {
            navigate("/Landing");
        }
    }, [isSignedIn, navigate]);

    return (
        <div className="login-page">
            <Header />
            <SignedOut>
                <SignInButton mode="modal">
                    <button className="login-button inter-thin">Sign In</button>
                </SignInButton>
            </SignedOut>
            <SignedIn>
                <p className="login-redirecting">Redirecting...</p>
            </SignedIn>
        </div>
    );
}