'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';

// ─────────────────────────────────────────────────────────────
// DATA
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

const STATUS_CONFIG = {
    Confirmed: { color: 'text-emerald-700', dot: 'bg-emerald-500', bg: 'bg-emerald-50' },
    Pending: { color: 'text-amber-700', dot: 'bg-amber-400', bg: 'bg-amber-50' },
    Bounced: { color: 'text-rose-700', dot: 'bg-rose-400', bg: 'bg-rose-50' },
};

// ─────────────────────────────────────────────────────────────
// HOOKS
// ─────────────────────────────────────────────────────────────

function useCountUp(target, duration = 2000) {
    const [val, setVal] = useState(0);
    useEffect(() => {
        const start = performance.now();
        const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            setVal(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }, [target, duration]);
    return val;
}

function useLiveClock() {
    const [time, setTime] = useState('');
    useEffect(() => {
        const fmt = () => setTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
        fmt();
        const id = setInterval(fmt, 1000);
        return () => clearInterval(id);
    }, []);
    return time;
}

// ─────────────────────────────────────────────────────────────
// 3D TILT CARD
// ─────────────────────────────────────────────────────────────
function TiltCard({ children, className = '', intensity = 8 }) {
    const ref = useRef(null);
    const [style, setStyle] = useState({});

    const handleMove = (e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        const cx = r.width / 2;
        const cy = r.height / 2;
        const rx = ((y - cy) / cy) * -intensity;
        const ry = ((x - cx) / cx) * intensity;
        setStyle({
            transform: `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02, 1.02, 1.02)`,
            transition: 'transform 0.1s ease-out',
        });
    };

    const handleLeave = () => {
        setStyle({
            transform: 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
            transition: 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
        });
    };

    return (
        <div
            ref={ref}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
            style={style}
            className={`transform-gpu will-change-transform ${className}`}
        >
            {children}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// SMOOTH SPARKLINE
// ─────────────────────────────────────────────────────────────
function Sparkline({ data, color = '#1a1a1a' }) {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const w = 120;
    const h = 40;
    const points = data.map((v, i) => {
        const x = (i / (data.length - 1)) * w;
        const y = h - ((v - min) / range) * (h - 8) - 4;
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg width={w} height={h} className="overflow-visible">
            <polyline
                points={points}
                fill="none"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.25"
            />
            <circle cx={w} cy={h - ((data[data.length - 1] - min) / range) * (h - 8) - 4} r="2.5" fill={color} opacity="0.6" />
        </svg>
    );
}

// ─────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────
export default function ZenDashboard() {
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');
    const [visible, setVisible] = useState(false);
    const [hoveredRow, setHoveredRow] = useState(null);
    const clock = useLiveClock();

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 100);
        return () => clearTimeout(t);
    }, []);

    const filtered = useMemo(() => {
        return LEDGER_DATA.filter((d) => {
            const f = filter === 'All' || d.status === filter;
            const s = !search || [d.name, d.email, d.id].some((x) => x.toLowerCase().includes(search.toLowerCase()));
            return f && s;
        });
    }, [filter, search]);

    const total = useCountUp(2847);
    const conf = useCountUp(2412);
    const pend = useCountUp(312);
    const rate = useCountUp(94);

    const metrics = [
        { label: 'Total Dispatches', value: total.toLocaleString(), sub: '+12.4% from last week', spark: [20, 28, 22, 35, 30, 42, 38, 50, 48, 55] },
        { label: 'Confirmed', value: conf.toLocaleString(), sub: '2,412 successful', spark: [15, 20, 18, 25, 22, 30, 28, 35, 32, 40] },
        { label: 'Pending', value: pend.toLocaleString(), sub: 'Awaiting delivery', spark: [5, 8, 6, 10, 8, 12, 10, 15, 12, 18] },
        { label: 'Delivery Rate', value: `${rate}%`, sub: 'Above benchmark', spark: [70, 72, 75, 78, 80, 82, 85, 88, 90, 94] },
    ];

    return (
        <div className="min-h-screen bg-[#faf8f5] text-[#1a1a1a] font-sans selection:bg-[#1a1a1a] selection:text-[#faf8f5] overflow-x-hidden">
            <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(40px, -30px) scale(1.05); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
        }
        @keyframes breathe {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        @keyframes rise {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes lineGrow {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        .anim-rise {
          opacity: 0;
          animation: rise 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .anim-delay-1 { animation-delay: 0.1s; }
        .anim-delay-2 { animation-delay: 0.2s; }
        .anim-delay-3 { animation-delay: 0.3s; }
        .anim-delay-4 { animation-delay: 0.4s; }
        .anim-delay-5 { animation-delay: 0.5s; }
        .anim-delay-6 { animation-delay: 0.6s; }
      `}</style>

            {/* ─── LIVING BACKGROUND ─── */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#f5e6d3] opacity-40 blur-[120px]" style={{ animation: 'float 20s ease-in-out infinite' }} />
                <div className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] rounded-full bg-[#e8ddd5] opacity-40 blur-[120px]" style={{ animation: 'float 25s ease-in-out infinite 5s' }} />
                <div className="absolute top-[40%] left-[60%] w-[400px] h-[400px] rounded-full bg-[#d4c4b5] opacity-30 blur-[100px]" style={{ animation: 'float 18s ease-in-out infinite 10s' }} />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-8 md:px-16">

                {/* ═══════════════════════════════════════════ */}
                {/* HEADER                                    */}
                {/* ═══════════════════════════════════════════ */}
                <header className={`flex items-center justify-between py-12 ${visible ? 'anim-rise' : ''}`}>
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-[1px] bg-[#1a1a1a]" />
                        <span className="text-[10px] font-bold tracking-[0.35em] uppercase text-[#8a8a8a]">Nexus</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <span className="font-mono text-[11px] text-[#8a8a8a] tracking-widest">{clock}</span>
                        <div className="w-8 h-8 rounded-full bg-[#1a1a1a] text-[#faf8f5] flex items-center justify-center text-[10px] font-bold">AC</div>
                    </div>
                </header>

                {/* ═══════════════════════════════════════════ */}
                {/* HERO                                      */}
                {/* ═══════════════════════════════════════════ */}
                <section className={`pt-8 pb-20 ${visible ? 'anim-rise anim-delay-1' : ''}`}>
                    <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#8a8a8a] mb-8">Overview</p>
                    <h1 className="text-7xl md:text-[10rem] font-extralight tracking-tighter leading-[0.85] tabular-nums text-[#1a1a1a]">
                        {total.toLocaleString()}
                    </h1>
                    <div className="flex items-center gap-4 mt-8">
                        <div className="h-px flex-1 bg-[#1a1a1a] origin-left" style={{ animation: visible ? 'lineGrow 1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.5s forwards' : 'none', transform: 'scaleX(0)' }} />
                        <p className="text-[11px] text-[#8a8a8a] tracking-wide font-medium">Total dispatches across all channels</p>
                    </div>
                </section>

                {/* ═══════════════════════════════════════════ */}
                {/* 3D METRICS                                */}
                {/* ═══════════════════════════════════════════ */}
                <section className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-20 ${visible ? 'anim-rise anim-delay-2' : ''}`}>
                    {metrics.map((m, i) => (
                        <TiltCard key={m.label} intensity={6}>
                            <div className="group relative bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.06)] transition-shadow duration-700 cursor-default overflow-hidden">
                                <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    <Sparkline data={m.spark} />
                                </div>
                                <p className="text-[9px] font-bold tracking-[0.25em] uppercase text-[#8a8a8a] mb-6">{m.label}</p>
                                <p className="text-4xl font-extralight tracking-tight tabular-nums mb-2">{m.value}</p>
                                <p className="text-[11px] text-[#8a8a8a] tracking-wide">{m.sub}</p>
                                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#1a1a1a]/10 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
                            </div>
                        </TiltCard>
                    ))}
                </section>

                {/* ═══════════════════════════════════════════ */}
                {/* DIVIDER                                   */}
                {/* ═══════════════════════════════════════════ */}
                <div className={`h-px bg-[#1a1a1a]/10 mb-16 ${visible ? 'anim-rise anim-delay-3' : ''}`} />

                {/* ═══════════════════════════════════════════ */}
                {/* FILTER CONSOLE                            */}
                {/* ═══════════════════════════════════════════ */}
                <section className={`flex flex-col sm:flex-row items-start sm:items-end justify-between gap-8 mb-12 ${visible ? 'anim-rise anim-delay-4' : ''}`}>
                    <div className="relative w-full sm:w-96 group">
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-transparent border-b border-[#1a1a1a]/15 py-3 pr-8 text-sm text-[#1a1a1a] placeholder:text-[#8a8a8a]/50 focus:outline-none focus:border-[#1a1a1a]/40 transition-colors duration-500"
                        />
                        <svg className="absolute right-0 top-3 w-4 h-4 text-[#8a8a8a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        {search && (
                            <button onClick={() => setSearch('')} className="absolute right-6 top-3 text-[9px] font-bold uppercase tracking-widest text-[#8a8a8a] hover:text-[#1a1a1a] transition-colors">
                                Clear
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-1">
                        {FILTER_TABS.map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-500 ${filter === f
                                        ? 'bg-[#1a1a1a] text-[#faf8f5] shadow-lg'
                                        : 'text-[#8a8a8a] hover:text-[#1a1a1a]'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </section>

                {/* ═══════════════════════════════════════════ */}
                {/* LEDGER                                    */}
                {/* ═══════════════════════════════════════════ */}
                <section className={`pb-24 ${visible ? 'anim-rise anim-delay-5' : ''}`}>
                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-4 py-4 border-b border-[#1a1a1a]/10">
                        {['ID', 'Recipient', 'Email', 'Status', 'Time', 'Value'].map((h, i) => (
                            <div
                                key={h}
                                className={`text-[9px] font-bold tracking-[0.2em] uppercase text-[#8a8a8a] ${i === 0 ? 'col-span-2' : i === 1 ? 'col-span-3' : i === 2 ? 'col-span-3 hidden md:block' : i === 3 ? 'col-span-2' : i === 4 ? 'col-span-2 text-right' : 'col-span-1 text-right hidden sm:block'}`}
                            >
                                {h}
                            </div>
                        ))}
                    </div>

                    {/* Rows */}
                    <div className="relative">
                        {filtered.map((item, i) => {
                            const cfg = STATUS_CONFIG[item.status];
                            const isHovered = hoveredRow === item.id;
                            return (
                                <div
                                    key={item.id}
                                    onMouseEnter={() => setHoveredRow(item.id)}
                                    onMouseLeave={() => setHoveredRow(null)}
                                    className="grid grid-cols-12 gap-4 py-5 border-b border-[#1a1a1a]/5 items-center cursor-pointer transition-all duration-500 relative group"
                                    style={{
                                        opacity: 0,
                                        animation: `rise 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.6 + i * 0.04}s forwards`,
                                    }}
                                >
                                    {/* Hover background */}
                                    <div className={`absolute inset-0 bg-[#f0ede8] rounded-xl transition-all duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />

                                    <div className="col-span-2 relative z-10">
                                        <span className="text-[10px] font-mono tracking-wider text-[#8a8a8a] group-hover:text-[#1a1a1a] transition-colors duration-300">
                                            {item.id}
                                        </span>
                                    </div>
                                    <div className="col-span-3 relative z-10">
                                        <span className="text-sm font-medium tracking-tight text-[#1a1a1a]">{item.name}</span>
                                    </div>
                                    <div className="col-span-3 hidden md:block relative z-10">
                                        <span className="text-[11px] font-mono text-[#8a8a8a]">{item.email}</span>
                                    </div>
                                    <div className="col-span-2 relative z-10 flex items-center gap-2">
                                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${item.status === 'Pending' ? 'animate-pulse' : ''}`} />
                                        <span className={`text-[10px] font-semibold tracking-wide ${cfg.color}`}>{item.status}</span>
                                    </div>
                                    <div className="col-span-2 relative z-10 text-right">
                                        <span className="text-[10px] font-mono text-[#8a8a8a] tracking-wide">{item.time}</span>
                                    </div>
                                    <div className="col-span-1 relative z-10 text-right hidden sm:block">
                                        <span className="text-[11px] font-mono font-medium tabular-nums text-[#1a1a1a]">{item.value}</span>
                                    </div>
                                </div>
                            );
                        })}

                        {filtered.length === 0 && (
                            <div className="py-20 text-center">
                                <p className="text-[11px] text-[#8a8a8a] tracking-widest uppercase">No records found</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-12 text-[9px] text-[#8a8a8a] uppercase tracking-[0.2em] font-bold">
                        <span>{filtered.length} of {LEDGER_DATA.length} records</span>
                        <span className="flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-emerald-500" />
                            Live
                        </span>
                    </div>
                </section>

            </div>
        </div>
    );
}