"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import { useAuth } from "@/lib/auth";
import { getSupabaseClient } from "@/lib/db";
import UserType from "./UserType";
import CompanySize from "./CompanySize";
import HowFoundUs from "./HowFoundUs";
import UseCase from "./UseCase";
import ProductCount from "./ProductCount";

const ONBOARDING_STORAGE_KEY = "nelrude-onboarding-progress";

interface OnboardingProgress {
    activeId: number;
    userType: string;
    companySize: string;
    howFoundUs: string;
    useCase: string;
    productCount: string;
}

const getStoredProgress = (): OnboardingProgress | null => {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch {
            return null;
        }
    }
    return null;
};

const OnboardingForm = () => {
    const router = useRouter();
    const { user, isLoading: authLoading } = useAuth();
    const storedProgress = getStoredProgress();
    
    const [activeId, setActiveId] = useState(storedProgress?.activeId ?? 0);
    const [userType, setUserType] = useState(storedProgress?.userType ?? "");
    const [companySize, setCompanySize] = useState(storedProgress?.companySize ?? "");
    const [howFoundUs, setHowFoundUs] = useState(storedProgress?.howFoundUs ?? "");
    const [useCase, setUseCase] = useState(storedProgress?.useCase ?? "");
    const [productCount, setProductCount] = useState(storedProgress?.productCount ?? "");
    const [isSaving, setIsSaving] = useState(false);
    
    // Redirect to home if not authenticated
    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/");
        }
    }, [user, authLoading, router]);
    
    // Save progress to localStorage whenever state changes
    useEffect(() => {
        const progress: OnboardingProgress = {
            activeId,
            userType,
            companySize,
            howFoundUs,
            useCase,
            productCount,
        };
        localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(progress));
    }, [activeId, userType, companySize, howFoundUs, useCase, productCount]);

    const handleNext = () => {
        if (activeId < 4) {
            setActiveId(activeId + 1);
        }
    };

    const handlePrevious = () => {
        if (activeId > 0) {
            setActiveId(activeId - 1);
        }
    };

    const handleComplete = async () => {
        if (!user) return;
        
        setIsSaving(true);
        
        try {
            const supabase = getSupabaseClient();
            
            // Save onboarding data to database
            const { error } = await supabase
                .from('user_onboarding')
                .upsert({
                    user_id: user.id,
                    user_type: userType || null,
                    company_size: companySize || null,
                    how_found_us: howFoundUs || null,
                    use_case: useCase || null,
                    product_count: productCount || null,
                    completed_at: new Date().toISOString(),
                });

            if (error) {
                console.error('Error saving onboarding:', error);
            }
            
            // Clear onboarding progress from localStorage
            localStorage.removeItem(ONBOARDING_STORAGE_KEY);
            router.push("/dashboard");
        } catch (error) {
            console.error('Error saving onboarding:', error);
            // Still redirect even if save fails
            localStorage.removeItem(ONBOARDING_STORAGE_KEY);
            router.push("/dashboard");
        } finally {
            setIsSaving(false);
        }
    };

    const canProceed = () => {
        switch (activeId) {
            case 0:
                return userType !== "";
            case 1:
                return companySize !== "";
            case 2:
                return howFoundUs !== "";
            case 3:
                return useCase !== "";
            case 4:
                return productCount !== "";
            default:
                return false;
        }
    };

    const getTitle = () => {
        switch (activeId) {
            case 0:
                return "What best describes you?";
            case 1:
                return "What's the size of your team?";
            case 2:
                return "How did you hear about us?";
            case 3:
                return "What's your primary goal?";
            case 4:
                return "How many products do you manage?";
            default:
                return "";
        }
    };

    return (
        <div className="flex flex-col w-full max-w-152 max-h-200 h-full max-3xl:max-w-127 max-3xl:max-h-169 max-xl:max-w-136 max-md:max-h-full">
            <div className="flex mb-20 max-3xl:mb-12 max-2xl:mb-10 max-md:flex-col-reverse max-md:mb-8">
                <div className="grow text-h2 max-md:text-h3">
                    {getTitle()}
                </div>
                <div className="flex justify-center items-center shrink-0 w-16 h-7 mt-3 ml-8 border-[1.5px] border-primary2/15 bg-primary2/5 rounded-full text-button text-primary2 max-md:m-0 max-md:mb-4">
                    {activeId + 1} / 5
                </div>
            </div>
            <div className="">
                {activeId === 0 && (
                    <UserType value={userType} onChange={setUserType} />
                )}
                {activeId === 1 && (
                    <CompanySize value={companySize} onChange={setCompanySize} />
                )}
                {activeId === 2 && (
                    <HowFoundUs value={howFoundUs} onChange={setHowFoundUs} />
                )}
                {activeId === 3 && (
                    <UseCase value={useCase} onChange={setUseCase} />
                )}
                {activeId === 4 && (
                    <ProductCount value={productCount} onChange={setProductCount} />
                )}
            </div>
            <div className="flex items-center mt-auto pt-10 max-md:-mx-1 max-md:pt-6">
                {activeId > 0 ? (
                    <Button
                        className="min-w-40 max-md:min-w-[calc(50%-0.5rem)] max-md:mx-1"
                        isStroke
                        onClick={handlePrevious}
                    >
                        Previous
                    </Button>
                ) : (
                    <button
                        onClick={handleComplete}
                        className="text-small text-t-tertiary hover:text-t-primary transition-colors"
                    >
                        Skip for now
                    </button>
                )}
                {activeId === 4 ? (
                    <Button
                        className="min-w-40 ml-auto max-md:min-w-[calc(50%-0.5rem)] max-md:mx-1"
                        isSecondary
                        onClick={handleComplete}
                        disabled={!canProceed()}
                    >
                        {isSaving ? "Saving..." : "Get Started"}
                    </Button>
                ) : (
                    <Button
                        className="min-w-40 ml-auto max-md:min-w-[calc(50%-0.5rem)] max-md:mx-1"
                        isSecondary
                        onClick={handleNext}
                        disabled={!canProceed()}
                    >
                        Continue
                    </Button>
                )}
            </div>
        </div>
    );
};

export default OnboardingForm;
