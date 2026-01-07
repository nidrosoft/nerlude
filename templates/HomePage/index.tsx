"use client";

import Layout from "@/components/Layout";
import Hero from "./Hero";
import LogoCloud from "./LogoCloud";
import SecurityBadges from "./SecurityBadges";
import ProblemStatement from "./ProblemStatement";
import Features from "./Features";
import LiveDemo from "./LiveDemo";
import HowItWorks from "./HowItWorks";
import Integrations from "./Integrations";
import CaseStudies from "./CaseStudies";
import UseCases from "./UseCases";
import ROICalculator from "./ROICalculator";
import Testimonials from "./Testimonials";
import Comparison from "./Comparison";
import TrustElements from "./TrustElements";
import PricingSection from "./PricingSection";
import FAQ from "./FAQ";
import Start from "./Start";

const HomePage = () => {
    return (
        <Layout>
            <Hero />
            <LogoCloud />
            <SecurityBadges />
            <ProblemStatement />
            <Features />
            <LiveDemo />
            <HowItWorks />
            <Integrations />
            <CaseStudies />
            <UseCases />
            <ROICalculator />
            <Testimonials />
            <Comparison />
            <TrustElements />
            <PricingSection />
            <FAQ />
            <Start />
        </Layout>
    );
};

export default HomePage;
