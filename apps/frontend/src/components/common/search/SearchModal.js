import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Architecture note:
 * - Presents a modal search UI for searching data from chinese data.
 * - Uses useSearch hook for presentation/search features,
 *   keeping search state and filtering logic out of the component.
 * - Via useYouTubeMusicsList hook to use the youtubeMusicsListService
 *   and youtubeMusicsListRepo."Add to Playlist" is handled via this hook.
 * - Why: keeps presentation (component + hooks) separated from business rules (services)
 *   and data access (repo), improving maintainability and testability. it is easy to change
 *   search logic in the hook without modifying the component.
 */
import Modal from '../ui/Modal';
import { useSearch } from '../../../hooks/useSearch';
import { useState, useCallback } from 'react';
import { useYouTubeMusicsList } from '../../../hooks/music/useYouTubeMusicsList';
export default function SearchModal({ isOpen, onClose }) {
    const { searchQuery, searchResults, isLoading, hasNoResults, handleSearchChange, resetSearch, highlightText } = useSearch(isOpen);
    // UI-only state for pasted URLs; business validation is handled in the service
    const [youtubeUrls, setYoutubeUrls] = useState({});
    const { addToPlaylist } = useYouTubeMusicsList();
    const handleUrlChange = useCallback((key, value) => {
        setYoutubeUrls(prev => ({ ...prev, [key]: value }));
    }, []);
    const openYoutube = useCallback((query) => {
        const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
    }, []);
    const handleAddToPlaylist = useCallback(async (songName, country, key) => {
        const url = youtubeUrls[key] || '';
        const ok = await addToPlaylist(songName, country, url);
        if (ok) {
            setYoutubeUrls(prev => ({ ...prev, [key]: '' }));
        }
    }, [addToPlaylist, youtubeUrls]);
    const resetUrls = useCallback(() => setYoutubeUrls({}), []);
    const handleClose = () => {
        resetSearch();
        resetUrls();
        onClose();
    };
    return (_jsx(Modal, { isOpen: isOpen, onClose: handleClose, children: _jsxs("div", { className: "search-modal inter-thin", children: [_jsxs("div", { className: "search-header", children: [_jsx("h2", { className: "search-title", children: "Music Search" }), _jsx("button", { className: "search-close-btn", onClick: handleClose, "aria-label": "Close search", children: "\u2715" })] }), _jsxs("div", { className: "search-input-container", children: [_jsx("input", { type: "text", value: searchQuery, onChange: handleSearchChange, placeholder: "Search for artists, songs, genres, or descriptions...", className: "search-input", autoFocus: true }), isLoading && _jsx("div", { className: "search-loading", children: "Searching..." })] }), _jsxs("div", { className: "search-results", children: [hasNoResults && (_jsxs("div", { className: "no-results", children: [_jsxs("p", { children: ["No results found for \"", searchQuery, "\""] }), _jsx("p", { children: "Try searching for artists, song titles, or music genres" })] })), searchResults.length > 0 && (_jsx("div", { className: "results-list", children: searchResults.map((result, index) => {
                                const resultKey = `${result.country}-${index}`;
                                return (_jsxs("div", { className: "result-item", children: [_jsx("div", { className: "result-header", children: _jsx("span", { className: "country-label", children: result.country }) }), _jsx("h3", { className: "result-category", children: highlightText(result.categoryName, searchQuery) }), _jsx("p", { className: "result-description", children: highlightText(result.categoryDescription, searchQuery) }), _jsxs("div", { className: "result-examples", children: [_jsx("h4", { children: "Examples:" }), _jsx("ul", { children: result.examples.map((example, exampleIndex) => {
                                                        const key = `${resultKey}-${exampleIndex}`;
                                                        return (_jsxs("li", { className: "example-item", children: [_jsx("span", { className: "example-text", children: highlightText(example, searchQuery) }), _jsxs("div", { className: "url-container", children: [_jsx("button", { className: "btn-open", onClick: () => openYoutube(example), children: "Open" }), _jsx("input", { type: "text", placeholder: "Paste YouTube URL", value: youtubeUrls[key] || '', onChange: (e) => handleUrlChange(key, e.target.value), className: "url-input" }), _jsx("button", { className: "btn-add", onClick: () => handleAddToPlaylist(example, result.country, key), children: "Add" })] })] }, exampleIndex));
                                                    }) })] })] }, resultKey));
                            }) }))] })] }) }));
}
