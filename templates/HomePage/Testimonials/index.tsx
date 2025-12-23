"use client";

import Image from "@/components/Image";
import Icon from "@/components/Icon";

const testimonials = [
    {
        quote: "Nelrude saved me from losing a $2K domain. Got the alert 30 days before expiration when I had completely forgotten about it.",
        name: "Sarah Chen",
        role: "Founder",
        company: "Pixelcraft",
        avatar: "/images/avatar-1.png",
        rating: 5,
    },
    {
        quote: "Finally, one place to see what each of my 6 products actually costs to run. Found $340/month in forgotten services I wasn't using.",
        name: "Marcus Johnson",
        role: "Indie Hacker",
        company: "ShipFast Labs",
        avatar: "/images/avatar-2.png",
        rating: 5,
    },
    {
        quote: "Onboarding contractors used to take hours of hunting for credentials. Now it's 2 minutes. And I know exactly what they have access to.",
        name: "Emily Rodriguez",
        role: "CTO",
        company: "Launchpad Agency",
        avatar: "/images/avatar-3.png",
        rating: 5,
    },
    {
        quote: "We manage 47 client projects. Before Nelrude, it was chaos. Now everything is organized and we never miss a renewal.",
        name: "David Park",
        role: "Agency Owner",
        company: "Webflow Studio",
        avatar: "/images/avatar-4.png",
        rating: 5,
    },
    {
        quote: "The cost tracking alone paid for itself. I was spending $800/month on services I didn't even know I had.",
        name: "Lisa Thompson",
        role: "Solo Founder",
        company: "SaaSify",
        avatar: "/images/avatar-5.png",
        rating: 5,
    },
    {
        quote: "Switched from a messy Notion database. Nelrude is purpose-built for this and it shows. So much cleaner.",
        name: "Alex Rivera",
        role: "Technical Lead",
        company: "StartupCo",
        avatar: "/images/avatar-1.png",
        rating: 5,
    },
    {
        quote: "The team access control is exactly what we needed. Contractors get time-limited access that expires automatically.",
        name: "Jordan Lee",
        role: "Engineering Manager",
        company: "DevShop",
        avatar: "/images/avatar-2.png",
        rating: 5,
    },
    {
        quote: "I run 5 side projects. Nelrude keeps them all organized. I can see exactly what each one costs me per month.",
        name: "Chris Martinez",
        role: "Indie Maker",
        company: "BuildInPublic",
        avatar: "/images/avatar-3.png",
        rating: 5,
    },
    {
        quote: "Best investment for my agency. Client handoffs are now seamless. All credentials documented and ready to transfer.",
        name: "Nina Patel",
        role: "Founder",
        company: "Digital Agency",
        avatar: "/images/avatar-4.png",
        rating: 5,
    },
];

const Testimonials = () => {
    return (
        <div className="section section-lines before:-top-12! before:-bottom-12! after:-top-12! after:-bottom-12! max-md:before:hidden max-md:after:hidden">
            <div className="relative before:absolute before:top-0 before:left-0 before:right-0 before:h-[1.5px] before:bg-linear-(--gradient-horizontal) after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-linear-(--gradient-horizontal) max-md:before:hidden max-md:after:hidden">
                <div className="center">
                    <div className="py-16 max-lg:py-12 max-md:py-10">
                        <div className="mb-12 text-center max-md:text-left max-md:mb-10">
                            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-accent/10 text-accent text-button">
                                <span className="w-2 h-2 rounded-full bg-accent"></span>
                                Testimonials
                            </div>
                            <h2 className="mb-4 text-h1">
                                Loved by founders worldwide
                            </h2>
                            <p className="max-w-140 mx-auto text-body-lg text-t-secondary max-md:max-w-full">
                                See what builders are saying about Nelrude.
                            </p>
                        </div>
                        <div className="overflow-hidden">
                            <div className="flex animate-scroll gap-6">
                                {[...testimonials, ...testimonials].map((testimonial, index) => (
                                    <div
                                        key={index}
                                        className="group relative flex flex-col p-6 rounded-3xl bg-b-surface2 hover:shadow-hover transition-all duration-300 shrink-0 w-80"
                                    >
                                        <div className="flex gap-1 mb-3">
                                            {[...Array(testimonial.rating)].map((_, i) => (
                                                <div key={i} className="fill-amber-400">
                                                    <Icon name="star" />
                                                </div>
                                            ))}
                                        </div>
                                        <blockquote className="mb-4 text-body flex-1">
                                            &ldquo;{testimonial.quote}&rdquo;
                                        </blockquote>
                                        <div className="flex items-center gap-3">
                                            <div className="relative w-10 h-10 rounded-full overflow-hidden">
                                                <Image
                                                    className="object-cover"
                                                    src={testimonial.avatar}
                                                    fill
                                                    alt={testimonial.name}
                                                    sizes="40px"
                                                />
                                            </div>
                                            <div>
                                                <div className="text-body-bold text-sm">{testimonial.name}</div>
                                                <div className="text-small text-t-secondary">
                                                    {testimonial.role} at {testimonial.company}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Testimonials;
