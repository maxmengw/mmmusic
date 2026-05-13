import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import SearchModal from '../common/search/SearchModal';
export default function NavBar() {
    const navigate = useNavigate();
    const [showSearchModal, setShowSearchModal] = useState(false);
    const handleNavigateToAbout = () => {
        navigate("/About");
    };
    const handleOpenSearch = () => {
        setShowSearchModal(true);
    };
    const handleNavigateToContact = () => {
        navigate("/Contact");
    };
    return (_jsxs("div", { children: [_jsx("nav", { className: "navbar inter-thin", children: _jsxs("ul", { children: [_jsx("li", { children: _jsx("a", { onClick: handleNavigateToAbout, children: "About" }) }), _jsx("li", { children: _jsx("a", { onClick: handleOpenSearch, children: "Search/AddPlaylist" }) }), _jsx("li", { children: _jsx("a", { onClick: handleNavigateToContact, children: "Contact" }) }), _jsxs("li", { children: [_jsx(SignedOut, { children: _jsx(SignInButton, {}) }), _jsx(SignedIn, { children: _jsx(UserButton, {}) })] })] }) }), _jsx(SearchModal, { isOpen: showSearchModal, onClose: () => setShowSearchModal(false) })] }));
}
