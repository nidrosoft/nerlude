"use client";

import Layout from "@/components/Layout";
import Image from "@/components/Image";
import OnboardingForm from "./Form";

const OnboardingPage = () => {
    return (
        <Layout
            className="max-md:block max-md:min-h-auto"
            isFixedHeader
            isHiddenFooter
            isLoggedIn
        >
            <div className="flex min-h-svh">
                <div className="flex justify-center items-center grow px-8 py-22 max-2xl:pb-16 max-md:min-h-svh max-md:pt-25 max-md:px-6 max-md:pb-6">
                    <OnboardingForm />
                </div>
                <div className="relative flex flex-col shrink-0 w-200 p-2.5 pl-0 max-3xl:w-173 max-2xl:w-142.5 max-xl:hidden">
                    <div className="absolute top-0 right-0">
                        <Image
                            src="/images/quiz-gradient.png"
                            width={692}
                            height={549}
                            alt=""
                        />
                    </div>
                    <div className="relative flex flex-col grow p-10 border-[1.5px] border-stroke-subtle rounded-4xl overflow-hidden">
                        <div className="relative z-2 mt-auto">
                            <div className="mb-4 text-h3">
                                Welcome to Nelrude
                            </div>
                            <div className="text-body-lg text-t-secondary">
                                Let&apos;s personalize your experience. This will only take a minute.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default OnboardingPage;
