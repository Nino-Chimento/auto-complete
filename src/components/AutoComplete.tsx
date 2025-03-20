import React, { useCallback, useEffect, useRef, useState } from 'react';
import './AutoComplete.css';
export interface User {
    id: number;
    name: string;
}

interface AutoCompleteProps {
    data: User[];
    onSelect: (selectedValue: string) => void;
    debounceTime?: number;
}

const AutoComplete: React.FC<AutoCompleteProps> = ({
    data,
    onSelect,
    debounceTime = 300
}) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<User[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const justSelectedRef = useRef(false); // Riferimento per tenere traccia di una selezione recente

    // Funzione di ricerca con debounce
    const debouncedSearch = useCallback((searchQuery: string) => {
        let timer: number | undefined = undefined;

        if (timer) {
            clearTimeout(timer);
        }

        if (justSelectedRef.current) {
            justSelectedRef.current = false;
            return;
        }

        timer = setTimeout(() => {
            if (searchQuery.length > 0) {
                const filteredData = data.filter((user) =>
                    user.name.toLowerCase().includes(searchQuery.toLowerCase())
                );
                setSuggestions(filteredData);
                setIsOpen(true);
            } else {
                setSuggestions([]);
                setIsOpen(false);
            }
        }, debounceTime);
    }, [data, debounceTime]);

    useEffect(() => {
        debouncedSearch(query);


    }, [query, debouncedSearch]);

    const highlightMatch = (text: string, query: string) => {
        const index = text.toLowerCase().indexOf(query.toLowerCase());
        if (index === -1) return text;

        return (
            <>
                {text.substring(0, index)}
                <strong>{text.substring(index, index + query.length)}</strong>
                {text.substring(index + query.length)}
            </>
        );
    };


    const handleSuggestionClick = (name: string) => {
        justSelectedRef.current = true;
        setQuery(name);
        setSuggestions([]);
        setIsOpen(false);
        onSelect(name);
    };


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const element = event.target as HTMLElement;
            if (!element.closest('.auto-complete')) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="auto-complete-container">
            <div className="auto-complete">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Type to search..."
                    onFocus={() => {
                        if (!justSelectedRef.current && query.length > 0) {
                            setIsOpen(true);
                        }
                    }}
                />
                <div className="suggestions-container">
                    {isOpen && suggestions.length > 0 && (
                        <ul className="suggestions-list">
                            {suggestions.map((user) => (
                                <li key={user.id} onClick={() => handleSuggestionClick(user.name)}>
                                    {highlightMatch(user.name, query)}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AutoComplete;