"use client";

import Link from "next/link";
import Icon from "@/components/Icon";

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
    className?: string;
}

const Breadcrumb = ({ items, className = "" }: BreadcrumbProps) => {
    return (
        <nav className={`flex items-center gap-2 text-small ${className}`}>
            {items.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                    {index > 0 && (
                        <Icon 
                            className="!w-4 !h-4 fill-t-tertiary" 
                            name="arrow-right" 
                        />
                    )}
                    {item.href ? (
                        <Link 
                            href={item.href}
                            className="text-t-secondary hover:text-t-primary transition-colors"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-t-primary font-medium">
                            {item.label}
                        </span>
                    )}
                </div>
            ))}
        </nav>
    );
};

export default Breadcrumb;
