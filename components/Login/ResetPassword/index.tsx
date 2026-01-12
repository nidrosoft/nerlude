import { useState } from "react";
import Button from "@/components/Button";
import Field from "@/components/Field";
import { useAuth } from "@/lib/auth";

type Props = {
    onLogin: () => void;
    onResetPassword: () => void;
};

const ResetPassword = ({ onLogin }: Props) => {
    const { resetPassword } = useAuth();
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleResetPassword = async () => {
        if (!email) {
            setError("Please enter your email");
            return;
        }

        setIsLoading(true);
        setError("");

        const result = await resetPassword(email);

        if (result.error) {
            setError(result.error);
            setIsLoading(false);
            return;
        }

        setSuccess(true);
        setIsLoading(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleResetPassword();
        }
    };

    if (success) {
        return (
            <div className="">
                <div className="mb-6 text-center text-h3">Check your email</div>
                <div className="text-center text-t-secondary">
                    We&apos;ve sent a password reset link to <strong>{email}</strong>.
                </div>
                <Button
                    className="w-full mt-6"
                    isSecondary
                    onClick={onLogin}
                >
                    Back to login
                </Button>
            </div>
        );
    }

    return (
        <div className="">
            <div className="mb-10 text-center text-h3">Reset password</div>
            {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-small">
                    {error}
                </div>
            )}
            <Field
                className="mb-6"
                label="Email"
                placeholder="Enter email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                required
            />
            <Button
                className="w-full mb-4"
                isSecondary
                onClick={handleResetPassword}
                disabled={isLoading}
            >
                {isLoading ? "Sending..." : "Reset password"}
            </Button>
            <div className="text-center text-hairline font-medium text-t-secondary">
                Have your password?{" "}
                <span
                    className="border-b border-t-primary text-t-primary cursor-pointer transition-colors hover:border-transparent"
                    onClick={onLogin}
                >
                    Login
                </span>
            </div>
        </div>
    );
};

export default ResetPassword;
