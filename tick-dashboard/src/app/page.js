"use client";

import { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
    Search,
    TrendingUp,
    TrendingDown,
    Activity,
    Zap,
    ArrowUpRight,
    CheckCircle,
    Clock,
    Send,
    MoreHorizontal,
} from "lucide-react";

// --- EXTENDED MOCK DATA (10 Premium Leads) ---
const INITIAL_LEADS = [
    { id: 1, client: "Alexander V.", email: "a.v@harbor.cap", property: "Penthouse 7B, Manhattan", dispatched: "2025-07-15", status: "Confirmed" },
    { id: 2, client: "Isabella R.", email: "ir@luxeinvest.co", property: "Beachfront Est. #12, Malibu", dispatched: "2025-07-15", status: "Pending" },
    { id: 3, client: "Marcus T.", email: "m.t@crescent.com", property: "Sky Villa 43, Dubai", dispatched: "2025-07-14", status: "Dispatched" },
    { id: 4, client: "Sofia L.", email: "s.l@elitegroup.io", property: "Park Ave Triplex, NYC", dispatched: "2025-07-14", status: "Confirmed" },
    { id: 5, client: "Dmitri P.", email: "d.p@volkov.capital", property: "Hillside Mansion, LA", dispatched: "2025-07-13", status: "Pending" },
    { id: 6, client: "Elena G.", email: "e.g@mediterranean.re", property: "Coastal Villa, Mykonos", dispatched: "2025-07-13", status: "Dispatched" },
    { id: 7, client: "Nathan W.", email: "nw@westbrook.com", property: "Central Tower 22, NYC", dispatched: "2025-07-12", status: "Confirmed" },
    { id: 8, client: "Olivia M.", email: "olivia@prestige.ae", property: "Palm Jumeirah Villa", dispatched: "2025-07-12", status: "Pending" },
    { id: 9, client: "James K.", email: "jk@silverlake.re", property: "Silver Lake Estate, LA", dispatched: "2025-07-11", status: "Confirmed" },
    { id: 10, client: "Anya S.", email: "anya@nordic.capital", property: "Fjord Cabin, Norway", dispatched: "2025-07-11", status: "Dispatched" },
];

// --- METRICS WITH ICONS & DYNAMIC GROWTH ---
const METRICS = [
    { label: "Total Dispatches", value: "2,847", growth: "+12.4%", positive: true, icon: Send },
    { label: "Confirmed", value: "1,843", growth: "+8.1%", positive: true, icon: CheckCircle },
    { label: "Pending", value: "712", growth: "-2.3%", positive: false, icon: Clock },
    { label: "Delivery Rate", value: "94.8%", growth: "+4.7%", positive: true, icon: Activity },
];

// --- 3D TILT CARD COMPONENT (Physics-Driven) ---
const TiltMetricCard = ({ metric, index }) => {
    const ref = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const rotateX = useTransform(y, [-100, 100], [8, -8]);
    const rotateY = useTransform(x, [-100, 100], [-8, 8]);
    const springConfig = { damping: 15, stiffness: 150 };
    const springRotateX = useSpring(rotateX, springConfig);
    const springRotateY = useSpring(rotateY, springConfig);

    const handleMouseMove = (e) => {
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        x.set(e.clientX - centerX);
        y.set(e.clientY - centerY);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const Icon = metric.icon;

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX: springRotateX,
                rotateY: springRotateY,
                transformStyle: "preserve-3d",
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6, type: "spring", stiffness: 100 }}
            className="relative bg-slate-800/40 backdrop-blur-2xl border-t border-l border-white/10 shadow-[8px_8px_24px_rgba(0,0,0,0.6),_-8px_-8px_24px_rgba(255,255,255,0.02)] rounded-2xl p-6 transition-all hover:border-blue-500/30 group"
        >
            {/* Glow effect on hover */}
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-blue-600/0 via-blue-600/0 to-cyan-400/0 group-hover:from-blue-600/10 group-hover:via-cyan-400/10 group-hover:to-transparent transition-all duration-700 blur-xl -z-10"></div>

            <div className="flex justify-between items-start">
                <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20 shadow-[inset_0_0_12px_rgba(37,99,235,0.2)]">
                    <Icon className="w-5 h-5 text-blue-400" />
                </div>
                <span
                    className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] border flex items-center gap-1 ${metric.positive
                        ? "bg-emerald-900/40 text-emerald-300 border-emerald-500/30"
                        : "bg-rose-900/40 text-rose-300 border-rose-500/30"
                        }`}
                >
                    {metric.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {metric.growth}
                </span>
            </div>

            <div className="mt-3" style={{ transform: "translateZ(40px)" }}>
                <span className="text-zinc-400 text-xs font-medium uppercase tracking-widest">{metric.label}</span>
                <div className="text-4xl font-bold tracking-tight text-white drop-shadow-lg bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
                    {metric.value}
                </div>
            </div>

            {/* 3D Progress Glow */}
            <div className="mt-4 h-1.5 w-full bg-slate-700/50 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, index * 20 + 40)}%` }}
                    transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.5)]"
                />
            </div>
        </motion.div>
    );
};

// --- MAIN DASHBOARD ---
export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState("Overview");
    const [filterStatus, setFilterStatus] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    // Filter Logic
    const filteredLeads = INITIAL_LEADS.filter((item) => {
        const matchesStatus = filterStatus === "All" || item.status === filterStatus;
        const matchesSearch =
            item.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.email.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    // Status Badge Component (with Glow)
    const StatusBadge = ({ status }) => {
        const base =
            "px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full border shadow-[2px_2px_8px_rgba(0,0,0,0.4),inset_-2px_-2px_4px_rgba(255,255,255,0.05)] flex items-center gap-1.5";

        switch (status) {
            case "Confirmed":
                return (
                    <span className={`${base} bg-emerald-900/60 text-emerald-300 border-emerald-500/40 shadow-emerald-900/20`}>
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse"></span>
                        Confirmed
                    </span>
                );
            case "Pending":
                return (
                    <span className={`${base} bg-amber-900/60 text-amber-300 border-amber-500/40 shadow-amber-900/20`}>
                        <span className="w-1.5 h-1.5 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.8)] animate-pulse"></span>
                        Pending
                    </span>
                );
            default:
                return (
                    <span className={`${base} bg-blue-900/60 text-blue-300 border-blue-500/40 shadow-blue-900/20`}>
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full shadow-[0_0_8px_rgba(96,165,250,0.8)]"></span>
                        Dispatched
                    </span>
                );
        }
    };

    return (
        <div className="relative min-h-screen bg-slate-950 overflow-x-hidden font-sans antialiased selection:bg-blue-600/30 p-6 md:p-8">

            {/* --- EXTREME ANIMATED BACKGROUND (Nebula Orbs) --- */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <motion.div
                    initial={{ x: 0, y: 0 }}
                    animate={{ x: 100, y: 100 }}
                    transition={{ duration: 20, repeat: Infinity, repeatType: "mirror", ease: "linear" }}
                    className="absolute top-[-20%] left-[-10%] w-[50rem] h-[50rem] bg-blue-600/20 rounded-full blur-3xl"
                />
                <motion.div
                    initial={{ x: 0, y: 0 }}
                    animate={{ x: -80, y: 150 }}
                    transition={{ duration: 25, repeat: Infinity, repeatType: "mirror", ease: "linear" }}
                    className="absolute bottom-[-20%] right-[-10%] w-[40rem] h-[40rem] bg-purple-600/20 rounded-full blur-3xl"
                />
                <motion.div
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 10, repeat: Infinity, repeatType: "mirror" }}
                    className="absolute top-[50%] left-[50%] w-[30rem] h-[30rem] bg-cyan-500/10 rounded-full blur-3xl"
                />
            </div>

            <div className="relative max-w-7xl mx-auto space-y-8">

                {/* --- 1. FLOATING 3D HEADER WITH SPARKLINE --- */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, type: "spring", stiffness: 120 }}
                    className="sticky top-4 z-50 w-full"
                >
                    <div className="bg-slate-900/60 backdrop-blur-2xl border-t border-l border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.05)] rounded-[2.5rem] px-4 py-2 flex flex-wrap items-center justify-between gap-4">

                        {/* Branding */}
                        <div className="flex items-center gap-3 pl-2">
                            <div className="relative w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl shadow-[inset_0_-4px_0_rgba(0,0,0,0.3),0_8px_24px_rgba(37,99,235,0.5)] flex items-center justify-center font-black text-white text-lg">
                                Q
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900 shadow-[0_0_12px_rgba(52,211,153,0.6)]"></div>
                            </div>
                            <div>
                                <span className="text-white font-bold tracking-tight text-lg">QORVX</span>
                                <span className="text-zinc-500 text-[8px] uppercase tracking-widest block -mt-0.5">Spatial Titanium</span>
                            </div>
                        </div>

                        {/* Mini Sparkline (Live Activity) */}
                        <div className="hidden md:flex items-center gap-4 bg-slate-800/30 px-4 py-1.5 rounded-full border border-white/5">
                            <span className="text-[10px] text-zinc-400 uppercase tracking-widest flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
                                Live
                            </span>
                            <svg width="80" height="24" viewBox="0 0 80 24" fill="none">
                                <path d="M2 22 L10 14 L18 18 L26 8 L34 12 L42 4 L50 16 L58 10 L66 20 L74 14 L78 18" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_0_6px_rgba(59,130,246,0.5)]" />
                                <path d="M2 22 L10 14 L18 18 L26 8 L34 12 L42 4 L50 16 L58 10 L66 20 L74 14 L78 18" stroke="url(#blueGradient)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.3" />
                                <defs>
                                    <linearGradient id="blueGradient" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
                                        <stop offset="100%" stopColor="#60a5fa" stopOpacity="1" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <span className="text-emerald-400 text-xs font-mono font-bold">+2.1%</span>
                        </div>

                        {/* Navigation Tabs */}
                        <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-full shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)]">
                            {["Overview", "Leads", "Analytics"].map((tab) => (
                                <motion.button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    whileTap={{ scale: 0.95 }}
                                    className={`px-5 py-1.5 text-sm font-semibold tracking-tight rounded-full transition-all duration-300 ${activeTab === tab
                                        ? "bg-blue-600 text-white shadow-[inset_0_-4px_0_rgba(0,0,0,0.3),0_4px_16px_rgba(37,99,235,0.6)]"
                                        : "text-zinc-400 hover:text-white hover:bg-slate-700/50"
                                        }`}
                                >
                                    {tab}
                                </motion.button>
                            ))}
                        </div>

                        {/* Profile */}
                        <div className="flex items-center gap-3 pr-2">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-[0_4px_16px_rgba(37,99,235,0.4)] flex items-center justify-center text-white text-xs font-bold border border-white/10 ring-2 ring-blue-500/20">
                                JD
                            </div>
                            <MoreHorizontal className="w-5 h-5 text-zinc-500 hover:text-white cursor-pointer transition" />
                        </div>
                    </div>
                </motion.div>

                {/* --- 2. THE ISOMETRIC TILT METRICS DECK --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {METRICS.map((metric, idx) => (
                        <TiltMetricCard key={idx} metric={metric} index={idx} />
                    ))}
                </div>

                {/* --- 3. DYNAMIC FILTER CONSOLE (Glowing Search) --- */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/20 backdrop-blur-sm border border-white/5 shadow-[6px_6px_20px_rgba(0,0,0,0.4)] rounded-2xl p-4"
                >
                    <div className="relative w-full sm:w-80 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search clients, properties, email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-900/80 text-white placeholder:text-zinc-600 pl-10 pr-4 py-2.5 rounded-xl border border-white/5 shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)] focus:outline-none focus:ring-2 focus:ring-blue-600/60 focus:border-transparent transition-all duration-300 text-sm"
                        />
                        <div className="absolute inset-0 rounded-xl bg-blue-600/0 group-focus-within:bg-blue-600/5 blur-xl -z-10 transition-all duration-500"></div>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-900/40 p-1 rounded-xl shadow-[inset_0_2px_8px_rgba(0,0,0,0.4)] flex-wrap">
                        {["All", "Confirmed", "Pending", "Dispatched"].map((status) => (
                            <motion.button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                whileTap={{ scale: 0.92 }}
                                className={`px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-lg transition-all duration-300 border ${filterStatus === status
                                    ? "bg-blue-600 text-white border-blue-700 shadow-[inset_0_-3px_0_rgba(0,0,0,0.3),0_4px_16px_rgba(37,99,235,0.4)]"
                                    : "text-zinc-400 border-transparent hover:bg-slate-700/50 hover:text-white"
                                    }`}
                            >
                                {status}
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                {/* --- 4. ENTERPRISE 3D LEDGER (Staggered Table) --- */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="bg-slate-800/30 backdrop-blur-2xl border-t border-l border-white/10 shadow-[8px_8px_32px_rgba(0,0,0,0.7),_-8px_-8px_32px_rgba(255,255,255,0.01)] rounded-2xl overflow-hidden"
                >
                    {/* Table Head */}
                    <div className="grid grid-cols-5 gap-4 px-6 py-4 bg-slate-900/60 border-b border-slate-700/50 shadow-[inset_0_-2px_0_rgba(255,255,255,0.02)]">
                        <div className="col-span-1 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Client</div>
                        <div className="col-span-1 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hidden md:block">Email</div>
                        <div className="col-span-1 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Property</div>
                        <div className="col-span-1 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hidden sm:block">Dispatched</div>
                        <div className="col-span-1 text-[10px] font-bold uppercase tracking-widest text-zinc-400 text-right">Status</div>
                    </div>

                    {/* Table Body with Staggered Animation */}
                    <div className="divide-y divide-slate-700/30 max-h-[420px] overflow-y-auto custom-scroll">
                        {filteredLeads.length > 0 ? (
                            filteredLeads.map((lead, idx) => (
                                <motion.div
                                    key={lead.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.04, duration: 0.4, ease: "easeOut" }}
                                    className="grid grid-cols-5 gap-4 px-6 py-4 transition-all duration-200 hover:bg-slate-700/30 hover:border-l-2 hover:border-l-blue-500 border-b border-slate-700/30 last:border-b-0"
                                >
                                    <div className="col-span-1 flex items-center">
                                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-[10px] font-bold text-white mr-3 shadow-inner">
                                            {lead.client.charAt(0)}
                                        </div>
                                        <span className="text-white font-semibold tracking-tight text-sm truncate">{lead.client}</span>
                                    </div>
                                    <div className="col-span-1 flex items-center text-zinc-400 text-sm font-mono tracking-tight hidden md:flex truncate">
                                        {lead.email}
                                    </div>
                                    <div className="col-span-1 flex items-center text-zinc-300 text-sm font-medium truncate">
                                        <ArrowUpRight className="w-3 h-3 text-blue-400 mr-1.5 flex-shrink-0" />
                                        {lead.property}
                                    </div>
                                    <div className="col-span-1 flex items-center text-zinc-500 text-xs font-medium hidden sm:flex">
                                        {lead.dispatched}
                                    </div>
                                    <div className="col-span-1 flex items-center justify-end">
                                        <StatusBadge status={lead.status} />
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="px-6 py-16 text-center">
                                <div className="text-zinc-600 text-sm font-medium tracking-tight">No intel matches the current filters.</div>
                            </div>
                        )}
                    </div>

                    {/* Table Footer */}
                    <div className="px-6 py-3 bg-slate-900/40 border-t border-white/5 shadow-[inset_0_8px_20px_rgba(0,0,0,0.3)] flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] uppercase tracking-widest text-zinc-500">
                                <span className="text-white font-bold">{filteredLeads.length}</span> Entries
                            </span>
                            <span className="text-[10px] uppercase tracking-widest text-zinc-600 hidden sm:inline">• Last updated 2s ago</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-20 h-1.5 bg-slate-700/50 rounded-full shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)]">
                                <div className="w-3/4 h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full shadow-[0_0_12px_rgba(37,99,235,0.3)]"></div>
                            </div>
                            <span className="text-[10px] text-zinc-500 font-mono">72%</span>
                        </div>
                    </div>
                </motion.div>

                {/* Micro Status */}
                <div className="flex justify-end mt-2">
                    <div className="text-[10px] uppercase tracking-widest text-zinc-600/50 flex items-center gap-3">
                        <span className="flex items-center gap-1">
                            <Zap className="w-3 h-3 text-blue-400" />
                            QORVX Core v3.2.1
                        </span>
                        <span className="w-1 h-1 bg-zinc-700 rounded-full"></span>
                        <span className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
                            All Systems Nominal
                        </span>
                    </div>
                </div>
            </div>

            {/* Custom Scrollbar Styling (Injected) */}
            <style jsx>{`
        .custom-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 10px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background: #3b82f6;
        }
      `}</style>
        </div>
    );
}