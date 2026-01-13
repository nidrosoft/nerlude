import Image from "@/components/Image";
import Button from "@/components/Button";

const Hero = () => {

    return (
        <div className="section section-lines pt-20 text-center max-md:pt-10 before:-top-22! after:-top-22! max-lg:before:top-0! max-lg:after:top-0! max-md:before:bottom-4! max-md:after:bottom-4!">
            <div className="relative mb-12 before:absolute before:-top-6 before:left-0 before:right-0 before:h-[1.5px] before:bg-linear-(--gradient-horizontal) max-lg:before:-top-11 max-md:before:-top-4 after:absolute after:-bottom-6 after:left-0 after:right-0 after:h-[1.5px] after:bg-linear-(--gradient-horizontal) max-lg:after:-bottom-7 max-md:after:-bottom-4 max-md:mb-8">
                <div className="text-center">
                    <h1 className="mb-5 text-[5rem] leading-[5.5rem] font-bold tracking-tight max-lg:text-[3.5rem] max-lg:leading-[4rem] max-md:text-[1.75rem] max-md:leading-[2.25rem]">
                        The Control Center For Your<br className="max-md:hidden" /> Product Infrastructure
                    </h1>
                    <div className="max-w-150 mx-auto text-body-lg text-t-secondary max-md:max-w-[85%] max-md:text-sm">
                        Manage domains, hosting, databases, API keys, and credentials across all your products. Never miss a renewal again.
                    </div>
                </div>
            </div>
            <Button
                className="mb-12 max-lg:mb-10"
                isStroke
                as="link"
                href="/onboarding"
            >
                Get started for free
            </Button>
            <div className="mt-4">
                <div className="mb-3 text-heading-thin text-t-secondary max-md:text-center">
                    Trusted by 2,000+ founders
                </div>
                <div className="flex items-center justify-center -mt-0.5">
                    <div className="flex">
                        {[
                            "/images/avatar-1.png",
                            "/images/avatar-2.png",
                            "/images/avatar-3.png",
                            "/images/avatar-4.png",
                            "/images/avatar-5.png",
                        ].map((src, index) => (
                            <div
                                className="relative border-2 border-b-surface1 rounded-full overflow-hidden not-first:-ml-3.25"
                                key={index}
                            >
                                <Image
                                    className="w-8 scale-105 opacity-100"
                                    src={src}
                                    width={32}
                                    height={32}
                                    alt=""
                                />
                            </div>
                        ))}
                    </div>
                    <div className="relative z-2 -ml-3.25 border-2 border-b-surface1 rounded-[1.125rem] bg-b-surface1">
                        <span className="flex items-center justify-center h-8 rounded-2xl px-2.5 bg-primary1/5 border-[1.5px] border-primary1/15 text-button text-t-blue">
                            1,234+
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
