import { memo, useCallback, useMemo } from "react";
import { usePathname } from "next/navigation";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import { useScrollPosition } from "@/hooks/index";

const UpButton = memo(() => {
    // Use a higher throttle for this component since it only needs rough position
    const scrollPosition = useScrollPosition(150);
    const pathname = usePathname();

    // Only show on landing page, not in dashboard/logged-in areas
    const isLandingPage = useMemo(() => 
        pathname === "/" || pathname === "/pricing" || pathname === "/about" || pathname === "/contact",
        [pathname]
    );
    
    const goTop = useCallback(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }, []);

    // Calculate visibility once
    const isVisible = scrollPosition > 100;

    if (!isLandingPage) {
        return null;
    }

    return (
        <Button
            className={`fixed! right-5 bottom-5 z-5 px-0! [&_svg]:-rotate-90 transition-opacity duration-200 max-md:hidden max-md:bottom-4 max-md:right-4 ${
                isVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            } ${pathname === "/" ? "max-md:flex!" : ""}`}
            onClick={goTop}
            isPrimary
            isCircle
            aria-label="Scroll to top"
        >
            <Icon name="arrow" />
        </Button>
    );
});

UpButton.displayName = "UpButton";

export default UpButton;
