"use client";

import { useState } from "react";
import {
    Search,
    Sun,
    Moon,
    TrendingUp,
    TrendingDown,
    ArrowUpRight,
    CheckCircle,
    Clock,
    Send
} from "lucide-react";

// --- MOCK DATA ---
const INITIAL_LEADS = [
    { id: 1, client: "Alexander V.", email: "a.v@harbor.cap", property: "Penthouse 7B, Manhattan", dispatched: "Jul 15", status: "Confirmed" },
    { id: 2, client: "Isabella R.", email: "ir@luxeinvest.co", property: "Beachfront Est. #12", dispatched: "Jul 15", status: "Pending" },
    { id: 3, client: "Marcus T.", email: "m.t@crescent.com", property: "Sky Villa 43, Dubai", dispatched: "Jul 14", status: "Dispatched" },
    { id: 4, client: "Sofia L.", email: "s.l@elitegroup.io", property: "Park Ave Triplex, NYC", dispatched: "Jul 14", status: "Confirmed" },
    { id: 5, client: "Dmitri P.", email: "d.p@volkov.capital", property: "Hillside Mansion, LA", dispatched: "Jul 13", status: "Pending" },
    { id: 6, client: "Elena G.", email: "e.g@mediterranean.re", property: "Coastal Villa, Mykonos", dispatched: "Jul 13", status: "Dispatched" },
    { id: 7, client: "Nathan W.", email: "nw@westbrook.com", property: "Central Tower 22, NYC", dispatched: "Jul 12", status: "Confirmed" },
];

const METRICS = [
    { label: "Total Dispatches", value: "2,847", growth: "+12.4%", positive: true },
    { label: "Confirmed", value: "1,843", growth: "+8.1%", positive: true },
    { label: "Pending", value: "712", growth: "-2.3%", positive: false },
    { label: "Delivery Rate", value: "94.8%", growth: "+4.7%", positive: true },
];

export default function DashboardPage() {
    // --- THEME STATE (Light / Dark) ---
    const [theme, setTheme] = useState("dark");
    const [activeTab, setActiveTab] = useState("Overview");
    const [filterStatus, setFilterStatus] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    const isDark = theme === "dark";

    // --- THEME COLORS (Conditional) ---
    const bgBase = isDark ? "bg-neutral-950" : "bg-stone-50";
    const bgSurface = isDark ? "bg-neutral-900/60" : "bg-white/60";
    const bgCard = isDark ? "bg-neutral-900" : "bg-white";
    const borderColor = isDark ? "border-neutral-800" : "border-stone-200";
    const textPrimary = isDark ? "text-white" : "text-neutral-900";
    const textSecondary = isDark ? "text-neutral-400" : "text-stone-500";
    const textMuted = isDark ? "text-neutral-600" : "text-stone-400";
    const hoverBg = isDark ? "hover:bg-neutral-800" : "hover:bg-stone-100";

    // Filter Logic
    const filteredLeads = INITIAL_LEADS.filter((item) => {
        const matchesStatus = filterStatus === "All" || item.status === filterStatus;
        const matchesSearch =
            item.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.email.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    // --- STATUS BADGE (Ultra Minimal) ---
    const StatusBadge = ({ status }) => {
        const base = `px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest border rounded-md transition-colors`;
        if (status === "Confirmed") {
            return <span className={`${base} ${isDark ? 'bg-emerald-950/30 text-emerald-300 border-emerald-800' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>Confirmed</span>;
        } else if (status === "Pending") {
            return <span className={`${base} ${isDark ? 'bg-amber-950/30 text-amber-300 border-amber-800' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>Pending</span>;
        } else {
            return <span className={`${base} ${isDark ? 'bg-blue-950/30 text-blue-300 border-blue-800' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>Dispatched</span>;
        }
    };

    const toggleTheme = () => setTheme(isDark ? "light" : "dark");

    return (
        <div className={`min-h-screen ${bgBase} ${textPrimary} font-sans antialiased transition-colors duration-500 ease-in-out`}>
            <div className="max-w-6xl mx-auto px-6 py-8 md:py-12">

                {/* --- 1. HEADER: The Premium Pill --- */}
                <div className={`flex items-center justify-between p-2 ${bgSurface} backdrop-blur-md border ${borderColor} rounded-full shadow-sm transition-all duration-500`}>
                    {/* Left: Brand */}
                    <div className="flex items-center gap-3 pl-4">
                        <div className={`w-7 h-7 rounded-md border ${borderColor} flex items-center justify-center font-bold text-sm ${textPrimary}`}>
                            Q
                        </div>
                        <span className="font-bold tracking-tight text-sm">QORVX</span>
                        <span className={`${textMuted} text-[8px] uppercase tracking-widest hidden sm:block`}>Studio</span>
                    </div>

                    {/* Center: Tabs */}
                    <div className="hidden md:flex items-center gap-1">
                        {["Overview", "Leads", "Analytics"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-300 ${activeTab === tab
                                        ? `${isDark ? 'bg-white text-black' : 'bg-black text-white'} shadow-sm`
                                        : `${textSecondary} ${hoverBg}`
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Right: Theme Toggle + Profile */}
                    <div className="flex items-center gap-2 pr-2">
                        <button
                            onClick={toggleTheme}
                            className={`p-2 rounded-full border ${borderColor} ${hoverBg} transition-all duration-300`}
                        >
                            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </button>
                        <div className={`w-7 h-7 rounded-full border ${borderColor} flex items-center justify-center text-[10px] font-bold`}>
                            JD
                        </div>
                    </div>
                </div>

                {/* --- 2. METRICS DECK: Massive Numbers --- */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
                    {METRICS.map((metric, idx) => (
                        <div
                            key={idx}
                            className={`${bgCard} border ${borderColor} rounded-2xl p-6 transition-all duration-300 ${hoverBg}`}
                        >
                            <div className="flex items-center justify-between">
                                <span className={`${textSecondary} text-[10px] font-bold uppercase tracking-widest`}>
                                    {metric.label}
                                </span>
                                <span className={`text-[10px] font-bold flex items-center gap-0.5 ${metric.positive ? 'text-emerald-500' : 'text-rose-500'}`}>
                                    {metric.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                    {metric.growth}
                                </span>
                            </div>
                            <div className={`text-4xl md:text-5xl font-bold tracking-tight mt-1.5 ${textPrimary}`}>
                                {metric.value}
                            </div>
                        </div>
                    ))}
                </div>

                {/* --- 3. FILTER CONSOLE: Crisp & Clean --- */}
                <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-8 p-4 ${bgCard} border ${borderColor} rounded-xl transition-all duration-300`}>
                    <div className="relative w-full sm:w-72">
                        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${textMuted}`} />
                        <input
                            type="text"
                            placeholder="Search clients or properties..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`w-full bg-transparent pl-9 pr-4 py-2 text-sm border-b ${borderColor} ${textPrimary} placeholder:${textMuted} focus:outline-none focus:border-blue-500 transition-colors`}
                        />
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        {["All", "Confirmed", "Pending", "Dispatched"].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-md border transition-all duration-200 ${filterStatus === status
                                        ? `${isDark ? 'bg-white text-black border-white' : 'bg-black text-white border-black'}`
                                        : `${borderColor} ${textSecondary} ${hoverBg}`
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* --- 4. THE LEDGER: Architectural Table --- */}
                <div className={`mt-8 border ${borderColor} rounded-2xl overflow-hidden transition-all duration-500`}>
                    {/* Table Header */}
                    <div className={`grid grid-cols-5 gap-4 px-6 py-3 ${isDark ? 'bg-neutral-900/50' : 'bg-stone-100/50'} border-b ${borderColor}`}>
                        <div className="col-span-1 text-[10px] font-bold uppercase tracking-widest text-stone-400">Client</div>
                        <div className="col-span-1 text-[10px] font-bold uppercase tracking-widest text-stone-400 hidden md:block">Email</div>
                        <div className="col-span-1 text-[10px] font-bold uppercase tracking-widest text-stone-400">Property</div>
                        <div className="col-span-1 text-[10px] font-bold uppercase tracking-widest text-stone-400 hidden sm:block">Date</div>
                        <div className="col-span-1 text-[10px] font-bold uppercase tracking-widest text-stone-400 text-right">Status</div>
                    </div>

                    {/* Table Body */}
                    <div className="divide-y divide-neutral-800/10 dark:divide-neutral-800/50">
                        {filteredLeads.map((lead, idx) => (
                            <div
                                key={lead.id}
                                className={`grid grid-cols-5 gap-4 px-6 py-4 ${hoverBg} transition-colors duration-150`}
                            >
                                <div className="col-span-1 flex items-center gap-3">
                                    <div className={`w-6 h-6 rounded-full border ${borderColor} flex items-center justify-center text-[8px] font-bold ${textSecondary}`}>
                                        {lead.client.charAt(0)}
                                    </div>
                                    <span className="font-medium text-sm">{lead.client}</span>
                                </div>
                                <div className="col-span-1 flex items-center text-sm font-mono text-stone-400 dark:text-neutral-500 hidden md:flex truncate">
                                    {lead.email}
                                </div>
                                <div className="col-span-1 flex items-center text-sm text-stone-600 dark:text-neutral-300 truncate">
                                    {lead.property}
                                </div>
                                <div className="col-span-1 flex items-center text-xs text-stone-400 dark:text-neutral-600 hidden sm:flex">
                                    {lead.dispatched}
                                </div>
                                <div className="col-span-1 flex items-center justify-end">
                                    <StatusBadge status={lead.status} />
                                </div>
                            </div>
                        ))}

                        {filteredLeads.length === 0 && (
                            <div className="px-6 py-12 text-center text-sm text-stone-400 dark:text-neutral-600">
                                No entries match your current filters.
                            </div>
                        )}
                    </div>

                    {/* Table Footer */}
                    <div className={`px-6 py-3 border-t ${borderColor} flex justify-between items-center ${isDark ? 'bg-neutral-900/30' : 'bg-stone-50/50'}`}>
                        <span className="text-[10px] uppercase tracking-widest text-stone-400 dark:text-neutral-600">
                            {filteredLeads.length} Entries • Live
                        </span>
                        <span className="text-[8px] uppercase tracking-widest text-stone-300 dark:text-neutral-700">
                            QORVX Core v3.2
                        </span>
                    </div>
                </div>

                {/* Status Line */}
                <div className="flex justify-end mt-4">
                    <span className={`text-[8px] uppercase tracking-widest ${textMuted} flex items-center gap-2`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-emerald-400' : 'bg-emerald-600'}`}></span>
                        System operational
                    </span>
                </div>
            </div>
        </div>
    );
}