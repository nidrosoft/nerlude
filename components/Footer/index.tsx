import { usePathname } from "next/navigation";
import Link from "next/link";

const Footer = () => {
    const pathname = usePathname();

    return (
        <div className={`${pathname === "/" ? "max-md:h-18" : ""}`}>
            <div
                className={`center flex justify-between items-center h-22 max-md:h-auto max-md:flex-col max-md:gap-4 max-md:py-6 ${
                    pathname === "/" ? "max-md:hidden" : ""
                }`}
            >
                <Link
                    className="text-small text-t-secondary transition-colors hover:text-t-primary"
                    href="/terms"
                >
                    Terms & Conditions
                </Link>
                <div className="text-small text-t-tertiary">
                    Made with ❤️ by{" "}
                    <a
                        href="https://www.linkedin.com/in/cyriac-zeh"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-t-secondary hover:text-t-primary transition-colors underline"
                    >
                        Cyriac Zeh
                    </a>
                </div>
                <Link
                    className="text-small text-t-secondary transition-colors hover:text-t-primary"
                    href="/privacy"
                >
                    Privacy Policy
                </Link>
            </div>
        </div>
    );
};

export default Footer;
