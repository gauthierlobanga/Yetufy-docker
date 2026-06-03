/* eslint-disable react-hooks/set-state-in-effect */
// resources/js/hooks/use-keyboard-navigation-app.ts

import { useCallback, useEffect, useMemo, useState } from "react";

// 🔥 Définir un type générique pour remplacer Hit<BaseHit>
export interface NavigableItem {
    id?: number | string;
    url?: string;
    slug?: string;
    _type?: string;
    [key: string]: any;
}

interface UseKeyboardNavigationReturn<T = NavigableItem> {
    selectedIndex: number;
    moveDown: () => void;
    moveUp: () => void;
    activateSelection: () => boolean;
    hoverIndex: (index: number) => void;
    selectionOrigin: "keyboard" | "pointer" | "init";
    selectedItem: T | null;
}

export function useKeyboardNavigation<T extends NavigableItem = NavigableItem>(
    items: T[],
    query: string,
    openResultsInNewTab = true,
): UseKeyboardNavigationReturn<T> {
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const [selectionOrigin, setSelectionOrigin] = useState<
        "keyboard" | "pointer" | "init"
    >("init");

    const totalItems = useMemo(() => items.length, [items.length]);

    const moveDown = useCallback(() => {
        if (totalItems === 0) {
            return;
        }

        setSelectedIndex((prev) => (prev + 1) % totalItems);
        setSelectionOrigin("keyboard");
    }, [totalItems]);

    const moveUp = useCallback(() => {
        if (totalItems === 0) {
            return;
        }

        setSelectedIndex((prev) => (prev - 1 + totalItems) % totalItems);
        setSelectionOrigin("keyboard");
    }, [totalItems]);

    const hoverIndex = useCallback(
        (index: number) => {
            if (index < 0 || index >= totalItems) {
                return;
            }

            setSelectedIndex(index);
            setSelectionOrigin("pointer");
        },
        [totalItems],
    );

    const activateSelection = useCallback((): boolean => {
        const item = items[selectedIndex];

        if (!item) {
            return false;
        }

        // 🔥 Extraire l'URL selon la structure de l'item
        let url: string | undefined;

        if (typeof item.url === "string") {
            url = item.url;
        } else if (typeof item.slug === "string") {
            // Pour les posts et catégories
            if (item._type === "post") {
                url = `/blog/${item.slug}`;
            } else if (item._type === "category") {
                url = `/blog/category/${item.slug}`;
            } else if (item._type === "user") {
                url = `/profile/${item.id}`;
            }
        }

        if (url) {
            if (openResultsInNewTab) {
                window.open(url, "_blank", "noopener,noreferrer");
            } else {
                window.location.assign(url);
            }

            return true;
        }

        return false;
    }, [selectedIndex, items, openResultsInNewTab]);

    const selectedItem = useMemo(() => {
        if (selectedIndex >= 0 && selectedIndex < items.length) {
            return items[selectedIndex];
        }

        return null;
    }, [selectedIndex, items]);

    // Reset selection when query changes
    useEffect(() => {
        setSelectedIndex(0);
        setSelectionOrigin("init");
    }, [query]);

    return {
        selectedIndex,
        moveDown,
        moveUp,
        activateSelection,
        hoverIndex,
        selectionOrigin,
        selectedItem,
    };
}
