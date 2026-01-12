import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Image from "@/components/Image";
import Field from "@/components/Field";
import PasswordStrength, { validatePassword } from "@/components/PasswordStrength";
import { useAuth } from "@/lib/auth";

type Props = {
    onSignIn: () => void;
    onCreateAccount: () => void;
};

const CreateAccount = ({ onSignIn, onCreateAccount }: Props) => {
    const router = useRouter();
    const { signUp } = useAuth();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleCreateAccount = async () => {
        if (!name || !email || !password) {
            setError("Please fill in all fields");
            return;
        }

        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            setError("Please meet all password requirements");
            return;
        }

        setIsLoading(true);
        setError("");

        const result = await signUp(email, password, name);

        if (result.error) {
            setError(result.error);
            setIsLoading(false);
            return;
        }

        setSuccess(true);
        setIsLoading(false);
        
        // Wait a moment then redirect to onboarding
        setTimeout(() => {
            onCreateAccount();
            router.push("/onboarding");
        }, 1500);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleCreateAccount();
        }
    };

    if (success) {
        return (
            <div className="">
                <div className="mb-6 text-center text-h3">Check your email</div>
                <div className="text-center text-t-secondary">
                    We&apos;ve sent a confirmation link to <strong>{email}</strong>. 
                    Please verify your email to continue.
                </div>
                <div className="mt-6 text-center text-small text-t-tertiary">
                    Redirecting to onboarding...
                </div>
            </div>
        );
    }

    return (
        <div className="">
            <div className="mb-10 text-center text-h3">Create an account</div>
            <Button className="w-full opacity-50 cursor-not-allowed" isPrimary disabled>
                <Image
                    className="w-6 mr-2 opacity-100"
                    src="/images/google.svg"
                    width={24}
                    height={24}
                    alt="Google"
                />
                Sign up with Google
            </Button>
            <div className="py-6 text-center text-small font-medium text-t-tertiary">
                Or use your email
            </div>
            {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-small">
                    {error}
                </div>
            )}
            <Field
                className="mb-4"
                label="Name"
                placeholder="Enter your name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={handleKeyDown}
                required
            />
            <Field
                className="mb-4"
                label="Email"
                placeholder="Enter email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                required
            />
            <Field
                className="mb-2"
                label="Password"
                placeholder="Enter password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                required
            />
            <PasswordStrength password={password} />
            <div className="mb-4" />
            <Button
                className="w-full mb-4"
                isSecondary
                onClick={handleCreateAccount}
                disabled={isLoading}
            >
                {isLoading ? "Creating account..." : "Create account"}
            </Button>
            <div className="text-center text-hairline font-medium text-t-secondary">
                Already have an account?{" "}
                <span
                    className="border-b border-t-primary text-t-primary cursor-pointer transition-colors hover:border-transparent"
                    onClick={onSignIn}
                >
                    Sign in
                </span>
            </div>
        </div>
    );
};

export default CreateAccount;
