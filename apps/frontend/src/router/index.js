import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import RequireAuth from "../components/common/auth/RequireAuth";
import Login from "../components/pages/Login";
import Landing from "../components/layout/Landing";
import About from "../components/pages/About";
import Contact from "../components/pages/Contact";
import Music from "../components/pages/musicpages/Music";
import MusicPlayerBar from "../components/layout/MusicPlayerBar";
import NotFound from "../components/pages/NotFound";
const routerConfigs = [
    {
        path: "/",
        element: _jsx(Login, {}),
        requireAuth: false,
        layout: false
    },
    {
        path: "/Landing",
        element: _jsx(Landing, {}),
        requireAuth: true,
        layout: true
    },
    {
        path: "/About",
        element: _jsx(About, {}),
        requireAuth: false,
        layout: true
    },
    {
        path: "/Contact",
        element: _jsx(Contact, {}),
        requireAuth: false,
        layout: true
    },
    {
        path: "/ChineseMusic",
        element: _jsx(Music, {}),
        requireAuth: true,
        layout: true
    },
    {
        path: "/Music",
        element: _jsx(Music, {}),
        requireAuth: true,
        layout: true
    },
    {
        path: "*",
        element: _jsx(NotFound, {}),
        requireAuth: false,
        layout: false
    },
];
const renderRoute = (route) => {
    let element = route.element;
    if (route.requireAuth) {
        element = _jsx(RequireAuth, { children: element });
    }
    return (element);
};
function AppRoutes() {
    const location = useLocation();
    const currentRoute = routerConfigs.find(route => route.path === location.pathname);
    let showMusicPlayer;
    if (currentRoute?.layout === false) {
        showMusicPlayer = false;
    }
    else {
        showMusicPlayer = true;
    }
    return (_jsxs(_Fragment, { children: [_jsx(Routes, { children: routerConfigs.map((routes) => (_jsx(Route, { path: routes.path, element: renderRoute(routes) }, routes.path))) }), showMusicPlayer && _jsx(MusicPlayerBar, {})] }));
}
export default function Router() {
    return (_jsx(BrowserRouter, { children: _jsx(AppRoutes, {}) }));
}
