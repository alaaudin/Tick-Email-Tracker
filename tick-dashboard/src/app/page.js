'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';

// --- Math & Helper Functions for "Peaceful" Data ---
// Generates smooth, flowing sine waves for our charts instead of harsh spikes
const generateSmoothWave = (points, amplitude = 40, frequency = 0.5) => {
    return Array.from({ length: points }).map((_, i) => {
        const x = i / (points - 1);
        // Combines multiple sine waves for a natural, organic flow
        return 50 + Math.sin(x * Math.PI * 2 * frequency) * amplitude + Math.cos(x * Math.PI * 4 * frequency) * (amplitude * 0.3);
    });
};

const initialLedgerData = [
    { id: 'SYS-001', entity: 'Aura Network', region: 'Sector Alpha', status: 'Synchronized', health: generateSmoothWave(30, 20, 1) },
    { id: 'SYS-002', entity: 'Breeze Logistics', region: 'Sector Beta', status: 'Calibrating', health: generateSmoothWave(30, 35, 0.8) },
    { id: 'SYS-003', entity: 'Zenith Core', region: 'Sector Delta', status: 'Synchronized', health: generateSmoothWave(30, 15, 1.2) },
    { id: 'SYS-004', entity: 'Horizon Uplink', region: 'Sector Alpha', status: 'Synchronized', health: generateSmoothWave(30, 25, 0.9) },
    { id: 'SYS-005', entity: 'Nebula Data', region: 'Sector Gamma', status: 'Calibrating', health: generateSmoothWave(30, 40, 0.7) },
    { id: 'SYS-006', entity: 'Ethereal Stream', region: 'Sector Beta', status: 'Synchronized', health: generateSmoothWave(30, 10, 1.5) },
];

// --- 3D Hover Hook for Organic Movement ---
function use3DTilt(sensitivity = 15) {
    const ref = useRef(null);
    const [style, setStyle] = useState({});

    const handleMouseMove = (e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Smooth 3D rotational math
        const rotateX = ((y - centerY) / centerY) * -sensitivity;
        const rotateY = ((x - centerX) / centerX) * sensitivity;

        setStyle({
            transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
            transition: 'transform 0.1s ease-out',
        });
    };

    const handleMouseLeave = () => {
        setStyle({
            transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
            transition: 'transform 1s cubic-bezier(0.25, 1, 0.5, 1)', // Slow, peaceful return
        });
    };

    return { ref, style, handleMouseMove, handleMouseLeave };
}

// --- Smooth SVG Wave Component ---
const PeacefulWave = ({ data, color, isActive }) => {
    const points = data.map((val, i) => `${(i / (data.length - 1)) * 100},${val}`).join(' ');
    return (
        <svg viewBox="0 0 100 100" className="w-full h-12 overflow-visible" preserveAspectRatio="none">
            <defs>
                <linearGradient id={`grad-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={color} stopOpacity="0.4" />
                    <stop offset="100%" stopColor={color} stopOpacity="0.0" />
                </linearGradient>
            </defs>
            <polygon points={`0,100 ${points} 100,100`} fill={`url(#grad-${color})`} className="transition-all duration-1000" />
            <polyline
                points={points}
                fill="none"
                stroke={color}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-all duration-1000 ${isActive ? 'opacity-100' : 'opacity-40'}`}
                style={{ filter: `drop-shadow(0px 4px 6px ${color}40)` }}
            />
        </svg>
    );
};

export default function EtherealDashboard() {
    const [mounted, setMounted] = useState(false);
    const [activeTab, setActiveTab] = useState('Overview');
    const [time, setTime] = useState(new Date());

    // 3D Refs for cards
    const card1 = use3DTilt(8);
    const card2 = use3DTilt(8);
    const card3 = use3DTilt(8);

    useEffect(() => {
        setMounted(true);
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    if (!mounted) return null;

    return (
        <>
            {/* Custom CSS for Peaceful Fluid Animations */}
            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes aurora {
          0% { background-position: 50% 50%, 50% 50%; }
          100% { background-position: 350% 50%, 350% 50%; }
        }
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes breathe {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        .bg-ethereal {
          background-image: 
            radial-gradient(circle at 15% 50%, rgba(13, 148, 136, 0.15), transparent 25%),
            radial-gradient(circle at 85% 30%, rgba(14, 165, 233, 0.15), transparent 25%);
        }
        .glass-panel {
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        }
      `}} />

            <div className="relative min-h-screen bg-[#020617] text-slate-200 font-sans overflow-hidden selection:bg-teal-500/30">

                {/* Deep Ocean / Ethereal Background Orbs */}
                <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-teal-900/20 rounded-full mix-blend-screen filter blur-[100px] animate-[breathe_12s_ease-in-out_infinite]"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-sky-900/20 rounded-full mix-blend-screen filter blur-[120px] animate-[breathe_15s_ease-in-out_infinite_reverse]"></div>

                {/* Floating Top Navigation */}
                <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-50 animate-[floatSlow_6s_ease-in-out_infinite]">
                    <div className="glass-panel flex items-center p-2 rounded-full shadow-[0_0_40px_rgba(13,148,136,0.1)]">
                        {['Overview', 'Flow Analytics', 'System Harmony'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`relative px-8 py-3 rounded-full text-sm font-medium tracking-wide transition-all duration-700 ${activeTab === tab
                                    ? 'text-teal-300'
                                    : 'text-slate-500 hover:text-slate-300'
                                    }`}
                            >
                                {activeTab === tab && (
                                    <div className="absolute inset-0 bg-teal-500/10 rounded-full shadow-[inset_0_0_20px_rgba(20,184,166,0.2)] border border-teal-500/20 z-[-1]"></div>
                                )}
                                {tab}
                            </button>
                        ))}
                    </div>
                </nav>

                {/* Main Content Area */}
                <main className="relative max-w-7xl mx-auto px-6 pt-40 pb-20 z-10">

                    {/* Header section */}
                    <div className="flex flex-col items-center justify-center mb-20 text-center">
                        <h1 className="text-5xl md:text-6xl font-extralight tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500 mb-4 drop-shadow-sm">
                            System Equilibrium
                        </h1>
                        <p className="flex items-center space-x-3 text-sm tracking-[0.3em] uppercase text-slate-400">
                            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse shadow-[0_0_10px_rgba(45,212,191,0.8)]"></span>
                            <span>All nodes flowing smoothly</span>
                            <span>•</span>
                            <span className="font-mono">{time.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                        </p>
                    </div>

                    {/* 3D Peaceful Metric Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 perspective-1000">
                        {/* Card 1 */}
                        <div
                            ref={card1.ref} onMouseMove={card1.handleMouseMove} onMouseLeave={card1.handleMouseLeave} style={card1.style}
                            className="glass-panel rounded-3xl p-8 group cursor-default"
                        >
                            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-6">Current Flow Rate</h3>
                            <div className="flex items-end space-x-4 mb-8">
                                <span className="text-5xl font-light text-white">94.2</span>
                                <span className="text-lg text-teal-400 mb-1">TB/s</span>
                            </div>
                            <PeacefulWave data={generateSmoothWave(40, 25, 0.6)} color="#2dd4bf" isActive={true} />
                        </div>

                        {/* Card 2 */}
                        <div
                            ref={card2.ref} onMouseMove={card2.handleMouseMove} onMouseLeave={card2.handleMouseLeave} style={card2.style}
                            className="glass-panel rounded-3xl p-8 group cursor-default"
                        >
                            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-6">Global Resonance</h3>
                            <div className="flex items-end space-x-4 mb-8">
                                <span className="text-5xl font-light text-white">99.9</span>
                                <span className="text-lg text-sky-400 mb-1">%</span>
                            </div>
                            <PeacefulWave data={generateSmoothWave(40, 15, 1.1)} color="#38bdf8" isActive={true} />
                        </div>

                        {/* Card 3 */}
                        <div
                            ref={card3.ref} onMouseMove={card3.handleMouseMove} onMouseLeave={card3.handleMouseLeave} style={card3.style}
                            className="glass-panel rounded-3xl p-8 group cursor-default"
                        >
                            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-6">Thermal State</h3>
                            <div className="flex items-end space-x-4 mb-8">
                                <span className="text-5xl font-light text-white">Optimal</span>
                            </div>
                            <PeacefulWave data={generateSmoothWave(40, 5, 0.4)} color="#818cf8" isActive={true} />
                        </div>
                    </div>

                    {/* The Ethereal Data Ledger */}
                    <div className="glass-panel rounded-[2rem] p-2">
                        <div className="bg-[#0f172a]/50 rounded-[1.75rem] overflow-hidden backdrop-blur-md">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr>
                                        <th className="px-8 py-6 text-xs font-medium tracking-[0.2em] uppercase text-slate-500 border-b border-slate-800/50">Node Identifier</th>
                                        <th className="px-8 py-6 text-xs font-medium tracking-[0.2em] uppercase text-slate-500 border-b border-slate-800/50">Entity</th>
                                        <th className="px-8 py-6 text-xs font-medium tracking-[0.2em] uppercase text-slate-500 border-b border-slate-800/50">Frequency Pattern</th>
                                        <th className="px-8 py-6 text-xs font-medium tracking-[0.2em] uppercase text-slate-500 border-b border-slate-800/50 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/30">
                                    {initialLedgerData.map((row, idx) => (
                                        <tr
                                            key={row.id}
                                            className="group transition-all duration-700 hover:bg-slate-800/20"
                                            style={{ transitionDelay: `${idx * 50}ms` }} // Staggered hover effect
                                        >
                                            <td className="px-8 py-6">
                                                <span className="text-sm font-mono text-slate-400 group-hover:text-teal-200 transition-colors duration-500">{row.id}</span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="text-sm font-light text-slate-200">{row.entity}</span>
                                                <span className="block text-xs text-slate-600 mt-1">{row.region}</span>
                                            </td>
                                            <td className="px-8 py-6 w-64">
                                                <div className="opacity-40 group-hover:opacity-100 transition-opacity duration-700">
                                                    <PeacefulWave
                                                        data={row.health}
                                                        color={row.status === 'Synchronized' ? '#2dd4bf' : '#38bdf8'}
                                                        isActive={false}
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="inline-flex items-center space-x-2">
                                                    <span className="text-xs uppercase tracking-widest text-slate-400 group-hover:text-slate-200 transition-colors duration-500">
                                                        {row.status}
                                                    </span>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${row.status === 'Synchronized'
                                                        ? 'bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.8)]'
                                                        : 'bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)] animate-pulse'
                                                        }`}></span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </main>
            </div>
        </>
    );
}