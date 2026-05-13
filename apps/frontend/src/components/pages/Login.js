import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    return (_jsxs("div", { className: "login-page", children: [_jsx(Header, {}), _jsx(SignedOut, { children: _jsx(SignInButton, { mode: "modal", children: _jsx("button", { className: "login-button inter-thin", children: "Sign In" }) }) }), _jsx(SignedIn, { children: _jsx("p", { className: "login-redirecting", children: "Redirecting..." }) })] }));
}
