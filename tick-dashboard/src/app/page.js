'use client';

import React, { useState, useMemo, useEffect } from 'react';

// --- Mock Enterprise Data with Sparkline Data ---
const initialLedgerData = [
    { id: 'TRX-8902', customer: 'Stark Industries', destination: 'New York, NY', date: '2026-07-08', amount: '$24,500.00', status: 'Confirmed', health: [40, 60, 45, 80, 50, 90, 100] },
    { id: 'TRX-8903', customer: 'Wayne Enterprises', destination: 'Gotham, NJ', date: '2026-07-08', amount: '$12,240.50', status: 'Pending', health: [80, 70, 60, 40, 30, 20, 10] },
    { id: 'TRX-8904', customer: 'Cyberdyne Systems', destination: 'San Jose, CA', date: '2026-07-07', amount: '$89,100.00', status: 'Confirmed', health: [10, 20, 40, 60, 80, 90, 95] },
    { id: 'TRX-8905', customer: 'Tyrell Corporation', destination: 'Los Angeles, CA', date: '2026-07-07', amount: '$156,000.00', status: 'Confirmed', health: [50, 50, 55, 60, 70, 85, 90] },
    { id: 'TRX-8906', customer: 'Massive Dynamic', destination: 'Boston, MA', date: '2026-07-06', amount: '$8,450.75', status: 'Pending', health: [90, 80, 50, 40, 60, 30, 20] },
    { id: 'TRX-8907', customer: 'LexCorp', destination: 'Metropolis, NY', date: '2026-07-06', amount: '$43,200.00', status: 'Confirmed', health: [20, 30, 45, 50, 70, 80, 100] },
    { id: 'TRX-8908', customer: 'Umbrella Corp', destination: 'Raccoon City, PA', date: '2026-07-05', amount: '$9,120.00', status: 'Pending', health: [100, 90, 70, 40, 20, 10, 5] },
];

// --- Mini SVG Sparkline Component ---
const Sparkline = ({ data, isPositive }) => {
    const max = Math.max(...data);
    const points = data.map((val, i) => `${(i / (data.length - 1)) * 100},${100 - (val / max) * 100}`).join(' ');
    const color = isPositive ? 'stroke-blue-400' : 'stroke-amber-400';
    const fill = isPositive ? 'fill-blue-500/10' : 'fill-amber-500/10';

    return (
        <svg viewBox="0 0 100 100" className="w-16 h-8 overflow-visible" preserveAspectRatio="none">
            <polygon points={`0,100 ${points} 100,100`} className={fill} />
            <polyline points={points} fill="none" className={`${color}`} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};

export default function ExtremeSpatialDashboard() {
    const [activeNavTab, setActiveNavTab] = useState('Overview');
    const [activeFilter, setActiveFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => setIsMounted(true), []);

    const filteredData = useMemo(() => {
        return initialLedgerData.filter((item) => {
            const matchesFilter = activeFilter === 'All' || item.status === activeFilter;
            const matchesSearch = item.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.id.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesFilter && matchesSearch;
        });
    }, [activeFilter, searchQuery]);

    // Extreme 3D Utility Classes
    const glassPanel = "bg-slate-800/40 backdrop-blur-2xl border-t border-l border-white/10";
    const shadowExtruded = "shadow-[12px_12px_24px_rgba(0,0,0,0.5),_-8px_-8px_20px_rgba(255,255,255,0.03)]";
    const shadowInset = "shadow-[inset_4px_4px_12px_rgba(0,0,0,0.8),_inset_-4px_-4px_12px_rgba(255,255,255,0.06)]";
    const buttonPress = "active:translate-y-1 active:shadow-[inset_2px_2px_8px_rgba(0,0,0,0.8),_inset_-2px_-2px_8px_rgba(255,255,255,0.05)]";

    if (!isMounted) return null; // Prevent hydration mismatch

    return (
        <div className="relative min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-blue-500/40 overflow-hidden pb-20">

            {/* Dynamic Ambient Background Lighting */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[150px] pointer-events-none mix-blend-screen opacity-50 animate-pulse"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-slate-700/30 rounded-full blur-[120px] pointer-events-none"></div>

            {/* 1. Dynamic Island Header */}
            <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-2xl">
                <div className={`relative flex items-center justify-between p-2 bg-slate-800/60 backdrop-blur-3xl border border-white/10 rounded-3xl ${shadowExtruded}`}>
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                    {['Overview', 'Dispatches', 'Analytics', 'Settings'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveNavTab(tab)}
                            className={`relative flex-1 py-2.5 rounded-2xl text-sm font-bold tracking-wide transition-all duration-300 z-10 ${buttonPress} ${activeNavTab === tab
                                ? `bg-slate-900/90 text-blue-400 ${shadowInset} ring-1 ring-blue-500/30`
                                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-700/30 hover:shadow-[0_0_15px_rgba(37,99,235,0.15)]'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <main className="relative max-w-[90rem] mx-auto px-6 pt-36 z-10">

                {/* Title with Glowing Accent */}
                <div className="mb-12 flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 drop-shadow-lg mb-2">
                            Global Network
                        </h1>
                        <p className="uppercase tracking-[0.3em] text-[10px] text-blue-400 font-bold flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
                            Live Spatial Uplink
                        </p>
                    </div>
                    <div className={`hidden md:flex flex-col items-end px-6 py-3 rounded-xl ${glassPanel} ${shadowExtruded}`}>
                        <span className="text-[10px] uppercase tracking-widest text-slate-500">System Load</span>
                        <span className="text-xl font-mono text-slate-200">14.02%</span>
                    </div>
                </div>

                {/* 2. Extreme Metrics Deck with Micro-Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-14">
                    {[
                        { label: 'Total Volume', value: '$4.2M', trend: '+12.4%', up: true, data: [10, 20, 15, 40, 35, 60, 80] },
                        { label: 'Confirmed Routes', value: '1,932', trend: '+8.1%', up: true, data: [20, 25, 30, 45, 60, 75, 90] },
                        { label: 'Pending Clearances', value: '421', trend: '-2.3%', up: false, data: [90, 80, 60, 40, 50, 30, 10] },
                        { label: 'Network Integrity', value: '99.9%', trend: '+0.1%', up: true, data: [95, 96, 95, 98, 99, 99, 100] },
                    ].map((metric, i) => (
                        <div
                            key={i}
                            className={`relative group ${glassPanel} rounded-3xl p-6 transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_30px_60px_rgba(0,0,0,0.7)] ${shadowExtruded} overflow-hidden`}
                        >
                            {/* Hover Glow Effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-blue-500/0 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                            <h3 className="uppercase tracking-widest text-xs font-bold text-slate-500 mb-4">{metric.label}</h3>
                            <div className="flex items-end justify-between z-10 relative">
                                <div>
                                    <span className="block text-4xl font-extrabold tracking-tighter text-white mb-2">{metric.value}</span>
                                    <span className={`inline-flex px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${shadowInset} ${metric.up ? 'bg-blue-900/40 text-blue-400 ring-1 ring-blue-500/50' : 'bg-slate-900/60 text-amber-400 ring-1 ring-amber-500/50'
                                        }`}>
                                        {metric.trend}
                                    </span>
                                </div>
                                <div className="opacity-70 group-hover:opacity-100 transition-opacity">
                                    <Sparkline data={metric.data} isPositive={metric.up} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 3. The Command Filter */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div className="relative w-full md:w-[28rem] group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Query Database (ID, Customer)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`w-full bg-slate-900/80 text-slate-200 text-sm font-medium pl-12 pr-4 py-4 rounded-2xl border-t border-l border-white/5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${shadowInset} placeholder:text-slate-600 transition-all`}
                        />
                    </div>

                    <div className={`flex items-center space-x-2 p-2 bg-slate-800/60 backdrop-blur-xl rounded-2xl border-t border-l border-white/10 ${shadowExtruded}`}>
                        {['All', 'Confirmed', 'Pending'].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-200 ${buttonPress} ${activeFilter === filter
                                    ? `bg-slate-900 text-blue-400 ${shadowInset} ring-1 ring-blue-500/40`
                                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                                    }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 4. The Extruded Main Ledger */}
                <div className={`relative p-1 rounded-3xl bg-gradient-to-b from-slate-700/50 to-slate-900/50 ${shadowExtruded}`}>
                    <div className={`bg-slate-900/90 backdrop-blur-3xl rounded-[22px] overflow-hidden`}>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse whitespace-nowrap">
                                <thead>
                                    <tr className="bg-slate-800/80">
                                        <th className="px-8 py-5 uppercase tracking-[0.2em] text-[10px] font-black text-slate-500 border-b border-slate-700">Txn ID</th>
                                        <th className="px-8 py-5 uppercase tracking-[0.2em] text-[10px] font-black text-slate-500 border-b border-slate-700">Entity</th>
                                        <th className="px-8 py-5 uppercase tracking-[0.2em] text-[10px] font-black text-slate-500 border-b border-slate-700">Vector</th>
                                        <th className="px-8 py-5 uppercase tracking-[0.2em] text-[10px] font-black text-slate-500 border-b border-slate-700">Timestamp</th>
                                        <th className="px-8 py-5 uppercase tracking-[0.2em] text-[10px] font-black text-slate-500 border-b border-slate-700">Capital</th>
                                        <th className="px-8 py-5 uppercase tracking-[0.2em] text-[10px] font-black text-slate-500 border-b border-slate-700">Telemetry</th>
                                        <th className="px-8 py-5 uppercase tracking-[0.2em] text-[10px] font-black text-slate-500 border-b border-slate-700 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60">
                                    {filteredData.length > 0 ? (
                                        filteredData.map((row) => (
                                            <tr key={row.id} className="group transition-all duration-300 hover:bg-blue-900/10 cursor-pointer">
                                                <td className="px-8 py-6 text-sm font-mono font-semibold text-blue-400 group-hover:text-blue-300">{row.id}</td>
                                                <td className="px-8 py-6 text-sm font-bold text-slate-200">{row.customer}</td>
                                                <td className="px-8 py-6 text-sm text-slate-400 font-medium">{row.destination}</td>
                                                <td className="px-8 py-6 text-sm font-mono text-slate-500">{row.date}</td>
                                                <td className="px-8 py-6 text-sm font-extrabold text-white tracking-tight">{row.amount}</td>
                                                <td className="px-8 py-6 w-32">
                                                    <div className="opacity-50 group-hover:opacity-100 transition-opacity">
                                                        <Sparkline data={row.health} isPositive={row.status === 'Confirmed'} />
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-center">
                                                    <div className={`inline-flex items-center justify-center px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${row.status === 'Confirmed'
                                                        ? `bg-blue-900/30 text-blue-400 ring-1 ring-blue-500/50 ${shadowInset}`
                                                        : `bg-slate-800/80 text-amber-500 ring-1 ring-amber-500/30 ${shadowInset}`
                                                        }`}>
                                                        {row.status === 'Confirmed' && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-2 animate-pulse"></span>}
                                                        {row.status}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="px-8 py-20 text-center">
                                                <div className="flex flex-col items-center justify-center space-y-4">
                                                    <svg className="w-12 h-12 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                                    </svg>
                                                    <span className="text-sm font-bold tracking-widest uppercase text-slate-500">Zero matches found in current spatial vector</span>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}