import { useAuth } from "@clerk/clerk-react";
import NotFound from "../../pages/NotFound";

export default function RequireAuth({ children }: { children: React.ReactElement }) {
    const { isSignedIn } = useAuth();

    if (!isSignedIn) {
        return <NotFound />;
    }

    return <>{children}</>;
}