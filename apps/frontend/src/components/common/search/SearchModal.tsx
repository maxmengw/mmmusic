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


interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const {
        searchQuery,
        searchResults,
        isLoading,
        hasNoResults,
        handleSearchChange,
        resetSearch,
        highlightText
    } = useSearch(isOpen);

    // UI-only state for pasted URLs; business validation is handled in the service
    const [youtubeUrls, setYoutubeUrls] = useState<Record<string, string>>({});
    const { addToPlaylist } = useYouTubeMusicsList();

    const handleUrlChange = useCallback((key: string, value: string) => {
        setYoutubeUrls(prev => ({ ...prev, [key]: value }));
    }, []);

    const openYoutube = useCallback((query: string) => {
        const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
    }, []);

    const handleAddToPlaylist = useCallback(async (songName: string, country: string, key: string) => {
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

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <div className="search-modal inter-thin">
                <div className="search-header">
                    <h2 className="search-title">Music Search</h2>
                    <button 
                        className="search-close-btn" 
                        onClick={handleClose}
                        aria-label="Close search"
                    >
                        ✕
                    </button>
                </div>

                <div className="search-input-container">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search for artists, songs, genres, or descriptions..."
                        className="search-input"
                        autoFocus
                    />
                    {isLoading && <div className="search-loading">Searching...</div>}
                </div>

                <div className="search-results">
                    {hasNoResults && (
                        <div className="no-results">
                            <p>No results found for "{searchQuery}"</p>
                            <p>Try searching for artists, song titles, or music genres</p>
                        </div>
                    )}
                    
                    {searchResults.length > 0 && (
                        <div className="results-list">
                            {searchResults.map((result, index) => {
                                const resultKey = `${result.country}-${index}`;
                                
                                return (
                                    <div key={resultKey} className="result-item">
                                        <div className="result-header">
                                            <span className="country-label">{result.country}</span>
                              
                                        </div>
                                        
                                        <h3 className="result-category">
                                            {highlightText(result.categoryName, searchQuery)}
                                        </h3>
                                        
                                        <p className="result-description">
                                            {highlightText(result.categoryDescription, searchQuery)}
                                        </p>
                                        
                                        <div className="result-examples">
                                            <h4>My Music Memos:</h4>
                                            <ul>
                                                {result.examples.map((example: string, exampleIndex: number) => {
                                                    const key = `${resultKey}-${exampleIndex}`;
                                                    
                                                        return (
                                                            <li key={exampleIndex} className="example-item">
                                                                <span className="example-text">
                                                                    {highlightText(example, searchQuery)}
                                                                </span>
                                                            </li>
                                                        );
                                                    })}
                                            </ul>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
}