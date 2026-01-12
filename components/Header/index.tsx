import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import Modal from "@/components/Modal";
import Login from "@/components/Login";
import Menu from "./Menu";
import Plan from "./Plan";
import QuickActions from "./QuickActions";
import Notifications from "./Notifications";
import WorkspaceSwitcher from "./WorkspaceSwitcher";
import { Alert } from "@/types";

const navLinks = [
    { label: "Features", href: "#features" },
    { label: "Demo", href: "#demo" },
    { label: "Pricing", href: "#pricing" },
    { label: "Integrations", href: "#integrations" },
];

type HeaderProps = {
    isFixed?: boolean;
    login?: boolean;
    isVisiblePlan?: boolean;
    onLogin: () => void;
    onLogout: () => void;
    alerts?: Alert[];
    onMarkAsRead?: (id: string) => void;
    onMarkAllAsRead?: () => void;
};

const Header = ({
    isFixed,
    login,
    isVisiblePlan,
    onLogin,
    onLogout,
    alerts = [],
    onMarkAsRead,
    onMarkAllAsRead,
}: HeaderProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const isHomePage = pathname === "/";

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (isHomePage && href.startsWith("#")) {
            e.preventDefault();
            const element = document.querySelector(href);
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
            setIsMobileMenuOpen(false);
        }
    };

    return (
        <>
            <div
                className={`relative z-50 flex items-center justify-between p-5 max-md:p-4 ${
                    isFixed ? "fixed! top-0 left-0 right-0 bg-b-surface1" : ""
                }`}
            >
                <Link className="w-48 max-md:w-28 shrink-0" href="/">
                    <img
                        className="w-full dark:hidden"
                        src="/images/Logo-dark.svg"
                        width={142}
                        height={36}
                        alt="Nerlude"
                    />
                    <img
                        className="hidden w-full dark:block"
                        src="/images/Logo-light.svg"
                        width={142}
                        height={36}
                        alt="Nerlude"
                    />
                </Link>
                
                {/* Navigation Links - Desktop: centered, hidden on mobile */}
                {!login && isHomePage && (
                    <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-8 max-lg:hidden">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                onClick={(e) => handleNavClick(e, link.href)}
                                className="text-body text-t-secondary hover:text-t-primary transition-colors"
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>
                )}
                
                {isVisiblePlan && <Plan />}
                {login ? (
                    <div className="flex items-center gap-3 ml-auto">
                        <WorkspaceSwitcher />
                        {pathname !== "/projects/new" &&
                            pathname !== "/onboarding" && (
                                <QuickActions />
                            )}
                        <Notifications 
                            alerts={alerts}
                            onMarkAsRead={onMarkAsRead}
                            onMarkAllAsRead={onMarkAllAsRead}
                        />
                        <Menu onLogout={onLogout} />
                    </div>
                ) : (
                    <>
                        {/* Desktop Sign in button */}
                        <Button
                            className="max-lg:hidden"
                            isPrimary
                            onClick={() => setIsMenuOpen(true)}
                        >
                            Sign in
                        </Button>
                        
                        {/* Mobile hamburger menu */}
                        {isHomePage && (
                            <button
                                className="hidden max-lg:flex items-center justify-center w-10 h-10 rounded-xl bg-b-surface2 hover:bg-b-surface3 transition-colors"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                <Icon className="!w-5 !h-5 fill-t-primary" name={isMobileMenuOpen ? "close" : "menu"} />
                            </button>
                        )}
                    </>
                )}
            </div>
            
            {/* Mobile menu dropdown */}
            {!login && isHomePage && isMobileMenuOpen && (
                <div className="hidden max-lg:block fixed top-16 left-0 right-0 z-40 bg-b-surface1 border-b border-stroke-subtle shadow-lg">
                    <nav className="flex flex-col p-4">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                onClick={(e) => handleNavClick(e, link.href)}
                                className="py-3 px-4 text-body text-t-secondary hover:text-t-primary hover:bg-b-surface2 rounded-xl transition-colors"
                            >
                                {link.label}
                            </a>
                        ))}
                        <div className="mt-3 pt-3 border-t border-stroke-subtle">
                            <Button
                                className="w-full"
                                isPrimary
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    setIsMenuOpen(true);
                                }}
                            >
                                Sign in
                            </Button>
                        </div>
                    </nav>
                </div>
            )}
            
            <Modal open={isMenuOpen} onClose={() => setIsMenuOpen(false)}>
                <Login
                    onLogin={() => {
                        onLogin();
                        setIsMenuOpen(false);
                    }}
                />
            </Modal>
        </>
    );
};

export default Header;
