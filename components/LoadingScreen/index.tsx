"use client";

import Icon from "@/components/Icon";

type Props = {
    message?: string;
    submessage?: string;
};

const LoadingScreen = ({ message = "Loading...", submessage }: Props) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-svh px-6">
            {/* Animated Icon */}
            <div className="relative mb-6">
                <div className="flex items-center justify-center size-20 rounded-3xl bg-primary1/10">
                    <Icon className="!w-10 !h-10 fill-primary1 animate-pulse" name="generation" />
                </div>
                {/* Spinning ring */}
                <div className="absolute inset-0 rounded-3xl border-2 border-primary1/20 border-t-primary1 animate-spin" />
            </div>

            {/* Message */}
            <h2 className="text-h5 text-t-primary mb-1">{message}</h2>
            {submessage && (
                <p className="text-small text-t-secondary text-center max-w-sm">
                    {submessage}
                </p>
            )}

            {/* Animated dots */}
            <div className="flex gap-1 mt-4">
                <span className="w-2 h-2 rounded-full bg-primary1 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-primary1 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-primary1 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
        </div>
    );
};

export default LoadingScreen;
