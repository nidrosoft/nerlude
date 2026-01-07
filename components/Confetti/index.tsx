"use client";

import { useEffect, useState } from "react";

interface ConfettiPiece {
    id: number;
    x: number;
    y: number;
    rotation: number;
    color: string;
    size: number;
    speedX: number;
    speedY: number;
    speedRotation: number;
}

interface ConfettiProps {
    isActive: boolean;
    duration?: number;
    pieceCount?: number;
    onComplete?: () => void;
}

const colors = [
    "#FF6B6B", // Red
    "#4ECDC4", // Teal
    "#45B7D1", // Blue
    "#96CEB4", // Green
    "#FFEAA7", // Yellow
    "#DDA0DD", // Plum
    "#98D8C8", // Mint
    "#F7DC6F", // Gold
    "#BB8FCE", // Purple
    "#85C1E9", // Light Blue
];

const Confetti = ({ isActive, duration = 3000, pieceCount = 100, onComplete }: ConfettiProps) => {
    const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isActive) {
            setIsVisible(true);
            
            // Generate confetti pieces
            const newPieces: ConfettiPiece[] = Array.from({ length: pieceCount }, (_, i) => ({
                id: i,
                x: Math.random() * 100,
                y: -10 - Math.random() * 20,
                rotation: Math.random() * 360,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: 8 + Math.random() * 8,
                speedX: (Math.random() - 0.5) * 3,
                speedY: 2 + Math.random() * 3,
                speedRotation: (Math.random() - 0.5) * 10,
            }));
            
            setPieces(newPieces);

            // Clean up after duration
            const timer = setTimeout(() => {
                setIsVisible(false);
                setPieces([]);
                onComplete?.();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [isActive, duration, pieceCount, onComplete]);

    if (!isVisible || pieces.length === 0) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
            {pieces.map((piece) => (
                <div
                    key={piece.id}
                    className="absolute animate-confetti-fall"
                    style={{
                        left: `${piece.x}%`,
                        top: `${piece.y}%`,
                        width: piece.size,
                        height: piece.size * 0.6,
                        backgroundColor: piece.color,
                        transform: `rotate(${piece.rotation}deg)`,
                        borderRadius: "2px",
                        animationDuration: `${2 + Math.random() * 2}s`,
                        animationDelay: `${Math.random() * 0.5}s`,
                    }}
                />
            ))}
            <style jsx>{`
                @keyframes confetti-fall {
                    0% {
                        transform: translateY(0) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(100vh) rotate(720deg);
                        opacity: 0;
                    }
                }
                .animate-confetti-fall {
                    animation: confetti-fall linear forwards;
                }
            `}</style>
        </div>
    );
};

export default Confetti;
