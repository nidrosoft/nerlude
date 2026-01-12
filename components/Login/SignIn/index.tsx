import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Image from "@/components/Image";
import Field from "@/components/Field";
import { useAuth } from "@/lib/auth";

type Props = {
    onResetPassword: () => void;
    onSignUp: () => void;
    onLogin: () => void;
};

const SignIn = ({ onResetPassword, onSignUp, onLogin }: Props) => {
    const router = useRouter();
    const { signIn } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSignIn = async () => {
        if (!email || !password) {
            setError("Please enter email and password");
            return;
        }

        setIsLoading(true);
        setError("");

        const result = await signIn(email, password);

        if (result.error) {
            setError(result.error);
            setIsLoading(false);
            return;
        }

        onLogin();
        router.push("/dashboard");
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSignIn();
        }
    };

    return (
        <div className="">
            <div className="mb-10 text-center text-h3">
                Sign in to Nerlude
            </div>
            <Button className="w-full opacity-50 cursor-not-allowed" isPrimary disabled>
                <Image
                    className="w-6 mr-2 opacity-100"
                    src="/images/google.svg"
                    width={24}
                    height={24}
                    alt="Google"
                />
                Sign in with Google
            </Button>
            <div className="py-6 text-center text-small font-medium text-t-tertiary">
                Or sign in with email
            </div>
            {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-small">
                    {error}
                </div>
            )}
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
                className="mb-6"
                label="Password"
                placeholder="Enter password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                onResetPassword={onResetPassword}
                required
            />
            <Button 
                className="w-full mb-4" 
                isSecondary 
                onClick={handleSignIn}
                disabled={isLoading}
            >
                {isLoading ? "Signing in..." : "Sign in"}
            </Button>
            <div className="text-center text-hairline font-medium text-t-secondary">
                Need an account?{" "}
                <span
                    className="border-b border-t-primary text-t-primary cursor-pointer transition-colors hover:border-transparent"
                    onClick={onSignUp}
                >
                    Sign up
                </span>
            </div>
        </div>
    );
};

export default SignIn;
