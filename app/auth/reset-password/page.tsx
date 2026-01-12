"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import Button from "@/components/Button";
import Field from "@/components/Field";
import PasswordStrength, { validatePassword } from "@/components/PasswordStrength";
import LoadingScreen from "@/components/LoadingScreen";
import { getSupabaseClient } from "@/lib/db";

const ResetPasswordContent = () => {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        // Handle the auth callback from the reset password email
        const handleAuthCallback = async () => {
            const supabase = getSupabaseClient();
            
            // Check for hash fragment (Supabase sends tokens in URL hash)
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            const accessToken = hashParams.get('access_token');
            const refreshToken = hashParams.get('refresh_token');
            const type = hashParams.get('type');
            
            if (accessToken && type === 'recovery') {
                // Set the session from the recovery tokens
                const { error: sessionError } = await supabase.auth.setSession({
                    access_token: accessToken,
                    refresh_token: refreshToken || '',
                });
                
                if (sessionError) {
                    console.error("Session error:", sessionError);
                    setError("Invalid or expired reset link. Please request a new one.");
                }
            } else {
                // Check if we already have a session
                const { data: { session } } = await supabase.auth.getSession();
                
                if (!session) {
                    setError("Invalid or expired reset link. Please request a new one.");
                }
            }
            
            setIsInitializing(false);
        };
        
        handleAuthCallback();
    }, []);

    const handleResetPassword = async () => {
        if (!password || !confirmPassword) {
            setError("Please fill in all fields");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            setError("Please meet all password requirements");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const supabase = getSupabaseClient();
            
            // First check if we have a session
            const { data: { session } } = await supabase.auth.getSession();
            
            if (!session) {
                setError("Your reset link has expired. Please request a new password reset.");
                setIsLoading(false);
                return;
            }
            
            const { error: updateError } = await supabase.auth.updateUser({
                password,
            });

            if (updateError) {
                console.error("Password update error:", updateError);
                setError(updateError.message);
                setIsLoading(false);
                return;
            }

            setSuccess(true);
            
            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
                router.push("/dashboard");
            }, 2000);
        } catch (err: any) {
            console.error("Reset password error:", err);
            setError(err?.message || "An error occurred. Please try again.");
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleResetPassword();
        }
    };

    if (success) {
        return (
            <Layout isFixedHeader isHiddenFooter>
                <div className="flex items-center justify-center min-h-svh px-6">
                    <div className="w-full max-w-md text-center">
                        <div className="w-16 h-16 mx-auto mb-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="text-h3 mb-2">Password Updated</h1>
                        <p className="text-t-secondary mb-6">
                            Your password has been successfully reset. Redirecting to dashboard...
                        </p>
                    </div>
                </div>
            </Layout>
        );
    }

    if (isInitializing) {
        return (
            <Layout isFixedHeader isHiddenFooter>
                <LoadingScreen 
                    message="Verifying your link" 
                    submessage="Please wait while we verify your password reset request"
                />
            </Layout>
        );
    }

    return (
        <Layout isFixedHeader isHiddenFooter>
            <div className="flex items-center justify-center min-h-svh px-6">
                <div className="w-full max-w-md">
                    <h1 className="text-h3 text-center mb-2">Set New Password</h1>
                    <p className="text-t-secondary text-center mb-8">
                        Create a strong password for your account
                    </p>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-small">
                            {error}
                        </div>
                    )}

                    <Field
                        className="mb-2"
                        label="New Password"
                        placeholder="Enter new password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={handleKeyDown}
                        required
                    />
                    <PasswordStrength password={password} />
                    
                    <div className="mt-4">
                        <Field
                            className="mb-6"
                            label="Confirm Password"
                            placeholder="Confirm new password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            onKeyDown={handleKeyDown}
                            required
                        />
                    </div>

                    {confirmPassword && password !== confirmPassword && (
                        <div className="mb-4 text-red-500 text-small">
                            Passwords do not match
                        </div>
                    )}

                    <Button
                        className="w-full"
                        isSecondary
                        onClick={handleResetPassword}
                        disabled={isLoading || !password || !confirmPassword}
                    >
                        {isLoading ? "Updating..." : "Update Password"}
                    </Button>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => router.push("/")}
                            className="text-small text-t-tertiary hover:text-t-primary transition-colors"
                        >
                            Back to home
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

const ResetPasswordPage = () => {
    return (
        <Suspense fallback={
            <Layout isFixedHeader isHiddenFooter>
                <LoadingScreen 
                    message="Loading" 
                    submessage="Please wait..."
                />
            </Layout>
        }>
            <ResetPasswordContent />
        </Suspense>
    );
};

export default ResetPasswordPage;
