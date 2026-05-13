import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useAuth } from "@clerk/clerk-react";
import NotFound from "../../pages/NotFound";
export default function RequireAuth({ children }) {
    const { isSignedIn } = useAuth();
    if (!isSignedIn) {
        return _jsx(NotFound, {});
    }
    return _jsx(_Fragment, { children: children });
}
