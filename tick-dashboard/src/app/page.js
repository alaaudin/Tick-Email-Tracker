'use client'

import React from 'react'

export default function PeakDashboard() {
    // Hardcoded Telemetry Data
    const ledger = [
        { id: 'TX-001', to: 'elon@tesla.com', status: 'CONFIRMED', opens: 3, loc: 'Austin, TX', time: '10:42 AM' },
        { id: 'TX-002', to: 'sundar@google.com', status: 'CONFIRMED', opens: 7, loc: 'Mountain View, CA', time: '10:15 AM' },
        { id: 'TX-003', to: 'satya@microsoft.com', status: 'PENDING', opens: 0, loc: 'Redmond, WA', time: '09:50 AM' },
        { id: 'TX-004', to: 'tim@apple.com', status: 'CONFIRMED', opens: 12, loc: 'Cupertino, CA', time: '09:11 AM' },
        { id: 'TX-005', to: 'jensen@nvidia.com', status: 'CONFIRMED', opens: 5, loc: 'Santa Clara, CA', time: '08:45 AM' },
    ]

    // Generating a random simulated waveform
    const waveform = Array.from({ length: 45 }).map(() => Math.floor(Math.random() * 100))

    return (
        <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans selection:bg-emerald-500/30 overflow-hidden relative">

            {/* 3D AMBIENT BACKGROUND GLOWS (The magic sauce) */}
            <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-emerald-500/15 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none"></div>

            <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-12 relative z-10">

                {/* 1. RAZOR-SHARP HEADER */}
                <header className="flex justify-between items-center pb-8 border-b border-white/5 mb-10">
                    <div className="flex items-center gap-3">
                        {/* 3D App Icon */}
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-b from-zinc-700 to-zinc-950 border border-zinc-700 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)] flex items-center justify-center">
                            <span className="text-white font-bold text-sm">T</span>
                        </div>
                        <div className="text-xl font-medium tracking-tight text-white">TICKK</div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse"></span>
                            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">Live Node</span>
                        </div>
                    </div>
                </header>

                {/* 2. THE 3D BENTO GRID (Metrics & Chart) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

                    {/* Main Hero Card (2 Columns Wide) - Deep 3D Bevel */}
                    <div className="md:col-span-2 rounded-2xl bg-[#0a0a0c] border border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.05)] p-8 flex flex-col justify-between relative overflow-hidden group">
                        {/* Subtle surface gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none"></div>

                        <div className="relative z-10">
                            <div className="text-[11px] font-mono tracking-[0.2em] text-zinc-500 uppercase mb-2">Total Outbound Volume</div>
                            <div className="text-7xl font-light tracking-tighter text-white mb-8 flex items-baseline gap-2">
                                2,847
                                <span className="text-lg font-normal text-emerald-500 tracking-normal flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                                    +14%
                                </span>
                            </div>
                        </div>

                        {/* 3D Waveform Chart */}
                        <div className="h-20 w-full flex items-end gap-1 relative z-10">
                            {waveform.map((val, i) => (
                                <div
                                    key={i}
                                    className="flex-1 bg-gradient-to-t from-emerald-500/20 to-emerald-400/80 rounded-t-[2px] transition-all duration-300 group-hover:from-emerald-400/40 group-hover:to-emerald-300"
                                    style={{ height: `${Math.max(15, val)}%` }}
                                ></div>
                            ))}
                        </div>
                    </div>

                    {/* Side Metrics (Stacked) */}
                    <div className="flex flex-col gap-6">
                        <div className="flex-1 rounded-2xl bg-[#0a0a0c] border border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.05)] p-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[40px] rounded-full"></div>
                            <div className="text-[10px] font-mono tracking-[0.2em] text-zinc-500 uppercase mb-2">Confirmed</div>
                            <div className="text-4xl font-light tracking-tight text-white">2,631</div>
                        </div>
                        <div className="flex-1 rounded-2xl bg-[#0a0a0c] border border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.05)] p-6 relative overflow-hidden">
                            <div className="text-[10px] font-mono tracking-[0.2em] text-zinc-500 uppercase mb-2">Pending</div>
                            <div className="text-4xl font-light tracking-tight text-zinc-400">216</div>
                        </div>
                    </div>

                </div>

                {/* 3. THE PRECISION LEDGER (3D Table View) */}
                <div className="rounded-2xl bg-[#0a0a0c] border border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.05)] overflow-hidden">

                    {/* Table Toolbar */}
                    <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                        <div className="text-[11px] font-mono tracking-[0.2em] text-zinc-400 uppercase">Recent Dispatches</div>
                        <div className="flex gap-2">
                            {['All', 'Confirmed', 'Pending'].map(tab => (
                                <button key={tab} className={`px-3 py-1 rounded-md text-[10px] font-mono uppercase tracking-widest border ${tab === 'All' ? 'bg-zinc-800 text-white border-zinc-700 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]' : 'bg-transparent text-zinc-500 border-transparent hover:text-zinc-300'}`}>
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Table Rows */}
                    <div className="flex flex-col">
                        {ledger.map((item, idx) => (
                            <div
                                key={item.id}
                                className="group flex items-center justify-between px-6 py-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer"
                            >
                                <div className="flex items-center gap-4 w-1/3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-b from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center text-[10px] font-mono text-zinc-400 shadow-sm">
                                        {item.to.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">{item.to}</span>
                                </div>

                                <div className="w-1/4 flex items-center">
                                    <div className={`px-2.5 py-1 rounded-full text-[9px] font-mono tracking-widest border ${item.status === 'CONFIRMED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                                        {item.status}
                                    </div>
                                </div>

                                <div className="w-1/4 text-[11px] font-mono text-zinc-500 hidden md:block">
                                    {item.loc}
                                </div>

                                <div className="w-1/6 text-[11px] font-mono text-zinc-500 text-right">
                                    {item.time}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    )
}