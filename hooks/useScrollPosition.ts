import { useEffect, useState, useRef, useCallback } from "react";

/**
 * Custom hook to track scroll position with performance optimizations.
 * Uses requestAnimationFrame throttling to prevent excessive re-renders
 * and avoid janky scrolling.
 * 
 * @param throttleMs - Optional throttle time in ms (default: 100ms for ~10 updates/sec)
 * @returns Current scroll Y position
 */
const useScrollPosition = (throttleMs: number = 100) => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const ticking = useRef(false);
    const lastScrollY = useRef(0);
    const lastUpdateTime = useRef(0);

    const updatePosition = useCallback(() => {
        const now = Date.now();
        const scrollY = window.scrollY;
        
        // Only update if enough time has passed and position changed significantly
        if (now - lastUpdateTime.current >= throttleMs && 
            Math.abs(scrollY - lastScrollY.current) > 5) {
            setScrollPosition(scrollY);
            lastScrollY.current = scrollY;
            lastUpdateTime.current = now;
        }
        ticking.current = false;
    }, [throttleMs]);

    useEffect(() => {
        const handleScroll = () => {
            // Use requestAnimationFrame for smooth throttling
            if (!ticking.current) {
                requestAnimationFrame(updatePosition);
                ticking.current = true;
            }
        };

        // Set initial position
        setScrollPosition(window.scrollY);
        lastScrollY.current = window.scrollY;
        
        // Use passive listener for better scroll performance
        window.addEventListener("scroll", handleScroll, { passive: true });
        
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [updatePosition]);

    return scrollPosition;
};

export default useScrollPosition;
