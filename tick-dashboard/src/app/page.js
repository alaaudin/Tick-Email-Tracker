import React from 'react';

// ─── MOCK DATA ─────────────────────────────────────────────
const DISPATCHES = [
    { id: 1, name: 'Elon Musk', email: 'elon@x.com', status: 'Confirmed', time: '2m ago', avatar: 'EM', color: 'bg-rose-400' },
    { id: 2, name: 'Sundar Pichai', email: 'sundar@google.com', status: 'Pending', time: '14m ago', avatar: 'SP', color: 'bg-amber-400' },
    { id: 3, name: 'Satya Nadella', email: 'satya@microsoft.com', status: 'Confirmed', time: '32m ago', avatar: 'SN', color: 'bg-sky-400' },
    { id: 4, name: 'Tim Cook', email: 'tim@apple.com', status: 'Bounced', time: '1h ago', avatar: 'TC', color: 'bg-emerald-400' },
    { id: 5, name: 'Jensen Huang', email: 'jensen@nvidia.com', status: 'Confirmed', time: '2h ago', avatar: 'JH', color: 'bg-violet-400' },
];

const STATUS_STYLES = {
    Confirmed: 'text-emerald-600 bg-emerald-100/50 border-emerald-200/50',
    Pending: 'text-amber-600 bg-amber-100/50 border-amber-200/50',
    Bounced: 'text-rose-600 bg-rose-100/50 border-rose-200/50',
};

// ─── WAVE DATA ─────────────────────────────────────────────
const WAVE_BARS = [
    { h: 40, opacity: 0.3, color: 'bg-rose-300' },
    { h: 65, opacity: 0.5, color: 'bg-fuchsia-300' },
    { h: 85, opacity: 0.7, color: 'bg-violet-300' },
    { h: 55, opacity: 0.5, color: 'bg-indigo-300' },
    { h: 95, opacity: 0.8, color: 'bg-sky-300' },
    { h: 70, opacity: 0.6, color: 'bg-teal-300' },
    { h: 45, opacity: 0.4, color: 'bg-emerald-300' },
    { h: 60, opacity: 0.5, color: 'bg-rose-300' },
    { h: 80, opacity: 0.7, color: 'bg-fuchsia-300' },
    { h: 50, opacity: 0.4, color: 'bg-violet-300' },
    { h: 75, opacity: 0.6, color: 'bg-indigo-300' },
    { h: 90, opacity: 0.8, color: 'bg-sky-300' },
    { h: 55, opacity: 0.5, color: 'bg-teal-300' },
    { h: 40, opacity: 0.3, color: 'bg-emerald-300' },
    { h: 70, opacity: 0.6, color: 'bg-rose-300' },
    { h: 85, opacity: 0.7, color: 'bg-fuchsia-300' },
    { h: 60, opacity: 0.5, color: 'bg-violet-300' },
    { h: 95, opacity: 0.8, color: 'bg-indigo-300' },
    { h: 50, opacity: 0.4, color: 'bg-sky-300' },
    { h: 75, opacity: 0.6, color: 'bg-teal-300' },
];

// ─── COMPONENTS ────────────────────────────────────────────

function GlassNav() {
    return (
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
            <div className="flex items-center gap-8 px-8 py-3 bg-white/40 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-full">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-400 flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-xs tracking-wider">T</span>
                    </div>
                    <span className="text-slate-800 font-bold text-lg tracking-tight">TICKK</span>
                </div>

                {/* Links */}
                <div className="hidden md:flex items-center gap-1">
                    {['Overview', 'Dispatches', 'Analytics'].map((link) => (
                        <a
                            key={link}
                            href="#"
                            className="px-4 py-2 rounded-full text-sm font-medium text-slate-500 hover:text-slate-800 hover:bg-white/50 transition-all duration-300"
                        >
                            {link}
                        </a>
                    ))}
                </div>

                {/* Profile */}
                <div className="flex items-center gap-3 pl-4 border-l border-white/50">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-semibold text-slate-700 leading-tight">Alex Chen</p>
                        <p className="text-[10px] text-slate-400 leading-tight">Admin</p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-300 to-amber-200 border-2 border-white/60 shadow-md flex items-center justify-center">
                        <span className="text-slate-700 text-xs font-bold">AC</span>
                    </div>
                </div>
            </div>
        </nav>
    );
}

function HeroMetrics() {
    return (
        <section className="pt-32 pb-12 px-6">
            <div className="max-w-5xl mx-auto">
                {/* Main Hero Card */}
                <div className="relative mb-8">
                    <div className="bg-white/40 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2.5rem] p-10 md:p-14 text-center relative overflow-hidden">
                        {/* Decorative blobs */}
                        <div className="absolute -top-20 -left-20 w-64 h-64 bg-rose-200/30 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-teal-200/30 rounded-full blur-3xl pointer-events-none" />

                        <p className="text-slate-500 text-sm font-medium tracking-widest uppercase mb-4 relative z-10">
                            Total Dispatches
                        </p>
                        <h1 className="text-6xl md:text-8xl font-black tracking-tight relative z-10">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 via-fuchsia-500 to-rose-500">
                                2,847
                            </span>
                        </h1>
                        <p className="text-slate-500 mt-4 text-base relative z-10 max-w-md mx-auto leading-relaxed">
                            Seamlessly orchestrated across 14 active channels with 99.9% delivery confidence.
                        </p>
                    </div>
                </div>

                {/* Floating Orbs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {[
                        { label: 'Confirmed', value: '2,412', sub: '+12% this week', icon: '✓', gradient: 'from-emerald-400 to-teal-300' },
                        { label: 'Pending', value: '312', sub: 'In transit', icon: '◷', gradient: 'from-amber-300 to-orange-200' },
                        { label: 'Hit Rate', value: '94.2%', sub: 'Industry leading', icon: '◉', gradient: 'from-violet-400 to-fuchsia-300' },
                    ].map((orb) => (
                        <div
                            key={orb.label}
                            className="group bg-white/40 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] p-6 flex items-center gap-5 hover:bg-white/60 hover:-translate-y-1 transition-all duration-300 cursor-default"
                        >
                            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${orb.gradient} flex items-center justify-center shadow-lg text-white text-lg`}>
                                {orb.icon}
                            </div>
                            <div>
                                <p className="text-slate-500 text-xs font-semibold tracking-wider uppercase mb-1">{orb.label}</p>
                                <p className="text-slate-800 text-2xl font-bold tracking-tight">{orb.value}</p>
                                <p className="text-slate-400 text-xs mt-0.5">{orb.sub}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function ActivityWave() {
    return (
        <section className="px-6 pb-12">
            <div className="max-w-5xl mx-auto">
                <div className="bg-white/40 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-8 relative z-10">
                        <div>
                            <h2 className="text-slate-800 text-xl font-bold tracking-tight">Activity Wave</h2>
                            <p className="text-slate-500 text-sm mt-1">Real-time dispatch velocity</p>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/50 rounded-full border border-white/60">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-xs font-semibold text-slate-600">Live</span>
                        </div>
                    </div>

                    {/* The Wave */}
                    <div className="relative h-48 flex items-end justify-between gap-2 md:gap-3 z-10">
                        {WAVE_BARS.map((bar, i) => (
                            <div
                                key={i}
                                className="flex-1 flex flex-col justify-end group"
                            >
                                <div
                                    className={`w-full ${bar.color} rounded-t-full transition-all duration-700 ease-in-out group-hover:opacity-100`}
                                    style={{
                                        height: `${bar.h}%`,
                                        opacity: bar.opacity,
                                        minHeight: '20px',
                                    }}
                                />
                            </div>
                        ))}
                    </div>

                    {/* X-axis labels */}
                    <div className="flex justify-between mt-4 px-1">
                        {['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'].map((time) => (
                            <span key={time} className="text-[10px] text-slate-400 font-medium">{time}</span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function FloatingLedger() {
    return (
        <section className="px-6 pb-20">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-slate-800 text-xl font-bold tracking-tight">Floating Ledger</h2>
                        <p className="text-slate-500 text-sm mt-1">Recent dispatch transactions</p>
                    </div>
                    <button className="px-5 py-2.5 bg-white/40 backdrop-blur-xl border border-white/60 rounded-full text-sm font-semibold text-slate-700 hover:bg-white/70 hover:-translate-y-0.5 transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                        View All
                    </button>
                </div>

                <div className="space-y-3">
                    {DISPATCHES.map((dispatch) => (
                        <div
                            key={dispatch.id}
                            className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white/30 backdrop-blur-md rounded-2xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:bg-white/60 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgb(0,0,0,0.06)] transition-all duration-300 cursor-pointer"
                        >
                            {/* Left: Avatar + Info */}
                            <div className="flex items-center gap-4">
                                <div className={`w-11 h-11 rounded-full ${dispatch.color} flex items-center justify-center text-white text-xs font-bold shadow-md`}>
                                    {dispatch.avatar}
                                </div>
                                <div>
                                    <h3 className="text-slate-800 font-semibold text-sm">{dispatch.name}</h3>
                                    <p className="text-slate-400 text-xs mt-0.5">{dispatch.email}</p>
                                </div>
                            </div>

                            {/* Right: Status + Time */}
                            <div className="flex items-center gap-4 sm:gap-6">
                                <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${STATUS_STYLES[dispatch.status]}`}>
                                    {dispatch.status}
                                </span>
                                <span className="text-slate-400 text-xs font-medium w-16 text-right">{dispatch.time}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ─── MAIN PAGE ─────────────────────────────────────────────
export default function Home() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-rose-100 via-fuchsia-50 to-teal-100 relative overflow-hidden font-sans selection:bg-violet-200 selection:text-violet-900">
            {/* Ambient background blobs for depth */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-rose-200/40 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-200/40 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '10s' }} />
                <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-violet-200/30 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '12s' }} />
            </div>

            <div className="relative z-10">
                <GlassNav />
                <HeroMetrics />
                <ActivityWave />
                <FloatingLedger />
            </div>
        </main>
    );
}