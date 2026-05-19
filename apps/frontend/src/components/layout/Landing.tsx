import NavBar from "./NavBar";
import Header from "./Header";
import ThreeButtons from "../common/nav/ThreeButtons";
import Footer from "./Footer";
import { useEffect, useRef, useState } from 'react';
import MusicMap from '../pages/musicpages/MusicMap';

export default function Landing() {
    const overlayRef = useRef<HTMLDivElement | null>(null);
    const rootRef = useRef<HTMLDivElement | null>(null);
    const [showMap, setShowMap] = useState(false);

    const activateMap = (pushHistory = true) => {
        overlayRef.current?.classList.add('reveal-map');
        rootRef.current?.classList.add('dissolve-start');
        setShowMap(true);
        rootRef.current?.classList.add('map-active');
        if (pushHistory) {
            try {
                window.history.pushState({ mmsInline: true }, '', '#musicmap');
            } catch (e) {
                // ignore
            }
        }
    };

    useEffect(() => {
        const handler = () => activateMap(true);

        if (window.location.hash === '#musicmap') {
            activateMap(false);
        }

        window.addEventListener('mms-open-musicmap', handler as EventListener);
        return () => window.removeEventListener('mms-open-musicmap', handler as EventListener);
    }, []);

    // handle back button to reverse inline map reveal
    useEffect(() => {
        const onPop = () => {
            setShowMap(false);
            rootRef.current?.classList.remove('map-active');
            rootRef.current?.classList.remove('dissolve-start');
            overlayRef.current?.classList.remove('reveal-map');
        };

        window.addEventListener('popstate', onPop);
        return () => window.removeEventListener('popstate', onPop);
    }, [showMap]);

    return (
        <div className="landing-page" ref={rootRef}>
            <MusicMap embedded active={showMap} />
            <div className="landing-glass" ref={overlayRef} />
            <div className="landing-dust" aria-hidden />
            {/* Back button moved into embedded MusicMap for alignment under the timeline chips */}
            <NavBar />
            <Header />
            <ThreeButtons />
            <Footer />
        </div>
    );
}