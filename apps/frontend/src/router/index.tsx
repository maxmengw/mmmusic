import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import RequireAuth from "../components/common/auth/RequireAuth";
import Login from "../components/pages/Login"
import Landing from "../components/layout/Landing";
import About from "../components/pages/About";
import Contact from "../components/pages/Contact";
import ChineseMusic from "../components/pages/musicpages/ChineseMusic"; 
import KoreanMusic from "../components/pages/musicpages/KoreanMusic";
import FilipinoMusic from "../components/pages/musicpages/FilipinoMusic";
import MusicPlayerBar from "../components/layout/MusicPlayerBar";
import NotFound from "../components/pages/NotFound";

interface RouterConfig {
	path: string;
	element: React.ReactElement;
	requireAuth?: boolean;
	layout?: boolean;
}

const routerConfigs: RouterConfig[] = [
    {
        path: "/",
        element: <Login />,
        requireAuth: false,
        layout: false
    },
    {
        path: "/Landing",
        element: <Landing />,
        requireAuth: true,
        layout: true
    },
    {
        path: "/About",
        element: <About />,
        requireAuth: false,
        layout: true
    },
    {
        path: "/Contact",
        element: <Contact />,
        requireAuth: false,
        layout: true
    },
    {
        path: "/ChineseMusic",
        element: <ChineseMusic />,
        requireAuth: true,
        layout: true
    },
    {
        path: "/KoreanMusic",
        element: <KoreanMusic />,
        requireAuth: true,
        layout: true
    },
    {
        path: "/FilipinoMusic",
        element: <FilipinoMusic />,
        requireAuth: true,
        layout: true
    },
    {
        path: "*",
        element: <NotFound />,
        requireAuth: false,
        layout: false
    },
]

const renderRoute = (route: RouterConfig) => {
    let element = route.element;

    if (route.requireAuth) {
        element = <RequireAuth>{element}</RequireAuth>;
    }

    return (
        element
    );
};

function AppRoutes() {
	const location = useLocation();
	const currentRoute = routerConfigs.find(route => route.path === location.pathname);
	
	let showMusicPlayer;
	if (currentRoute?.layout === false) {
		showMusicPlayer = false;
	} else {
		showMusicPlayer = true;
	}

	return (
		<>
            <Routes>
                {routerConfigs.map((routes) => (
                    <Route 
                        key={routes.path} 
                        path={routes.path}
                        element={renderRoute(routes)} 
                    />
                ))}
            </Routes>
			{showMusicPlayer && <MusicPlayerBar />}
		</>
	);
}

export default function Router() {
	return (
		<BrowserRouter>
			<AppRoutes />
		</BrowserRouter>
	);
}
