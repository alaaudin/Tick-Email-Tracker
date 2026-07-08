'use client'

import React from 'react'

export default function BrutalistDashboard() {
    // Hardcoded Telemetry Data
    const ledger = [
        { id: 'TX-001', to: 'elon@tesla.com', status: 'ACKNOWLEDGED', opens: 3, loc: 'AUSTIN, TX', time: '10:42 AM' },
        { id: 'TX-002', to: 'sundar@google.com', status: 'ACKNOWLEDGED', opens: 7, loc: 'MOUNTAIN VIEW, CA', time: '10:15 AM' },
        { id: 'TX-003', to: 'satya@microsoft.com', status: 'PENDING', opens: 0, loc: 'REDMOND, WA', time: '09:50 AM' },
        { id: 'TX-004', to: 'tim@apple.com', status: 'ACKNOWLEDGED', opens: 12, loc: 'CUPERTINO, CA', time: '09:11 AM' },
        { id: 'TX-005', to: 'jeff@amazon.com', status: 'PENDING', opens: 0, loc: 'SEATTLE, WA', time: '08:45 AM' },
    ]

    // Generating a random "Barcode" for the telemetry graph
    const barcode = Array.from({ length: 80 }).map(() => Math.floor(Math.random() * 100))

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
            <div className="max-w-[1400px] mx-auto px-8 md:px-16 py-12">

                {/* 1. MINIMALIST HEADER */}
                <header className="flex justify-between items-baseline pb-10 border-b border-zinc-900">
                    <div className="text-2xl font-bold tracking-tighter">TICKK<span className="text-zinc-600">_</span></div>
                    <div className="flex gap-8 text-[10px] font-mono tracking-[0.2em] text-zinc-500 uppercase hidden md:flex">
                        <span className="text-white">Telemetry</span>
                        <span className="hover:text-white transition-colors cursor-pointer">Network</span>
                        <span className="hover:text-white transition-colors cursor-pointer">Console</span>
                    </div>
                    <div className="text-[9px] font-mono tracking-widest text-emerald-500 uppercase flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                        System Live
                    </div>
                </header>

                {/* 2. THE GOD-TIER MONOLITH METRICS */}
                <div className="mt-24 mb-32 flex flex-col xl:flex-row justify-between items-start xl:items-end gap-16">
                    <div className="group cursor-default">
                        <div className="text-[10px] font-mono tracking-[0.4em] text-zinc-500 uppercase mb-4 group-hover:text-white transition-colors duration-500">
                            Volume_Outbound
                        </div>
                        {/* Massive Integer */}
                        <div className="text-[100px] md:text-[140px] leading-none font-extralight tracking-tighter text-white">
                            2,847
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-12 md:gap-24 pb-4">
                        <div className="flex flex-col gap-2">
                            <div className="text-[9px] font-mono tracking-[0.3em] text-zinc-600 uppercase">Confirmed</div>
                            <div className="text-4xl md:text-5xl font-light tracking-tight text-white">2,631</div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="text-[9px] font-mono tracking-[0.3em] text-zinc-600 uppercase">Pending</div>
                            <div className="text-4xl md:text-5xl font-light tracking-tight text-zinc-500">216</div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="text-[9px] font-mono tracking-[0.3em] text-zinc-600 uppercase">Hit Rate</div>
                            <div className="text-4xl md:text-5xl font-light tracking-tight text-white">92.4<span className="text-2xl text-zinc-600">%</span></div>
                        </div>
                    </div>
                </div>

                {/* 3. THE BARCODE TELEMETRY PULSE (Completely different from Resend bars) */}
                <div className="mb-24">
                    <div className="text-[9px] font-mono tracking-[0.4em] text-zinc-600 uppercase mb-8 border-b border-zinc-900/50 pb-4 flex justify-between">
                        <span>Network_Pulse_Frequency</span>
                        <span>Last 24h</span>
                    </div>
                    <div className="flex items-end h-24 gap-[2px] w-full opacity-80 group hover:opacity-100 transition-opacity duration-500 cursor-crosshair">
                        {barcode.map((val, i) => {
                            // Creating a tech-barcode visual effect
                            let bgClass = 'bg-zinc-900'
                            if (val > 85) bgClass = 'bg-white'
                            else if (val > 50) bgClass = 'bg-zinc-600'
                            else if (val > 20) bgClass = 'bg-zinc-800'

                            return (
                                <div
                                    key={i}
                                    className={`flex-1 ${bgClass} transition-all duration-300 hover:bg-white`}
                                    style={{ height: `${Math.max(10, val)}%` }}
                                ></div>
                            )
                        })}
                    </div>
                </div>

                {/* 4. THE RAW LEDGER (No traditional table borders) */}
                <div className="mt-16 w-full">
                    <div className="flex justify-between items-center pb-6 mb-2 text-[9px] font-mono tracking-[0.3em] text-zinc-600 uppercase">
                        <span>Ledger_Trace</span>
                        <span className="hidden md:block">Routing_Location</span>
                        <span>Time_Sync</span>
                    </div>

                    <div className="flex flex-col">
                        {ledger.map((item, idx) => (
                            <div
                                key={item.id}
                                className="group flex flex-col md:flex-row items-start md:items-center justify-between py-8 border-b border-zinc-900/40 hover:bg-zinc-900/20 transition-all duration-300 px-4 -mx-4 cursor-crosshair"
                            >
                                <div className="flex items-center gap-6 md:gap-12 w-full md:w-1/2 mb-4 md:mb-0">
                                    <span className="text-[9px] font-mono text-zinc-600 w-12 hidden md:block">{(idx + 1).toString().padStart(2, '0')}</span>
                                    <span className="text-xl md:text-2xl font-light tracking-tight text-zinc-300 group-hover:text-white group-hover:translate-x-2 transition-all duration-300">
                                        {item.to}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between md:justify-end gap-8 md:gap-16 w-full md:w-1/2">
                                    <span className={`text-[10px] font-mono tracking-widest ${item.status === 'ACKNOWLEDGED' ? 'text-zinc-300' : 'text-zinc-600'}`}>
                                        [{item.status === 'ACKNOWLEDGED' ? '+' : '-'}] {item.status}
                                    </span>
                                    <span className="text-[10px] font-mono tracking-widest text-zinc-600 text-right hidden md:block w-32">
                                        {item.loc}
                                    </span>
                                    <span className="text-[10px] font-mono text-zinc-500 w-16 text-right">
                                        {item.time}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 text-center text-[9px] font-mono tracking-[0.4em] text-zinc-700 uppercase hover:text-zinc-400 transition-colors cursor-pointer">
                        [ Load_More_Nodes ]
                    </div>
                </div>

            </div>
        </div>
    )
}