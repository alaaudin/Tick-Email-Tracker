"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, useAnimation } from "framer-motion";
import {
    Search,
    Sun,
    Moon,
    TrendingUp,
    TrendingDown,
    ArrowUpRight,
    CheckCircle,
    Clock,
    Send,
    MoreHorizontal,
    Zap,
    User,
    Mail,
    Home,
    CalendarDays,
    Activity,
    Sparkles
} from "lucide-react";

// --- MOCK DATA (Extended) ---
const INITIAL_LEADS = [
    { id: 1, client: "Alexander V.", email: "a.v@harbor.cap", property: "Penthouse 7B, Manhattan", dispatched: "Jul 15", status: "Confirmed" },
    { id: 2, client: "Isabella R.", email: "ir@luxeinvest.co", property: "Beachfront Est. #12", dispatched: "Jul 15", status: "Pending" },
    { id: 3, client: "Marcus T.", email: "m.t@crescent.com", property: "Sky Villa 43, Dubai", dispatched: "Jul 14", status: "Dispatched" },
    { id: 4, client: "Sofia L.", email: "s.l@elitegroup.io", property: "Park Ave Triplex, NYC", dispatched: "Jul 14", status: "Confirmed" },
    { id: 5, client: "Dmitri P.", email: "d.p@volkov.capital", property: "Hillside Mansion, LA", dispatched: "Jul 13", status: "Pending" },
    { id: 6, client: "Elena G.", email: "e.g@mediterranean.re", property: "Coastal Villa, Mykonos", dispatched: "Jul 13", status: "Dispatched" },
    { id: 7, client: "Nathan W.", email: "nw@westbrook.com", property: "Central Tower 22, NYC", dispatched: "Jul 12", status: "Confirmed" },
    { id: 8, client: "Olivia M.", email: "olivia@prestige.ae", property: "Palm Jumeirah Villa", dispatched: "Jul 12", status: "Pending" },
];

const METRICS = [
    { label: "Total Dispatches", value: 2847, growth: "+12.4%", positive: true, icon: Send },
    { label: "Confirmed", value: 1843, growth: "+8.1%", positive: true, icon: CheckCircle },
    { label: "Pending", value: 712, growth: "-2.3%", positive: false, icon: Clock },
    { label: "Delivery Rate", value: 94.8, growth: "+4.7%", positive: true, icon: Activity, suffix: "%" },
];

// --- 3D TILT CARD WITH PEACEFUL ANIMATION ---
const TiltCard = ({ children, className = "", delay = 0 }) => {
    const ref = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const rotateX = useTransform(y, [-150, 150], [6, -6]);
    const rotateY = useTransform(x, [-150, 150], [-6, 6]);
    const springConfig = { damping: 25, stiffness: 200 };
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
            transition={{ delay, duration: 0.7, type: "spring", stiffness: 80 }}
            className={`relative bg-slate-800/40 backdrop-blur-2xl border border-slate-700/40 shadow-[0_8px_32px_rgba(0,0,0,0.3)] rounded-2xl p-6 transition-all duration-300 hover:border-indigo-500/30 ${className}`}
        >
            {children}
        </motion.div>
    );
};

// --- COUNTER ANIMATION (LIVE NUMBER) ---
const AnimatedCounter = ({ value, suffix = "" }) => {
    const [count, setCount] = useState(0);
    const controls = useAnimation();

    useEffect(() => {
        let start = 0;
        const duration = 2000;
        const step = Math.max(1, Math.floor(value / 60));
        const interval = setInterval(() => {
            start += step;
            if (start >= value) {
                setCount(value);
                clearInterval(interval);
            } else {
                setCount(start);
            }
        }, duration / 60);
        return () => clearInterval(interval);
    }, [value]);

    return (
        <span className="text-4xl md:text-5xl font-bold tracking-tight text-white">
            {typeof count === 'number' ? count.toLocaleString() : count}{suffix}
        </span>
    );
};

// --- MAIN DASHBOARD ---
export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState("Overview");
    const [filterStatus, setFilterStatus] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [isHovering, setIsHovering] = useState(false);

    const filteredLeads = INITIAL_LEADS.filter((item) => {
        const matchesStatus = filterStatus === "All" || item.status === filterStatus;
        const matchesSearch =
            item.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.email.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    // --- STATUS BADGE (Breathing Glow) ---
    const StatusBadge = ({ status }) => {
        const base = "px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full border flex items-center gap-1.5";

        if (status === "Confirmed") {
            return (
                <span className={`${base} bg-emerald-500/10 text-emerald-300 border-emerald-500/30`}>
                    <span className="relative w-1.5 h-1.5">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
                    </span>
                    Confirmed
                </span>
            );
        } else if (status === "Pending") {
            return (
                <span className={`${base} bg-amber-500/10 text-amber-300 border-amber-500/30`}>
                    <span className="relative w-1.5 h-1.5">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75 animate-pulse"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-400"></span>
                    </span>
                    Pending
                </span>
            );
        } else {
            return (
                <span className={`${base} bg-blue-500/10 text-blue-300 border-blue-500/30`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                    Dispatched
                </span>
            );
        }
    };

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 overflow-x-hidden font-sans antialiased selection:bg-indigo-500/30 p-6 md:p-8">

            {/* --- PEACEFUL ANIMATED BACKGROUND (Soft Nebula) --- */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        x: ["0%", "10%", "-5%", "0%"],
                        y: ["0%", "-10%", "5%", "0%"],
                        scale: [1, 1.1, 0.9, 1]
                    }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[-30%] left-[-20%] w-[70rem] h-[70rem] bg-indigo-600/10 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        x: ["0%", "-10%", "10%", "0%"],
                        y: ["0%", "10%", "-5%", "0%"],
                        scale: [1, 0.9, 1.1, 1]
                    }}
                    transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-[-30%] right-[-20%] w-[60rem] h-[60rem] bg-blue-600/10 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[40%] left-[40%] w-[30rem] h-[30rem] bg-purple-500/5 rounded-full blur-3xl"
                />
            </div>

            <div className="relative max-w-7xl mx-auto space-y-8">

                {/* --- 1. 3D FLOATING HEADER (Premium Pill) --- */}
                <motion.div
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
                    className="sticky top-4 z-50 w-full"
                >
                    <div className="bg-slate-800/50 backdrop-blur-2xl border border-slate-700/40 shadow-[0_20px_60px_rgba(0,0,0,0.5)] rounded-[2rem] px-4 py-2 flex flex-wrap items-center justify-between gap-4">

                        {/* Brand */}
                        <div className="flex items-center gap-3 pl-2">
                            <motion.div
                                whileHover={{ scale: 1.05, rotate: -3 }}
                                className="relative w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl shadow-[0_8px_24px_rgba(99,102,241,0.3)] flex items-center justify-center font-black text-white text-lg"
                            >
                                Q
                                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-800 shadow-[0_0_12px_rgba(52,211,153,0.4)]"></div>
                            </motion.div>
                            <div>
                                <span className="text-white font-bold tracking-tight text-lg">QORVX</span>
                                <span className="text-indigo-300/60 text-[8px] uppercase tracking-widest block -mt-0.5">Zenith Studio</span>
                            </div>
                        </div>

                        {/* Live Activity Pulse */}
                        <div className="hidden lg:flex items-center gap-4 bg-slate-900/50 px-4 py-1.5 rounded-full border border-slate-700/30">
                            <span className="text-[10px] text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <span className="relative w-2 h-2">
                                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                                </span>
                                Live
                            </span>
                            <div className="w-px h-4 bg-slate-700"></div>
                            <motion.div
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="flex items-center gap-1"
                            >
                                <Sparkles className="w-3 h-3 text-indigo-400" />
                                <span className="text-indigo-300 text-xs font-mono font-bold">12.4k</span>
                            </motion.div>
                        </div>

                        {/* Tabs */}
                        <div className="flex items-center gap-1 bg-slate-900/50 p-1 rounded-full shadow-[inset_0_2px_8px_rgba(0,0,0,0.4)]">
                            {["Overview", "Leads", "Analytics"].map((tab) => (
                                <motion.button
                                    key={tab}
                                    whileTap={{ scale: 0.92 }}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-5 py-1.5 text-sm font-semibold tracking-tight rounded-full transition-all duration-300 ${activeTab === tab
                                        ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-[0_4px_16px_rgba(99,102,241,0.4)]"
                                        : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                                        }`}
                                >
                                    {tab}
                                </motion.button>
                            ))}
                        </div>

                        {/* Profile */}
                        <div className="flex items-center gap-2 pr-2">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                className="p-2 rounded-full border border-slate-700/30 hover:bg-slate-700/30 transition-all"
                            >
                                <Sun className="w-4 h-4 text-slate-400" />
                            </motion.button>
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-blue-500 shadow-[0_4px_16px_rgba(99,102,241,0.3)] flex items-center justify-center text-white text-xs font-bold border border-white/10">
                                JD
                            </div>
                            <MoreHorizontal className="w-4 h-4 text-slate-500 cursor-pointer hover:text-white transition" />
                        </div>
                    </div>
                </motion.div>

                {/* --- 2. 3D TILT METRICS DECK (Peaceful Numbers) --- */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                    {METRICS.map((metric, idx) => (
                        <TiltCard key={idx} delay={idx * 0.08}>
                            <div className="flex items-start justify-between">
                                <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                                    <metric.icon className="w-4 h-4 text-indigo-400" />
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 px-2 py-0.5 rounded-full border ${metric.positive
                                    ? "text-emerald-300 border-emerald-500/20 bg-emerald-500/5"
                                    : "text-rose-300 border-rose-500/20 bg-rose-500/5"
                                    }`}>
                                    {metric.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                    {metric.growth}
                                </span>
                            </div>
                            <div className="mt-3" style={{ transform: "translateZ(30px)" }}>
                                <span className="text-slate-400 text-[10px] font-medium uppercase tracking-widest">{metric.label}</span>
                                <AnimatedCounter value={metric.value} suffix={metric.suffix || ""} />
                            </div>
                            {/* Gentle progress bar */}
                            <div className="mt-3 h-0.5 w-full bg-slate-700/50 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(100, (metric.value / 3000) * 100)}%` }}
                                    transition={{ delay: 0.6, duration: 1.5, ease: "easeOut" }}
                                    className="h-full bg-gradient-to-r from-indigo-500 to-blue-400 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.2)]"
                                />
                            </div>
                        </TiltCard>
                    ))}
                </div>

                {/* --- 3. FILTER CONSOLE (Glowing Search) --- */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-800/20 backdrop-blur-sm border border-slate-700/30 shadow-[0_4px_24px_rgba(0,0,0,0.2)] rounded-2xl"
                >
                    <div className="relative w-full sm:w-80 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search clients, properties, emails..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-900/60 text-white placeholder:text-slate-500 pl-10 pr-4 py-2.5 rounded-xl border border-slate-700/30 shadow-[inset_0_2px_8px_rgba(0,0,0,0.3)] focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 transition-all duration-300 text-sm"
                        />
                        <div className="absolute inset-0 rounded-xl bg-indigo-500/0 group-focus-within:bg-indigo-500/5 blur-xl -z-10 transition-all duration-500"></div>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-900/30 p-1 rounded-xl shadow-[inset_0_2px_8px_rgba(0,0,0,0.3)] flex-wrap">
                        {["All", "Confirmed", "Pending", "Dispatched"].map((status) => (
                            <motion.button
                                key={status}
                                whileTap={{ scale: 0.92 }}
                                onClick={() => setFilterStatus(status)}
                                className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all duration-300 border ${filterStatus === status
                                    ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white border-indigo-500/50 shadow-[0_4px_16px_rgba(99,102,241,0.3)]"
                                    : "text-slate-400 border-transparent hover:bg-slate-700/50 hover:text-white"
                                    }`}
                            >
                                {status}
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                {/* --- 4. 3D LEDGER (Staggered, Breathing Rows) --- */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="bg-slate-800/30 backdrop-blur-2xl border border-slate-700/40 shadow-[0_8px_32px_rgba(0,0,0,0.4)] rounded-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="grid grid-cols-5 gap-4 px-6 py-4 bg-slate-900/50 border-b border-slate-700/40">
                        <div className="col-span-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            <User className="w-3 h-3" /> Client
                        </div>
                        <div className="col-span-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 hidden md:flex items-center gap-2">
                            <Mail className="w-3 h-3" /> Email
                        </div>
                        <div className="col-span-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                            <Home className="w-3 h-3" /> Property
                        </div>
                        <div className="col-span-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 hidden sm:flex items-center gap-2">
                            <CalendarDays className="w-3 h-3" /> Date
                        </div>
                        <div className="col-span-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right flex items-center justify-end gap-2">
                            <Activity className="w-3 h-3" /> Status
                        </div>
                    </div>

                    {/* Body */}
                    <div className="divide-y divide-slate-700/30 max-h-[480px] overflow-y-auto custom-scroll">
                        {filteredLeads.map((lead, idx) => (
                            <motion.div
                                key={lead.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.03, duration: 0.4, ease: "easeOut" }}
                                className="grid grid-cols-5 gap-4 px-6 py-4 transition-all duration-200 hover:bg-slate-700/20 hover:border-l-2 hover:border-l-indigo-500 border-b border-slate-700/20 last:border-b-0 group"
                            >
                                <div className="col-span-1 flex items-center gap-3">
                                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-[9px] font-bold text-white shadow-inner group-hover:shadow-indigo-500/20 transition">
                                        {lead.client.charAt(0)}
                                    </div>
                                    <span className="text-white font-medium text-sm truncate">{lead.client}</span>
                                </div>
                                <div className="col-span-1 flex items-center text-slate-400 text-sm font-mono tracking-tight hidden md:flex truncate">
                                    {lead.email}
                                </div>
                                <div className="col-span-1 flex items-center text-slate-300 text-sm truncate">
                                    <ArrowUpRight className="w-3 h-3 text-indigo-400 mr-1.5 flex-shrink-0" />
                                    {lead.property}
                                </div>
                                <div className="col-span-1 flex items-center text-slate-500 text-xs font-medium hidden sm:flex">
                                    {lead.dispatched}
                                </div>
                                <div className="col-span-1 flex items-center justify-end">
                                    <StatusBadge status={lead.status} />
                                </div>
                            </motion.div>
                        ))}
                        {filteredLeads.length === 0 && (
                            <div className="px-6 py-16 text-center text-slate-400 text-sm">
                                No records match your criteria.
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-3 bg-slate-900/40 border-t border-slate-700/30 shadow-[inset_0_8px_20px_rgba(0,0,0,0.2)] flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] uppercase tracking-widest text-slate-400">
                                <span className="text-white font-bold">{filteredLeads.length}</span> Entries
                            </span>
                            <div className="w-16 h-0.5 bg-slate-700/50 rounded-full">
                                <div className="w-3/4 h-full bg-gradient-to-r from-indigo-500 to-blue-400 rounded-full"></div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-[8px] uppercase tracking-widest text-slate-500">QORVX • Zenith</span>
                            <Zap className="w-3 h-3 text-indigo-400" />
                        </div>
                    </div>
                </motion.div>

                {/* System Status */}
                <div className="flex justify-end mt-2">
                    <motion.div
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="text-[10px] uppercase tracking-widest text-slate-500 flex items-center gap-3"
                    >
                        <span className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.4)]"></span>
                            All systems nominal
                        </span>
                        <span className="w-px h-3 bg-slate-700"></span>
                        <span className="font-mono">v3.2.1</span>
                    </motion.div>
                </div>
            </div>

            {/* Custom Scroll */}
            <style jsx>{`
        .custom-scroll::-webkit-scrollbar { width: 3px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: #6366f1; }
      `}</style>
        </div>
    );
}