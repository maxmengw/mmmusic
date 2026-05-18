import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Loading from "../Loading";

export default function RequireAuth({ children }: { children: React.ReactElement }) {
    const { isSignedIn, isLoaded } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoaded && !isSignedIn) {
            navigate("/", { replace: true });
        }
    }, [isLoaded, isSignedIn, navigate]);

    // Show loading while Clerk is still initializing
    if (!isLoaded) {
        return <Loading />;
    }

    // Redirect will happen in useEffect, so we shouldn't reach here
    // but return Loading as a fallback
    if (!isSignedIn) {
        return <Loading />;
    }

    return <>{children}</>;
}