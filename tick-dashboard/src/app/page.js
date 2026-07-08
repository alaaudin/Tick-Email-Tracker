'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';

// ═══════════════════════════════════════════════════════════
// MOCK DATA — 10 Realistic Enterprise Records
// ═══════════════════════════════════════════════════════════
const LEDGER_DATA = [
    { id: 'TX-8841', name: 'Elon Musk', email: 'elon.musk@x.com', status: 'Confirmed', time: '2m ago', value: '$12,400', avatar: 'EM', trend: [12, 19, 15, 25, 22, 30, 28] },
    { id: 'TX-8842', name: 'Sundar Pichai', email: 'sundar.pichai@google.com', status: 'Pending', time: '14m ago', value: '$8,200', avatar: 'SP', trend: [8, 12, 10, 15, 18, 14, 20] },
    { id: 'TX-8843', name: 'Satya Nadella', email: 'satya.nadella@microsoft.com', status: 'Confirmed', time: '32m ago', value: '$24,000', avatar: 'SN', trend: [20, 25, 22, 30, 35, 32, 40] },
    { id: 'TX-8844', name: 'Tim Cook', email: 'tim.cook@apple.com', status: 'Confirmed', time: '1h ago', value: '$15,600', avatar: 'TC', trend: [15, 18, 16, 22, 20, 25, 28] },
    { id: 'TX-8845', name: 'Jensen Huang', email: 'jensen.huang@nvidia.com', status: 'Pending', time: '2h ago', value: '$31,200', avatar: 'JH', trend: [25, 30, 28, 35, 40, 38, 45] },
    { id: 'TX-8846', name: 'Jeff Bezos', email: 'jeff.bezos@amazon.com', status: 'Bounced', time: '3h ago', value: '$5,000', avatar: 'JB', trend: [10, 8, 12, 6, 9, 5, 8] },
    { id: 'TX-8847', name: 'Mark Zuckerberg', email: 'mark.zuckerberg@meta.com', status: 'Confirmed', time: '4h ago', value: '$9,800', avatar: 'MZ', trend: [5, 10, 8, 15, 12, 18, 20] },
    { id: 'TX-8848', name: 'Larry Ellison', email: 'larry.ellison@oracle.com', status: 'Pending', time: '5h ago', value: '$18,500', avatar: 'LE', trend: [18, 22, 20, 25, 28, 24, 30] },
    { id: 'TX-8849', name: 'Tim Berners-Lee', email: 'tim@w3.org', status: 'Confirmed', time: '6h ago', value: '$2,400', avatar: 'TB', trend: [2, 5, 4, 8, 6, 10, 12] },
    { id: 'TX-8850', name: 'Linus Torvalds', email: 'linus@linux.org', status: 'Confirmed', time: '7h ago', value: '$7,100', avatar: 'LT', trend: [6, 8, 7, 12, 10, 14, 16] },
];

const STATUS_CONFIG = {
    Confirmed: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', dot: 'bg-emerald-400', spark: '#34d399' },
    Pending: { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', dot: 'bg-amber-400', spark: '#fbbf24' },
    Bounced: { color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', dot: 'bg-rose-400', spark: '#fb7185' },
};

const NAV_TABS = ['Overview', 'Dispatches', 'Analytics', 'Settings'];
const FILTER_TABS = ['All', 'Confirmed', 'Pending'];

// ═══════════════════════════════════════════════════════════
// ANIMATED COUNTER HOOK
// ═══════════════════════════════════════════════════════════
function useCounter(target, duration = 2500) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let start = 0;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
            start += step;
            if (start >= target) {
                setCount(target);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);
        return () => clearInterval(timer);
    }, [target, duration]);
    return count;
}

// ═══════════════════════════════════════════════════════════
// TEXT SCRAMBLE EFFECT
// ═══════════════════════════════════════════════════════════
function useTextScramble(finalText, trigger) {
    const [display, setDisplay] = useState('');
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';

    useEffect(() => {
        if (!trigger) return;
        let iteration = 0;
        const interval = setInterval(() => {
            setDisplay(
                finalText
                    .split('')
                    .map((letter, index) => {
                        if (index < iteration) return finalText[index];
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join('')
            );
            if (iteration >= finalText.length) clearInterval(interval);
            iteration += 1 / 2;
        }, 40);
        return () => clearInterval(interval);
    }, [trigger, finalText]);

    return display;
}

// ═══════════════════════════════════════════════════════════
// 3D TILT CARD
// ═══════════════════════════════════════════════════════════
function TiltCard({ children, className = '', glowColor = 'rgba(6,182,212,0.15)' }) {
    const cardRef = useRef(null);

    const handleMouseMove = (e) => {
        const card = cardRef.current;
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        card.style.setProperty('--glow-x', `${x}px`);
        card.style.setProperty('--glow-y', `${y}px`);
    };

    const handleMouseLeave = () => {
        const card = cardRef.current;
        if (!card) return;
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    };

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`relative transition-transform duration-100 ease-out ${className}`}
            style={{ transformStyle: 'preserve-3d' }}
        >
            <div
                className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                    background: `radial-gradient(400px circle at var(--glow-x, 50%) var(--glow-y, 50%), ${glowColor}, transparent 40%)`
                }}
            />
            {children}
        </div>
    );
}

// ═══════════════════════════════════════════════════════════
// SPARKLINE CHART
// ═══════════════════════════════════════════════════════════
function Sparkline({ data, color }) {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 100 - ((val - min) / range) * 80 - 10;
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg className="w-full h-10 mt-3" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
                <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <polyline
                points={points}
                fill="none"
                stroke={color}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
            />
            <polygon
                points={`0,100 ${points} 100,100`}
                fill={`url(#grad-${color})`}
                stroke="none"
            />
        </svg>
    );
}

// ═══════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ═══════════════════════════════════════════════════════════
export default function AbyssalCommand() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [activeTab, setActiveTab] = useState('Overview');
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [mounted, setMounted] = useState(false);

    // Entrance animation
    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 100);
        return () => clearTimeout(timer);
    }, []);

    // Mouse spotlight tracking
    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Animated counters
    const totalDispatches = useCounter(2847);
    const confirmedCount = useCounter(2412);
    const pendingCount = useCounter(312);
    const deliveryRate = useCounter(94);

    // Text scramble
    const scrambledTitle = useTextScramble('COMMAND CENTER', mounted);

    // Filter logic
    const filteredData = useMemo(() => {
        return LEDGER_DATA.filter((item) => {
            const matchesFilter = filterStatus === 'All' || item.status === filterStatus;
            const matchesSearch =
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.id.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesFilter && matchesSearch;
        });
    }, [filterStatus, searchQuery]);

    // Metrics config
    const metrics = [
        { label: 'Total Dispatches', value: totalDispatches, suffix: '', color: '#06b6d4', spark: [20, 35, 25, 45, 30, 50, 40, 60, 55, 70] },
        { label: 'Confirmed', value: confirmedCount, suffix: '', color: '#34d399', spark: [15, 25, 20, 30, 25, 35, 30, 40, 38, 45] },
        { label: 'Pending', value: pendingCount, suffix: '', color: '#fbbf24', spark: [5, 8, 6, 10, 8, 12, 10, 15, 12, 18] },
        { label: 'Delivery Rate', value: deliveryRate, suffix: '%', color: '#a78bfa', spark: [70, 72, 75, 78, 80, 82, 85, 88, 90, 94] },
    ];

    return (
        <div className="min-h-screen bg-[#020203] text-white font-sans selection:bg-cyan-500/40 selection:text-cyan-100 overflow-x-hidden">
            {/* GLOBAL STYLES */}
            <style>{`
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #020203; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #334155; }
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.05); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
        }
        @keyframes gridMove {
          0% { transform: translateY(0); }
          100% { transform: translateY(60px); }
        }
      `}</style>

            {/* MOUSE SPOTLIGHT */}
            <div
                className="pointer-events-none fixed inset-0 z-[100] transition-opacity duration-700"
                style={{
                    background: `radial-gradient(700px circle at ${mousePos.x}px ${mousePos.y}px, rgba(6, 182, 212, 0.07), transparent 40%)`
                }}
            />

            {/* ANIMATED AURORA ORBS */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute top-[-20%] left-[-10%] w-[900px] h-[900px] bg-purple-900/15 rounded-full blur-[150px]"
                    style={{ animation: 'float 20s ease-in-out infinite' }}
                />
                <div
                    className="absolute bottom-[-20%] right-[-10%] w-[900px] h-[900px] bg-blue-900/15 rounded-full blur-[150px]"
                    style={{ animation: 'float 25s ease-in-out infinite 5s' }}
                />
                <div
                    className="absolute top-[30%] left-[50%] w-[600px] h-[600px] bg-cyan-900/10 rounded-full blur-[120px]"
                    style={{ animation: 'float 18s ease-in-out infinite 10s' }}
                />
            </div>

            {/* MOVING GRID */}
            <div className="fixed inset-0 pointer-events-none opacity-20">
                <div
                    className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.07)_1px,transparent_1px)] bg-[size:80px_80px]"
                    style={{ animation: 'gridMove 20s linear infinite' }}
                />
            </div>

            {/* CONTENT */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">

                {/* ═══════════════════════════════════════════════════ */}
                {/* HEADER                                            */}
                {/* ═══════════════════════════════════════════════════ */}
                <header
                    className={`flex items-center justify-between mb-20 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-12'
                        }`}
                >
                    <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_40px_rgba(6,182,212,0.4)]">
                            <div className="absolute inset-0 rounded-xl bg-cyan-400/20 animate-pulse" />
                            <svg className="w-5 h-5 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <div>
                            <span className="text-lg font-bold tracking-tight text-white">NEXUS</span>
                            <span className="block text-[9px] text-zinc-600 uppercase tracking-[0.3em] font-bold">Core Systems</span>
                        </div>
                    </div>

                    <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-full p-1 shadow-2xl">
                        {NAV_TABS.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`relative px-6 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all duration-300 ${activeTab === tab
                                    ? 'text-white'
                                    : 'text-zinc-600 hover:text-zinc-300'
                                    }`}
                            >
                                {activeTab === tab && (
                                    <div className="absolute inset-0 bg-white/10 rounded-full shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] border border-white/5" />
                                )}
                                <span className="relative z-10">{tab}</span>
                            </button>
                        ))}
                    </nav>

                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex flex-col items-end">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">System Status</span>
                            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                                Online
                            </span>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 border border-white/10 flex items-center justify-center text-[10px] font-bold text-zinc-300 shadow-lg">
                            AC
                        </div>
                    </div>
                </header>

                {/* ═══════════════════════════════════════════════════ */}
                {/* HERO — SCRAMBLE TEXT                              */}
                {/* ═══════════════════════════════════════════════════ */}
                <div
                    className={`mb-16 transition-all duration-1000 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                        }`}
                >
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-2">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-600">
                            {scrambledTitle || 'COMMAND CENTER'}
                        </span>
                    </h1>
                    <div className="flex items-center gap-4">
                        <div className="h-px flex-1 bg-gradient-to-r from-cyan-500/50 to-transparent" />
                        <p className="text-zinc-500 text-sm font-medium tracking-wide uppercase">
                            Real-time Dispatch Orchestration
                        </p>
                        <div className="h-px flex-1 bg-gradient-to-l from-cyan-500/50 to-transparent" />
                    </div>
                </div>

                {/* ═══════════════════════════════════════════════════ */}
                {/* BENTO METRICS DECK                                */}
                {/* ═══════════════════════════════════════════════════ */}
                <div
                    className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12 transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                        }`}
                >
                    {metrics.map((metric, i) => (
                        <TiltCard key={metric.label} glowColor={`${metric.color}20`}>
                            <div className="relative h-full bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 overflow-hidden group hover:border-white/20 transition-colors duration-500 shadow-2xl">
                                {/* Ambient glow */}
                                <div
                                    className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity duration-500"
                                    style={{ backgroundColor: metric.color }}
                                />

                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em]">
                                            {metric.label}
                                        </span>
                                        <div
                                            className="w-2 h-2 rounded-full shadow-[0_0_10px]"
                                            style={{ backgroundColor: metric.color, boxShadow: `0 0 10px ${metric.color}` }}
                                        />
                                    </div>

                                    <div className="text-4xl font-black tracking-tight text-white mb-1">
                                        {metric.value.toLocaleString()}{metric.suffix}
                                    </div>

                                    <Sparkline data={metric.spark} color={metric.color} />
                                </div>
                            </div>
                        </TiltCard>
                    ))}
                </div>

                {/* ═══════════════════════════════════════════════════ */}
                {/* FILTER CONSOLE                                    */}
                {/* ═══════════════════════════════════════════════════ */}
                <div
                    className={`flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 transition-all duration-1000 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                        }`}
                >
                    <div className="relative w-full sm:w-[28rem] group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="w-4 h-4 text-zinc-700 group-focus-within:text-cyan-400 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search by name, email, or transaction ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-3.5 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-xl text-sm text-white placeholder-zinc-700
                focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 focus:shadow-[0_0_30px_rgba(6,182,212,0.1)]
                transition-all duration-300 shadow-xl"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-600 hover:text-white transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-2 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-xl p-1 shadow-xl">
                        {FILTER_TABS.map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilterStatus(f)}
                                className={`relative px-5 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all duration-300 ${filterStatus === f
                                    ? 'text-white'
                                    : 'text-zinc-600 hover:text-zinc-300'
                                    }`}
                            >
                                {filterStatus === f && (
                                    <div className="absolute inset-0 bg-white/10 rounded-lg shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] border border-white/5" />
                                )}
                                <span className="relative z-10">{f}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* ═══════════════════════════════════════════════════ */}
                {/* ENTERPRISE LEDGER                                 */}
                {/* ═══════════════════════════════════════════════════ */}
                <div
                    className={`transition-all duration-1000 delay-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                        }`}
                >
                    <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative">
                        {/* Top gradient line */}
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

                        {/* Table Header */}
                        <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 bg-slate-900/50">
                            <div className="col-span-2 text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em]">ID</div>
                            <div className="col-span-3 text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em]">Recipient</div>
                            <div className="col-span-3 hidden md:block text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em]">Email</div>
                            <div className="col-span-2 text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em]">Status</div>
                            <div className="col-span-2 text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] text-right">Time</div>
                            <div className="col-span-1 text-right hidden sm:block text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em]">Value</div>
                        </div>

                        {/* Table Body */}
                        <div className="divide-y divide-white/[0.03]">
                            {filteredData.length > 0 ? (
                                filteredData.map((item, index) => {
                                    const status = STATUS_CONFIG[item.status];
                                    return (
                                        <div
                                            key={item.id}
                                            className="group grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-white/[0.03] transition-all duration-300 cursor-pointer relative overflow-hidden"
                                            style={{
                                                opacity: 0,
                                                animation: `fadeIn 0.5s ease-out ${index * 0.05}s forwards`
                                            }}
                                        >
                                            <style>{`
                        @keyframes fadeIn {
                          from { opacity: 0; transform: translateX(-10px); }
                          to { opacity: 1; transform: translateX(0); }
                        }
                      `}</style>

                                            {/* Hover sweep effect */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/[0.03] to-cyan-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                                            <div className="col-span-2 relative z-10">
                                                <span className="text-xs font-mono text-zinc-600 group-hover:text-cyan-400 transition-colors duration-300 tracking-wider">{item.id}</span>
                                            </div>
                                            <div className="col-span-3 relative z-10 flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center text-[10px] font-bold text-zinc-400 group-hover:text-white group-hover:border-cyan-500/30 transition-all duration-300 shadow-lg">
                                                    {item.avatar}
                                                </div>
                                                <div>
                                                    <span className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors duration-300 block">{item.name}</span>
                                                    <span className="text-[10px] text-zinc-700 md:hidden">{item.email}</span>
                                                </div>
                                            </div>
                                            <div className="col-span-3 hidden md:block relative z-10">
                                                <span className="text-xs text-zinc-600 group-hover:text-zinc-400 transition-colors duration-300 font-mono">{item.email}</span>
                                            </div>
                                            <div className="col-span-2 relative z-10">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${status.bg} ${status.color} ${status.border} shadow-[0_0_10px_rgba(0,0,0,0.3)]`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${status.dot} ${item.status === 'Pending' ? 'animate-pulse' : ''}`} style={{ boxShadow: item.status === 'Confirmed' ? `0 0 6px ${status.spark}` : 'none' }} />
                                                    {item.status}
                                                </span>
                                            </div>
                                            <div className="col-span-2 relative z-10 text-right">
                                                <span className="text-xs text-zinc-700 group-hover:text-zinc-400 transition-colors duration-300 tabular-nums font-mono">{item.time}</span>
                                            </div>
                                            <div className="col-span-1 relative z-10 text-right hidden sm:block">
                                                <span className="text-xs font-bold text-zinc-300 group-hover:text-white transition-colors duration-300 tabular-nums font-mono">{item.value}</span>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="px-6 py-16 text-center">
                                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center">
                                        <svg className="w-6 h-6 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <p className="text-sm text-zinc-600 font-medium">No records found matching your criteria.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer Meta */}
                    <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-zinc-800 uppercase tracking-[0.2em] font-bold">
                        <span>Displaying {filteredData.length} of {LEDGER_DATA.length} records</span>
                        <span className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                            Live Sync Active • {new Date().toLocaleTimeString()}
                        </span>
                    </div>
                </div>

            </div>
        </div>
    );
}