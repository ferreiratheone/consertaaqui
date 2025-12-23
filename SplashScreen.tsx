import React, { useEffect, useState } from 'react';
import { STORE_INFO } from '../types';

interface SplashScreenProps {
    onFinish: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onFinish, 700); // Wait for fade out animation
        }, 2500); // Show splash for 2.5 seconds

        return () => clearTimeout(timer);
    }, [onFinish]);

    return (
        <div className={`fixed inset-0 z-[60] bg-slate-950 flex flex-col items-center justify-center transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="relative flex flex-col items-center">
                <div className="w-32 h-32 md:w-48 md:h-48 bg-white/10 backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-white/10 mb-8 animate-pulse">
                    <img
                        src="/logo.png"
                        alt="Logo"
                        className="w-full h-full object-contain drop-shadow-xl"
                    />
                </div>

                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase mb-2">
                    {STORE_INFO.name.split(' ')[0]}<span className="text-blue-500">{STORE_INFO.name.split(' ')[1]}</span>
                </h1>
                <p className="text-slate-400 text-sm md:text-base font-medium tracking-[0.3em] uppercase animate-bounce">Carregando Sistema...</p>
            </div>

            <div className="absolute bottom-10 text-slate-600 text-xs">
                &copy; {new Date().getFullYear()} Gestão Pro System
            </div>
        </div>
    );
}
