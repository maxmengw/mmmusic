import { jsx as _jsx } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { searchMusic, getAllCategories } from '../services/searchService';
// Presentation Logic Hook
export function useSearch(isOpen) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { getToken, isSignedIn } = useAuth();
    useEffect(() => {
        if (!isSignedIn) {
            setSearchResults([]);
            setIsLoading(false);
            return;
        }
        const loadData = async () => {
            const sessionToken = await getToken();
            if (!sessionToken) {
                setSearchResults([]);
                setIsLoading(false);
                return;
            }
            const trimmedQuery = searchQuery.trim();
            if (!trimmedQuery) {
                setIsLoading(true);
                try {
                    const categories = await getAllCategories(sessionToken);
                    setSearchResults(isOpen ? categories : []);
                }
                catch (error) {
                    setSearchResults([]);
                }
                finally {
                    setIsLoading(false);
                }
                return;
            }
            setIsLoading(true);
            try {
                const results = await searchMusic(searchQuery, sessionToken);
                setSearchResults(results);
            }
            catch (error) {
                setSearchResults([]);
            }
            finally {
                setIsLoading(false);
            }
        };
        const timeoutId = setTimeout(() => {
            loadData();
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [searchQuery, isOpen, isSignedIn, getToken]);
    const handleSearchChange = useCallback((e) => {
        setSearchQuery(e.target.value);
    }, []);
    const resetSearch = useCallback(() => {
        setSearchQuery('');
        setSearchResults([]);
        setIsLoading(false);
    }, []);
    const highlightText = useCallback((text, query) => {
        const trimmedQuery = query.trim();
        if (!trimmedQuery) {
            return text;
        }
        const regex = new RegExp(`(${trimmedQuery})`, 'gi');
        const parts = text.split(regex);
        return parts.map((part, index) => {
            if (regex.test(part)) {
                return _jsx("mark", { className: "search-highlight", children: part }, index);
            }
            return part;
        });
    }, []);
    const hasNoResults = searchQuery.trim() !== '' && searchResults.length === 0 && !isLoading;
    return {
        searchQuery,
        searchResults,
        isLoading,
        hasNoResults,
        handleSearchChange,
        resetSearch,
        highlightText
    };
}
