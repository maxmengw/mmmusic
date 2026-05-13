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

    return (
        <div>
            <nav className="navbar inter-thin">
                <ul>
                    <li><a onClick={handleNavigateToAbout}>About</a></li>
                    <li><a onClick={handleOpenSearch}>Search/AddPlaylist</a></li>
                    <li><a onClick={handleNavigateToContact}>Contact</a></li>
                    <li>
                        <SignedOut>
                            <SignInButton />
                        </SignedOut>
                        <SignedIn>
                            <UserButton />
                        </SignedIn>
                    </li>
                </ul>
            </nav>
            
            <SearchModal 
                isOpen={showSearchModal} 
                onClose={() => setShowSearchModal(false)} 
            />
        </div>
    );
}