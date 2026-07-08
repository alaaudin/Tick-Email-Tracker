"use client";

import { useState } from "react";

// --- MOCK DATA ---
const INITIAL_LEADS = [
    { id: 1, client: "Alexander V.", email: "a.v@harborcap.com", property: "Penthouse 7B, Manhattan", dispatched: "2025-07-15", status: "Confirmed" },
    { id: 2, client: "Isabella R.", email: "ir@luxeinvest.co", property: "Beachfront Est. #12, Malibu", dispatched: "2025-07-15", status: "Pending" },
    { id: 3, client: "Marcus T.", email: "marcus.t@crescent.com", property: "Sky Villa 43, Dubai", dispatched: "2025-07-14", status: "Dispatched" },
    { id: 4, client: "Sofia L.", email: "sofia.l@elitegroup.io", property: "Park Ave Triplex, NYC", dispatched: "2025-07-14", status: "Confirmed" },
    { id: 5, client: "Dmitri P.", email: "d.p@volkov.capital", property: "Hillside Mansion, LA", dispatched: "2025-07-13", status: "Pending" },
    { id: 6, client: "Elena G.", email: "e.g@mediterranean.re", property: "Coastal Villa, Mykonos", dispatched: "2025-07-13", status: "Dispatched" },
    { id: 7, client: "Nathan W.", email: "nw@westbrook.com", property: "Central Tower 22, NYC", dispatched: "2025-07-12", status: "Confirmed" },
    { id: 8, client: "Olivia M.", email: "olivia@prestige.ae", property: "Palm Jumeirah Villa", dispatched: "2025-07-12", status: "Pending" },
];

// --- METRICS DATA ---
const METRICS = [
    { label: "Total Dispatches", value: "2,847", growth: "+12.4%", positive: true },
    { label: "Confirmed", value: "1,843", growth: "+8.1%", positive: true },
    { label: "Pending", value: "712", growth: "-2.3%", positive: false },
    { label: "Delivery Rate", value: "94.8%", growth: "+4.7%", positive: true },
];

export default function DashboardPage() {
    // --- STATES ---
    const [activeTab, setActiveTab] = useState("Overview");
    const [filterStatus, setFilterStatus] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    // --- FILTER LOGIC ---
    const filteredLeads = INITIAL_LEADS.filter((item) => {
        const matchesStatus = filterStatus === "All" || item.status === filterStatus;
        const matchesSearch =
            item.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.email.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    // --- HELPER FOR STATUS BADGE ---
    const StatusBadge = ({ status }) => {
        const base =
            "px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full border shadow-[2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.05)]";

        switch (status) {
            case "Confirmed":
                return (
                    <span
                        className={`${base} bg-emerald-900/60 text-emerald-300 border-emerald-500/30 shadow-emerald-900/20`}
                    >
                        Confirmed
                    </span>
                );
            case "Pending":
                return (
                    <span
                        className={`${base} bg-amber-900/60 text-amber-300 border-amber-500/30 shadow-amber-900/20`}
                    >
                        Pending
                    </span>
                );
            default:
                return (
                    <span
                        className={`${base} bg-blue-900/60 text-blue-300 border-blue-500/30 shadow-blue-900/20`}
                    >
                        Dispatched
                    </span>
                );
        }
    };

    // --- 3D BUTTON PRESS (shared style) ---
    const tabButtonBase =
        "px-5 py-2 text-sm font-semibold tracking-tight rounded-full transition-all duration-200 active:translate-y-1 active:shadow-inner";

    const filterButtonBase =
        "px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-lg transition-all duration-200 active:translate-y-1 active:shadow-inner border";

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8 font-sans antialiased selection:bg-blue-600/30">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* --- 1. 3D FLOATING HEADER --- */}
                <div className="sticky top-4 z-50 w-full">
                    <div className="bg-slate-800/60 backdrop-blur-xl border-t border-l border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.1)] rounded-[2rem] px-4 py-2 flex items-center justify-between">

                        {/* Logo / Brand */}
                        <div className="flex items-center gap-2 pl-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-xl shadow-[inset_0_-4px_0_rgba(0,0,0,0.3),0_4px_12px_rgba(37,99,235,0.4)] flex items-center justify-center font-black text-white text-sm">
                                Q
                            </div>
                            <span className="text-white font-bold tracking-tight text-lg">QORVX</span>
                            <span className="text-zinc-400 text-[10px] uppercase tracking-widest ml-1 hidden sm:inline">
                                Enterprise
                            </span>
                        </div>

                        {/* Tabs */}
                        <div className="flex items-center gap-1 bg-slate-900/50 p-1 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]">
                            {["Overview", "Leads", "Analytics"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`${tabButtonBase} ${activeTab === tab
                                            ? "bg-blue-600 text-white shadow-[inset_0_-4px_0_rgba(0,0,0,0.3),0_4px_12px_rgba(37,99,235,0.5)]"
                                            : "text-zinc-400 hover:text-white hover:bg-slate-700/50"
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Right actions */}
                        <div className="flex items-center gap-3 pr-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 shadow-[0_4px_12px_rgba(37,99,235,0.5)] flex items-center justify-center text-white text-xs font-bold border border-white/10">
                                JD
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- 2. ISOMETRIC METRICS DECK --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {METRICS.map((metric, idx) => (
                        <div
                            key={idx}
                            className="bg-slate-800/50 backdrop-blur-xl border-t border-l border-white/10 shadow-[8px_8px_16px_rgba(0,0,0,0.4),_-8px_-8px_16px_rgba(255,255,255,0.02)] rounded-2xl p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.05)]"
                        >
                            <div className="flex justify-between items-start">
                                <span className="text-zinc-400 text-xs font-medium uppercase tracking-widest">
                                    {metric.label}
                                </span>
                                <span
                                    className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] border ${metric.positive
                                            ? "bg-emerald-900/30 text-emerald-300 border-emerald-500/20"
                                            : "bg-rose-900/30 text-rose-300 border-rose-500/20"
                                        }`}
                                >
                                    {metric.growth}
                                </span>
                            </div>
                            <div className="mt-2 text-4xl font-bold tracking-tight text-white drop-shadow-sm">
                                {metric.value}
                            </div>
                            {/* 3D Progress bar mock */}
                            <div className="mt-4 h-1 w-full bg-slate-700/50 rounded-full shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]">
                                <div
                                    className="h-full bg-blue-600 rounded-full shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)]"
                                    style={{ width: `${Math.min(100, idx * 20 + 40)}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* --- 3. DYNAMIC FILTER CONSOLE --- */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/30 backdrop-blur-sm border-t border-l border-white/5 shadow-[6px_6px_12px_rgba(0,0,0,0.3)] rounded-2xl p-4">
                    {/* Search Input */}
                    <div className="relative w-full sm:w-72">
                        <input
                            type="text"
                            placeholder="Search client, property, email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-900/50 text-white placeholder:text-zinc-500 pl-4 pr-4 py-2 rounded-xl border border-white/5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4),0_1px_0_rgba(255,255,255,0.05)] focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-transparent transition-all text-sm"
                        />
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex items-center gap-2 bg-slate-900/30 p-1 rounded-xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]">
                        {["All", "Confirmed", "Pending", "Dispatched"].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`${filterButtonBase} ${filterStatus === status
                                        ? "bg-blue-600 text-white border-blue-700 shadow-[inset_0_-3px_0_rgba(0,0,0,0.3),0_4px_12px_rgba(37,99,235,0.4)]"
                                        : "text-zinc-400 border-transparent hover:bg-slate-700/50 hover:text-white"
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* --- 4. ENTERPRISE 3D LEDGER (TABLE) --- */}
                <div className="bg-slate-800/40 backdrop-blur-xl border-t border-l border-white/10 shadow-[8px_8px_24px_rgba(0,0,0,0.5),_-8px_-8px_24px_rgba(255,255,255,0.02)] rounded-2xl overflow-hidden">
                    {/* Table Header */}
                    <div className="grid grid-cols-5 gap-4 px-6 py-4 bg-slate-900/50 border-b border-slate-700/50 shadow-[inset_0_-2px_0_rgba(255,255,255,0.02)]">
                        <div className="col-span-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                            Client
                        </div>
                        <div className="col-span-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hidden md:block">
                            Email
                        </div>
                        <div className="col-span-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                            Property
                        </div>
                        <div className="col-span-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hidden sm:block">
                            Dispatched
                        </div>
                        <div className="col-span-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500 text-right">
                            Status
                        </div>
                    </div>

                    {/* Table Body */}
                    <div className="divide-y divide-slate-700/30">
                        {filteredLeads.length > 0 ? (
                            filteredLeads.map((lead) => (
                                <div
                                    key={lead.id}
                                    className="grid grid-cols-5 gap-4 px-6 py-4 transition-all duration-150 hover:bg-slate-700/30 border-b border-slate-700/30 last:border-b-0"
                                >
                                    <div className="col-span-1 flex items-center">
                                        <span className="text-white font-semibold tracking-tight text-sm">
                                            {lead.client}
                                        </span>
                                    </div>
                                    <div className="col-span-1 flex items-center text-zinc-400 text-sm font-mono tracking-tight hidden md:flex">
                                        {lead.email}
                                    </div>
                                    <div className="col-span-1 flex items-center text-zinc-300 text-sm truncate">
                                        {lead.property}
                                    </div>
                                    <div className="col-span-1 flex items-center text-zinc-500 text-xs font-medium hidden sm:flex">
                                        {lead.dispatched}
                                    </div>
                                    <div className="col-span-1 flex items-center justify-end">
                                        <StatusBadge status={lead.status} />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="px-6 py-12 text-center text-zinc-500 font-medium tracking-tight">
                                No leads match the current filters.
                            </div>
                        )}
                    </div>

                    {/* Table Footer with 3D inset shadow */}
                    <div className="px-6 py-3 bg-slate-900/30 border-t border-white/5 shadow-[inset_0_8px_12px_rgba(0,0,0,0.2)] flex justify-between items-center">
                        <span className="text-[10px] uppercase tracking-widest text-zinc-500">
                            {filteredLeads.length} Entries
                        </span>
                        <span className="text-[10px] uppercase tracking-widest text-zinc-600">
                            Live • QORVX Core
                        </span>
                    </div>
                </div>

                {/* Mini 3D accent */}
                <div className="flex justify-end mt-2">
                    <div className="text-[10px] uppercase tracking-widest text-zinc-600/50 flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.4)] inline-block"></span>
                        System Operational • v3.2.1
                    </div>
                </div>
            </div>
        </div>
    );
}