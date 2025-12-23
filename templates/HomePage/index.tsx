"use client";

import Layout from "@/components/Layout";
import Hero from "./Hero";
import LogoCloud from "./LogoCloud";
import ProblemStatement from "./ProblemStatement";
import Features from "./Features";
import HowItWorks from "./HowItWorks";
import Integrations from "./Integrations";
import UseCases from "./UseCases";
import Testimonials from "./Testimonials";
import Comparison from "./Comparison";
import PricingSection from "./PricingSection";
import FAQ from "./FAQ";
import Start from "./Start";

const HomePage = () => {
    return (
        <Layout>
            <Hero />
            <LogoCloud />
            <ProblemStatement />
            <Features />
            <HowItWorks />
            <Integrations />
            <UseCases />
            <Testimonials />
            <Comparison />
            <PricingSection />
            <FAQ />
            <Start />
        </Layout>
    );
};

export default HomePage;
