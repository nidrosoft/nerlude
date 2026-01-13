import Button from "@/components/Button";
import Image from "@/components/Image";

const Start = () => {

    return (
        <div className="section section-lines before:-top-38! before:-bottom-21! after:-top-38! after:-bottom-21! max-lg:before:-top-23.5! max-lg:before:-bottom-4! max-lg:after:-top-23.5! max-lg:after:-bottom-4! max-md:before:hidden max-md:after:hidden">
            <div className="relative before:absolute before:top-0 before:left-0 before:right-0 before:h-[1.5px] before:bg-linear-(--gradient-horizontal) after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-linear-(--gradient-horizontal) max-md:before:hidden max-md:after:hidden">
                <div className="center">
                    <div className="relative p-1.5 border-[1.5px] border-stroke-subtle rounded-5xl overflow-hidden">
                        <div className="absolute top-1/2 left-1/2 w-253 h-253 -translate-x-1/2 -translate-y-1/2 max-lg:w-222 max-lg:h-222 max-md:top-65 max-md:translate-y-0">
                            <Image
                                className="object-contain"
                                src="/images/start-gradient.png"
                                fill
                                alt=""
                                sizes="(max-width: 1023px) 100vw, 50vw"
                                priority
                            />
                        </div>
                        <div className="relative z-2 pt-20 px-18 bg-b-subtle95 rounded-4xl overflow-hidden max-lg:pt-12 max-lg:px-8 max-md:pt-8 max-md:px-6">
                            <div className="mb-18 text-center max-lg:max-w-96 max-lg:mx-auto max-lg:mb-10 max-md:max-w-full max-md:text-left max-md:mb-12">
                                <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-primary1/10 text-primary1 text-button">
                                    <span className="w-2 h-2 rounded-full bg-primary1 animate-pulse"></span>
                                    Ready to start?
                                </div>
                                <div className="mb-5 text-h1">
                                    Take control of your product infrastructure
                                </div>
                                <div className="mb-8 text-body-lg text-t-secondary max-md:mb-6">
                                    Join 2,000+ founders who never miss a renewal or lose
                                    track of their services again
                                </div>
                                <div className="flex flex-col items-center gap-4 max-md:items-start">
                                    <Button isStroke as="link" href="/onboarding">
                                        Get started for free
                                    </Button>
                                    <div className="flex items-center gap-4 text-small text-t-secondary max-md:flex-col max-md:items-start max-md:gap-2">
                                        <div className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary2"></span>
                                            No credit card required
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary2"></span>
                                            Free forever for 1 project
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary2"></span>
                                            Setup in 2 minutes
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Start;
