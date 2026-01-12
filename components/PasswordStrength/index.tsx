"use client";

import { useMemo } from "react";
import Icon from "@/components/Icon";

interface PasswordRequirement {
    label: string;
    met: boolean;
}

interface PasswordStrengthProps {
    password: string;
    showRequirements?: boolean;
}

export const passwordRequirements = [
    { key: "length", label: "At least 8 characters", test: (p: string) => p.length >= 8 },
    { key: "uppercase", label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
    { key: "lowercase", label: "One lowercase letter", test: (p: string) => /[a-z]/.test(p) },
    { key: "number", label: "One number", test: (p: string) => /[0-9]/.test(p) },
    { key: "special", label: "One special character (!@#$%^&*)", test: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
];

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    passwordRequirements.forEach(req => {
        if (!req.test(password)) {
            errors.push(req.label);
        }
    });
    
    return {
        isValid: errors.length === 0,
        errors,
    };
};

export const getPasswordStrength = (password: string): { score: number; label: string; color: string } => {
    if (!password) {
        return { score: 0, label: "", color: "bg-stroke-subtle" };
    }
    
    const metCount = passwordRequirements.filter(req => req.test(password)).length;
    
    if (metCount <= 1) {
        return { score: 1, label: "Weak", color: "bg-red-500" };
    } else if (metCount <= 2) {
        return { score: 2, label: "Fair", color: "bg-orange-500" };
    } else if (metCount <= 3) {
        return { score: 3, label: "Good", color: "bg-yellow-500" };
    } else if (metCount <= 4) {
        return { score: 4, label: "Strong", color: "bg-lime-500" };
    } else {
        return { score: 5, label: "Very Strong", color: "bg-green-500" };
    }
};

const PasswordStrength = ({ password, showRequirements = true }: PasswordStrengthProps) => {
    const strength = useMemo(() => getPasswordStrength(password), [password]);
    
    const requirements: PasswordRequirement[] = useMemo(() => {
        return passwordRequirements.map(req => ({
            label: req.label,
            met: req.test(password),
        }));
    }, [password]);

    if (!password) {
        return null;
    }

    return (
        <div className="mt-2">
            {/* Strength Bar */}
            <div className="flex items-center gap-2 mb-2">
                <div className="flex gap-1 flex-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                        <div
                            key={level}
                            className={`h-1.5 flex-1 rounded-full transition-colors ${
                                level <= strength.score ? strength.color : "bg-stroke-subtle"
                            }`}
                        />
                    ))}
                </div>
                {strength.label && (
                    <span className={`text-xs font-medium ${
                        strength.score <= 1 ? "text-red-500" :
                        strength.score <= 2 ? "text-orange-500" :
                        strength.score <= 3 ? "text-yellow-600" :
                        strength.score <= 4 ? "text-lime-600" :
                        "text-green-600"
                    }`}>
                        {strength.label}
                    </span>
                )}
            </div>

            {/* Requirements List */}
            {showRequirements && (
                <div className="space-y-1">
                    {requirements.map((req, index) => (
                        <div
                            key={index}
                            className={`flex items-center gap-2 text-xs transition-colors ${
                                req.met ? "text-green-600 dark:text-green-400" : "text-t-tertiary"
                            }`}
                        >
                            <div className={`w-4 h-4 flex items-center justify-center rounded-full ${
                                req.met 
                                    ? "bg-green-100 dark:bg-green-900/30" 
                                    : "bg-b-surface2"
                            }`}>
                                {req.met ? (
                                    <Icon name="check" className="!w-3 !h-3" />
                                ) : (
                                    <div className="w-1.5 h-1.5 rounded-full bg-stroke-subtle" />
                                )}
                            </div>
                            <span>{req.label}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PasswordStrength;
