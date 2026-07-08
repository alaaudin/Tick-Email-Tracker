'use client';

import React, { useState, useEffect, useMemo } from 'react';

// ─────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────
const LEDGER_DATA = [
    { id: 'TX-8841', name: 'Elon Musk', email: 'elon.musk@x.com', status: 'Confirmed', time: '2m ago', value: '$12,400' },
    { id: 'TX-8842', name: 'Sundar Pichai', email: 'sundar.pichai@google.com', status: 'Pending', time: '14m ago', value: '$8,200' },
    { id: 'TX-8843', name: 'Satya Nadella', email: 'satya.nadella@microsoft.com', status: 'Confirmed', time: '32m ago', value: '$24,000' },
    { id: 'TX-8844', name: 'Tim Cook', email: 'tim.cook@apple.com', status: 'Confirmed', time: '1h ago', value: '$15,600' },
    { id: 'TX-8845', name: 'Jensen Huang', email: 'jensen.huang@nvidia.com', status: 'Pending', time: '2h ago', value: '$31,200' },
    { id: 'TX-8846', name: 'Jeff Bezos', email: 'jeff.bezos@amazon.com', status: 'Bounced', time: '3h ago', value: '$5,000' },
    { id: 'TX-8847', name: 'Mark Zuckerberg', email: 'mark.zuckerberg@meta.com', status: 'Confirmed', time: '4h ago', value: '$9,800' },
    { id: 'TX-8848', name: 'Larry Ellison', email: 'larry.ellison@oracle.com', status: 'Pending', time: '5h ago', value: '$18,500' },
    { id: 'TX-8849', name: 'Tim Berners-Lee', email: 'tim@w3.org', status: 'Confirmed', time: '6h ago', value: '$2,400' },
    { id: 'TX-8850', name: 'Linus Torvalds', email: 'linus@linux.org', status: 'Confirmed', time: '7h ago', value: '$7,100' },
];

const FILTER_TABS = ['All', 'Confirmed', 'Pending'];

// ─────────────────────────────────────────────────────────────
// THEME CONFIG
// ─────────────────────────────────────────────────────────────
const THEMES = {
    light: {
        bg: 'bg-[#faf9f7]',
        text: 'text-[#1c1c1c]',
        muted: 'text-[#8c8c8c]',
        border: 'border-[#e8e8e8]',
        surface: 'bg-white',
        hover: 'hover:bg-[#f0f0f0]',
        input: 'bg-[#f5f5f5]',
        badge: {
            Confirmed: 'text-emerald-700',
            Pending: 'text-amber-700',
            Bounced: 'text-rose-700',
        },
        dot: {
            Confirmed: 'bg-emerald-600',
            Pending: 'bg-amber-500',
            Bounced: 'bg-rose-600',
        },
        activeTab: 'bg-[#1c1c1c] text-white',
        inactiveTab: 'text-[#8c8c8c] hover:text-[#1c1c1c]',
        tableHeader: 'text-[#8c8c8c]',
        rowHover: 'hover:bg-[#f5f5f5]',
        icon: 'text-[#1c1c1c]',
        clock: 'text-[#8c8c8c]',
    },
    dark: {
        bg: 'bg-[#0a0a0a]',
        text: 'text-[#f5f5f5]',
        muted: 'text-[#666666]',
        border: 'border-[#1f1f1f]',
        surface: 'bg-[#111111]',
        hover: 'hover:bg-[#1a1a1a]',
        input: 'bg-[#111111]',
        badge: {
            Confirmed: 'text-emerald-400',
            Pending: 'text-amber-400',
            Bounced: 'text-rose-400',
        },
        dot: {
            Confirmed: 'bg-emerald-500',
            Pending: 'bg-amber-500',
            Bounced: 'bg-rose-500',
        },
        activeTab: 'bg-[#f5f5f5] text-[#0a0a0a]',
        inactiveTab: 'text-[#666666] hover:text-[#f5f5f5]',
        tableHeader: 'text-[#666666]',
        rowHover: 'hover:bg-[#111111]',
        icon: 'text-[#f5f5f5]',
        clock: 'text-[#666666]',
    },
};

// ─────────────────────────────────────────────────────────────
// LIVE CLOCK
// ─────────────────────────────────────────────────────────────
function LiveClock({ theme }) {
    const [time, setTime] = useState('');
    useEffect(() => {
        const update = () => setTime(new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, []);
    return <span className={`font-mono text-[11px] tracking-widest ${theme.clock}`}>{time}</span>;
}

// ─────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────
export default function UltraMinimalist() {
    const [theme, setTheme] = useState('light');
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [mounted, setMounted] = useState(false);

    const t = THEMES[theme];

    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 50);
        return () => clearTimeout(timer);
    }, []);

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

    const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

    return (
        <div className={`min-h-screen ${t.bg} ${t.text} transition-colors duration-700 ease-out selection:bg-neutral-400/30 font-sans`}>
            <style>{`
        @keyframes reveal {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .reveal {
          opacity: 0;
          animation: reveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

            <div className="max-w-5xl mx-auto px-6 md:px-12">
                {/* ═══════════════════════════════════════════════ */}
                {/* HEADER                                          */}
                {/* ═══════════════════════════════════════════════ */}
                <header className={`flex items-center justify-between py-10 border-b ${t.border} transition-colors duration-700 ${mounted ? 'reveal' : ''}`}>
                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-[1px] ${theme === 'light' ? 'bg-[#1c1c1c]' : 'bg-[#f5f5f5]'} transition-colors duration-700`} />
                        <span className="text-[11px] font-bold tracking-[0.3em] uppercase">Nexus</span>
                    </div>

                    <div className="flex items-center gap-8">
                        <LiveClock theme={t} />
                        <button
                            onClick={toggleTheme}
                            className={`w-10 h-10 rounded-full border ${t.border} flex items-center justify-center transition-all duration-300 ${t.hover}`}
                            aria-label="Toggle theme"
                        >
                            {theme === 'light' ? (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                                </svg>
                            )}
                        </button>
                    </div>
                </header>

                {/* ═══════════════════════════════════════════════ */}
                {/* HERO METRICS                                    */}
                {/* ═══════════════════════════════════════════════ */}
                <section className={`pt-20 pb-16 ${mounted ? 'reveal' : ''}`} style={{ animationDelay: '0.1s' }}>
                    <p className={`text-[10px] font-bold tracking-[0.25em] uppercase mb-6 ${t.muted} transition-colors duration-700`}>
                        Total Dispatches
                    </p>
                    <h1 className="text-7xl md:text-9xl font-light tracking-tighter leading-none tabular-nums">
                        2,847
                    </h1>
                </section>

                <section className={`grid grid-cols-1 md:grid-cols-3 gap-12 pb-20 border-b ${t.border} transition-colors duration-700 ${mounted ? 'reveal' : ''}`} style={{ animationDelay: '0.2s' }}>
                    {[
                        { label: 'Confirmed', value: '2,412', sub: '+12.4% from last week' },
                        { label: 'Pending', value: '312', sub: 'In transit' },
                        { label: 'Delivery Rate', value: '94.2%', sub: 'Industry standard' },
                    ].map((m) => (
                        <div key={m.label} className="group cursor-default">
                            <p className={`text-[10px] font-bold tracking-[0.25em] uppercase mb-3 ${t.muted} transition-colors duration-700`}>{m.label}</p>
                            <p className="text-3xl font-light tracking-tight tabular-nums mb-1">{m.value}</p>
                            <p className={`text-[11px] ${t.muted} transition-colors duration-700`}>{m.sub}</p>
                        </div>
                    ))}
                </section>

                {/* ═══════════════════════════════════════════════ */}
                {/* FILTER CONSOLE                                  */}
                {/* ═══════════════════════════════════════════════ */}
                <section className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 py-12 ${mounted ? 'reveal' : ''}`} style={{ animationDelay: '0.3s' }}>
                    <div className="relative w-full sm:w-80">
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`w-full py-3 px-0 text-sm ${t.text} ${t.input} border-b ${t.border} bg-transparent focus:outline-none focus:border-neutral-500 transition-all duration-500 placeholder:${t.muted} placeholder:opacity-50`}
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className={`absolute right-0 top-3 text-[10px] font-bold uppercase tracking-widest ${t.muted} hover:${t.text} transition-colors`}
                            >
                                Clear
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-1">
                        {FILTER_TABS.map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilterStatus(f)}
                                className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${filterStatus === f ? t.activeTab : t.inactiveTab
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════ */}
                {/* LEDGER TABLE                                    */}
                {/* ═══════════════════════════════════════════════ */}
                <section className={`pb-24 ${mounted ? 'reveal' : ''}`} style={{ animationDelay: '0.4s' }}>
                    {/* Table Header */}
                    <div className={`grid grid-cols-12 gap-4 py-4 border-b ${t.border} transition-colors duration-700`}>
                        <div className={`col-span-2 text-[10px] font-bold uppercase tracking-[0.2em] ${t.tableHeader} transition-colors duration-700`}>ID</div>
                        <div className={`col-span-3 text-[10px] font-bold uppercase tracking-[0.2em] ${t.tableHeader} transition-colors duration-700`}>Name</div>
                        <div className={`col-span-3 hidden md:block text-[10px] font-bold uppercase tracking-[0.2em] ${t.tableHeader} transition-colors duration-700`}>Email</div>
                        <div className={`col-span-2 text-[10px] font-bold uppercase tracking-[0.2em] ${t.tableHeader} transition-colors duration-700`}>Status</div>
                        <div className={`col-span-2 text-right text-[10px] font-bold uppercase tracking-[0.2em] ${t.tableHeader} transition-colors duration-700`}>Time</div>
                        <div className={`col-span-1 text-right hidden sm:block text-[10px] font-bold uppercase tracking-[0.2em] ${t.tableHeader} transition-colors duration-700`}>Value</div>
                    </div>

                    {/* Rows */}
                    <div>
                        {filteredData.length > 0 ? (
                            filteredData.map((item, i) => (
                                <div
                                    key={item.id}
                                    className={`grid grid-cols-12 gap-4 py-5 border-b ${t.border} items-center ${t.rowHover} transition-all duration-300 cursor-pointer group`}
                                    style={{ animationDelay: `${0.5 + i * 0.03}s` }}
                                >
                                    <div className="col-span-2">
                                        <span className={`text-[11px] font-mono tracking-wider ${t.muted} group-hover:${t.text} transition-colors duration-300`}>
                                            {item.id}
                                        </span>
                                    </div>
                                    <div className="col-span-3">
                                        <span className="text-sm font-medium tracking-tight">{item.name}</span>
                                    </div>
                                    <div className={`col-span-3 hidden md:block text-[11px] font-mono ${t.muted} transition-colors duration-700`}>
                                        {item.email}
                                    </div>
                                    <div className="col-span-2 flex items-center gap-2">
                                        <span className={`w-1.5 h-1.5 rounded-full ${t.dot[item.status]} ${item.status === 'Pending' ? 'animate-pulse' : ''}`} />
                                        <span className={`text-[11px] font-medium ${t.badge[item.status]} transition-colors duration-700`}>
                                            {item.status}
                                        </span>
                                    </div>
                                    <div className={`col-span-2 text-right text-[11px] font-mono ${t.muted} transition-colors duration-700`}>
                                        {item.time}
                                    </div>
                                    <div className={`col-span-1 text-right hidden sm:block text-[11px] font-mono font-medium tabular-nums`}>
                                        {item.value}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className={`py-16 text-center text-[11px] ${t.muted} tracking-widest uppercase transition-colors duration-700`}>
                                No records found
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className={`flex items-center justify-between pt-8 text-[10px] ${t.muted} uppercase tracking-[0.2em] font-bold transition-colors duration-700`}>
                        <span>{filteredData.length} records</span>
                        <span>Updated just now</span>
                    </div>
                </section>
            </div>
        </div>
    );
}