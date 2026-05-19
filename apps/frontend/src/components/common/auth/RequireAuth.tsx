import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Loading from "../Loading";

export default function RequireAuth({ children }: { children: React.ReactElement }) {
    const { isSignedIn, isLoaded } = useAuth();
    const navigate = useNavigate();
    const guestAllowedPaths = ['/Landing', '/Landing/', '/MusicMap', '/MusicMap/'];

    useEffect(() => {
        if (!isLoaded) return;

        if (isSignedIn) return;

        // Allow guest access for certain routes (MusicMap)
        try {
            const guest = window.localStorage.getItem('mms_guest') === 'true';
            const path = window.location.pathname || '';
            const guestAllowed = guest && guestAllowedPaths.includes(path);
            if (guestAllowed) {
                // permit access without navigating away
                return;
            }
        } catch (e) {
            // ignore storage errors
        }

        // otherwise redirect to login
        navigate('/', { replace: true });
    }, [isLoaded, isSignedIn, navigate]);

    // Show loading while Clerk is still initializing
    if (!isLoaded) {
        return <Loading />;
    }

    // If signed in, render children
    if (isSignedIn) return <>{children}</>;

    // If not signed in, check guest flag and allowed path
    try {
        const guest = window.localStorage.getItem('mms_guest') === 'true';
        const path = window.location.pathname || '';
        const guestAllowed = guest && guestAllowedPaths.includes(path);
        if (guestAllowed) {
            return <>{children}</>;
        }
    } catch (e) {
        // ignore
    }

    // If we reach here, redirect will occur from the effect; show loading fallback
    return <Loading />;
}