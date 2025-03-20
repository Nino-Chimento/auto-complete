import React, { useCallback, useEffect, useRef, useState } from 'react';
import './AutoComplete.css';

export interface OptionItem {
    value: string;
    label: string;
}

interface AutoCompleteProps {
    data: OptionItem[];
    onSelect: (selectedValue: string, selectedItem: OptionItem) => void;
    debounceTime?: number;
}

const AutoComplete: React.FC<AutoCompleteProps> = ({
    data,
    onSelect,
    debounceTime = 300
}) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<OptionItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const justSelectedRef = useRef(false);


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
                const filteredData = data.filter((item) =>
                    item.label.toLowerCase().includes(searchQuery.toLowerCase())
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


    const handleSuggestionClick = (item: OptionItem) => {
        justSelectedRef.current = true;
        setQuery(item.label);
        setSuggestions([]);
        setIsOpen(false);
        onSelect(item.value, item);
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
                            {suggestions.map((item) => (
                                <li key={String(item.value)} onClick={() => handleSuggestionClick(item)}>
                                    {highlightMatch(item.label, query)}
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