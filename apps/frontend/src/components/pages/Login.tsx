import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../layout/Header";
import { SignInButton, useAuth } from "@clerk/clerk-react";
import { useCallback } from 'react';

export default function Login() {
    const navigate = useNavigate();
    const { isSignedIn, isLoaded } = useAuth();

    useEffect(() => {
        if (isLoaded && isSignedIn) {
            navigate("/Landing");
        }
    }, [isLoaded, isSignedIn, navigate]);

    const handleGuest = useCallback(() => {
        try {
            window.localStorage.setItem('mms_guest', 'true');
        } catch (e) {
            // ignore
        }
        navigate('/Landing');
    }, [navigate]);

    return (
        <div className="login-page">
            <Header />
            {!isSignedIn && (
                <div className="login-actions">
                    <SignInButton mode="modal">
                        <button type="button" className="login-button inter-thin">Sign In</button>
                    </SignInButton>
                    <button type="button" className="login-button inter-thin" onClick={handleGuest}>
                        Continue as Guest
                    </button>
                </div>
            )}
            {isSignedIn && (
                <p className="login-redirecting">Redirecting...</p>
            )}
        </div>
    );
}