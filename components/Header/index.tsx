import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Button from "@/components/Button";
import Image from "@/components/Image";
import Icon from "@/components/Icon";
import Modal from "@/components/Modal";
import Login from "@/components/Login";
import Menu from "./Menu";
import Plan from "./Plan";

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
};

const Header = ({
    isFixed,
    login,
    isVisiblePlan,
    onLogin,
    onLogout,
}: HeaderProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();
    const isHomePage = pathname === "/";

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (isHomePage && href.startsWith("#")) {
            e.preventDefault();
            const element = document.querySelector(href);
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
        }
    };

    return (
        <>
            <div
                className={`relative z-50 flex items-center p-5 max-md:p-4 ${
                    isFixed ? "fixed! top-0 left-0 right-0 bg-b-surface1" : ""
                }`}
            >
                <Link className="w-48 shrink-0" href="/">
                    <Image
                        className="w-full opacity-100 dark:hidden!"
                        src="/images/Logo-dark.svg"
                        width={142}
                        height={36}
                        alt="Nerlude"
                    />
                    <Image
                        className="hidden! w-full opacity-100 dark:block!"
                        src="/images/Logo-light.svg"
                        width={142}
                        height={36}
                        alt="Nerlude"
                    />
                </Link>
                
                {/* Navigation Links - Only show on homepage when not logged in */}
                {!login && isHomePage && (
                    <nav className="flex items-center gap-8 mx-auto max-lg:hidden">
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
                    <div className="flex items-center ml-auto">
                        {pathname !== "/projects/new" &&
                            pathname !== "/onboarding" && (
                                <Button
                                    className="mr-3 max-md:w-12! max-md:gap-0! max-md:p-0! max-md:text-0!"
                                    href="/projects/new"
                                    as="link"
                                    isSecondary
                                >
                                    <Icon
                                        className="mr-2 max-md:mr-0"
                                        name="plus"
                                    />
                                    New Project
                                </Button>
                            )}
                        <Menu onLogout={onLogout} />
                    </div>
                ) : (
                    <Button
                        className="ml-3"
                        isPrimary
                        onClick={() => setIsMenuOpen(true)}
                    >
                        Sign in
                    </Button>
                )}
            </div>
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
