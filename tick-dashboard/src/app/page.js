'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 1: EXTENSIVE MOCK DATA ARCHITECTURE
// ═══════════════════════════════════════════════════════════════════════════════

const LEDGER_DATA = [
    { id: 'TX-8841', name: 'Elon Musk', email: 'elon.musk@x.com', status: 'Confirmed', time: '2m ago', value: '$12,400', region: 'North America', method: 'Wire', trend: [12, 19, 15, 25, 22, 30, 28, 35, 32, 40] },
    { id: 'TX-8842', name: 'Sundar Pichai', email: 'sundar.pichai@google.com', status: 'Pending', time: '14m ago', value: '$8,200', region: 'Asia Pacific', method: 'ACH', trend: [8, 12, 10, 15, 18, 14, 20, 16, 22, 18] },
    { id: 'TX-8843', name: 'Satya Nadella', email: 'satya.nadella@microsoft.com', status: 'Confirmed', time: '32m ago', value: '$24,000', region: 'North America', method: 'Wire', trend: [20, 25, 22, 30, 35, 32, 40, 38, 45, 42] },
    { id: 'TX-8844', name: 'Tim Cook', email: 'tim.cook@apple.com', status: 'Confirmed', time: '1h ago', value: '$15,600', region: 'North America', method: 'SEPA', trend: [15, 18, 16, 22, 20, 25, 28, 24, 30, 26] },
    { id: 'TX-8845', name: 'Jensen Huang', email: 'jensen.huang@nvidia.com', status: 'Pending', time: '2h ago', value: '$31,200', region: 'Asia Pacific', method: 'Wire', trend: [25, 30, 28, 35, 40, 38, 45, 42, 50, 48] },
    { id: 'TX-8846', name: 'Jeff Bezos', email: 'jeff.bezos@amazon.com', status: 'Bounced', time: '3h ago', value: '$5,000', region: 'North America', method: 'ACH', trend: [10, 8, 12, 6, 9, 5, 8, 4, 7, 3] },
    { id: 'TX-8847', name: 'Mark Zuckerberg', email: 'mark.zuckerberg@meta.com', status: 'Confirmed', time: '4h ago', value: '$9,800', region: 'Europe', method: 'Wire', trend: [5, 10, 8, 15, 12, 18, 20, 16, 22, 19] },
    { id: 'TX-8848', name: 'Larry Ellison', email: 'larry.ellison@oracle.com', status: 'Pending', time: '5h ago', value: '$18,500', region: 'North America', method: 'Wire', trend: [18, 22, 20, 25, 28, 24, 30, 26, 32, 29] },
    { id: 'TX-8849', name: 'Tim Berners-Lee', email: 'tim@w3.org', status: 'Confirmed', time: '6h ago', value: '$2,400', region: 'Europe', method: 'SEPA', trend: [2, 5, 4, 8, 6, 10, 12, 9, 14, 11] },
    { id: 'TX-8850', name: 'Linus Torvalds', email: 'linus@linux.org', status: 'Confirmed', time: '7h ago', value: '$7,100', region: 'Europe', method: 'ACH', trend: [6, 8, 7, 12, 10, 14, 16, 13, 18, 15] },
    { id: 'TX-8851', name: 'Sam Altman', email: 'sam@openai.com', status: 'Confirmed', time: '8h ago', value: '$45,000', region: 'North America', method: 'Wire', trend: [30, 35, 32, 40, 38, 45, 48, 42, 50, 55] },
    { id: 'TX-8852', name: 'Sergey Brin', email: 'sergey@google.com', status: 'Pending', time: '9h ago', value: '$11,200', region: 'North America', method: 'ACH', trend: [10, 12, 11, 15, 13, 18, 16, 20, 18, 22] },
    { id: 'TX-8853', name: 'Larry Page', email: 'larry@google.com', status: 'Confirmed', time: '10h ago', value: '$13,800', region: 'North America', method: 'Wire', trend: [12, 15, 14, 18, 16, 22, 20, 25, 23, 28] },
    { id: 'TX-8854', name: 'Sheryl Sandberg', email: 'sheryl@meta.com', status: 'Confirmed', time: '11h ago', value: '$6,500', region: 'Europe', method: 'SEPA', trend: [5, 8, 6, 10, 8, 12, 10, 14, 12, 16] },
    { id: 'TX-8855', name: 'Reed Hastings', email: 'reed@netflix.com', status: 'Pending', time: '12h ago', value: '$19,200', region: 'North America', method: 'Wire', trend: [15, 18, 16, 22, 20, 26, 24, 30, 28, 32] },
    { id: 'TX-8856', name: 'Brian Chesky', email: 'brian@airbnb.com', status: 'Confirmed', time: '13h ago', value: '$8,900', region: 'Europe', method: 'ACH', trend: [7, 10, 9, 13, 11, 15, 13, 17, 15, 19] },
    { id: 'TX-8857', name: 'Daniel Ek', email: 'daniel@spotify.com', status: 'Confirmed', time: '14h ago', value: '$14,300', region: 'Europe', method: 'SEPA', trend: [10, 14, 12, 18, 15, 20, 18, 24, 22, 26] },
    { id: 'TX-8858', name: 'Patrick Collison', email: 'patrick@stripe.com', status: 'Pending', time: '15h ago', value: '$22,100', region: 'Europe', method: 'Wire', trend: [18, 22, 20, 26, 24, 30, 28, 34, 32, 38] },
    { id: 'TX-8859', name: 'John Collison', email: 'john@stripe.com', status: 'Confirmed', time: '16h ago', value: '$17,400', region: 'Europe', method: 'ACH', trend: [14, 18, 16, 20, 18, 24, 22, 26, 24, 28] },
    { id: 'TX-8860', name: 'Drew Houston', email: 'drew@dropbox.com', status: 'Confirmed', time: '17h ago', value: '$5,800', region: 'North America', method: 'ACH', trend: [4, 7, 6, 9, 7, 11, 9, 13, 11, 14] },
];

const FILTER_TABS = ['All', 'Confirmed', 'Pending', 'Bounced'];

const STATUS_META = {
    Confirmed: { label: 'Confirmed', dot: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50/80' },
    Pending: { label: 'Pending', dot: 'bg-amber-400', text: 'text-amber-700', bg: 'bg-amber-50/80' },
    Bounced: { label: 'Bounced', dot: 'bg-rose-400', text: 'text-rose-700', bg: 'bg-rose-50/80' },
};

const REGION_COLORS = {
    'North America': '#bfa07a',
    'Europe': '#8fa39a',
    'Asia Pacific': '#c9b8a8',
};

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 2: CUSTOM HOOKS
// ═══════════════════════════════════════════════════════════════════════════════

function useMousePosition() {
    const [pos, setPos] = useState({ x: 0, y: 0 });
    useEffect(() => {
        const handle = (e) => setPos({ x: e.clientX, y: e.clientY });
        window.addEventListener('mousemove', handle);
        return () => window.removeEventListener('mousemove', handle);
    }, []);
    return pos;
}

function useCountUp(target, duration = 2500) {
    const [val, setVal] = useState(0);
    useEffect(() => {
        const start = performance.now();
        const tick = (now) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 5);
            setVal(Math.floor(eased * target));
            if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }, [target, duration]);
    return val;
}

function useInView(threshold = 0.1) {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setInView(true);
                obs.unobserve(el);
            }
        }, { threshold });
        obs.observe(el);
        return () => obs.disconnect();
    }, [threshold]);
    return [ref, inView];
}

function useLiveClock() {
    const [time, setTime] = useState('');
    useEffect(() => {
        const fmt = () => setTime(new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        fmt();
        const id = setInterval(fmt, 1000);
        return () => clearInterval(id);
    }, []);
    return time;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 3: LIVING CANVAS BACKGROUND (ZEN PARTICLE FIELD)
// ═══════════════════════════════════════════════════════════════════════════════

function ZenCanvas() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let w, h;
        let particles = [];
        let mouse = { x: -1000, y: -1000 };
        let raf;

        const resize = () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        };

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * w;
                this.y = Math.random() * h;
                this.vx = (Math.random() - 0.5) * 0.3;
                this.vy = (Math.random() - 0.5) * 0.3;
                this.size = Math.random() * 2 + 0.5;
                this.opacity = Math.random() * 0.15 + 0.05;
                this.phase = Math.random() * Math.PI * 2;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.phase += 0.01;

                // Gentle mouse repulsion
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 200) {
                    const force = (200 - dist) / 200;
                    this.x += (dx / dist) * force * 0.5;
                    this.y += (dy / dist) * force * 0.5;
                }

                if (this.x < 0 || this.x > w || this.y < 0 || this.y > h) this.reset();
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(191, 160, 122, ${this.opacity + Math.sin(this.phase) * 0.03})`;
                ctx.fill();
            }
        }

        const init = () => {
            resize();
            particles = Array.from({ length: 80 }, () => new Particle());
        };

        const animate = () => {
            ctx.clearRect(0, 0, w, h);
            particles.forEach((p) => {
                p.update();
                p.draw();
            });

            // Draw connections
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 150) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(191, 160, 122, ${0.04 * (1 - dist / 150)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }

            raf = requestAnimationFrame(animate);
        };

        const handleMouse = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        init();
        animate();
        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', handleMouse);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouse);
        };
    }, []);

    return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.6 }} />;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 4: 3D TILT CARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

function TiltCard({ children, intensity = 6, className = '' }) {
    const ref = useRef(null);
    const [transform, setTransform] = useState('');

    const handleMove = useCallback((e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        const cx = r.width / 2;
        const cy = r.height / 2;
        const rx = ((y - cy) / cy) * -intensity;
        const ry = ((x - cx) / cx) * intensity;
        setTransform(`perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02, 1.02, 1.02)`);
    }, [intensity]);

    const handleLeave = useCallback(() => {
        setTransform(`perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`);
    }, []);

    return (
        <div
            ref={ref}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
            style={{
                transform: transform,
                transition: transform.includes('0deg') ? 'transform 0.8s cubic-bezier(0.23, 1, 0.32, 1)' : 'transform 0.1s ease-out',
                transformStyle: 'preserve-3d',
                willChange: 'transform',
            }}
            className={className}
        >
            {children}
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 5: SPARKLINE SVG CHART
// ═══════════════════════════════════════════════════════════════════════════════

function Sparkline({ data, color = '#bfa07a' }) {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const w = 140;
    const h = 48;
    const points = data.map((v, i) => {
        const x = (i / (data.length - 1)) * w;
        const y = h - ((v - min) / range) * (h - 12) - 6;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');

    const lastX = w;
    const lastY = h - ((data[data.length - 1] - min) / range) * (h - 12) - 6;

    return (
        <svg width={w} height={h} className="overflow-visible">
            <defs>
                <linearGradient id={`grad-${data.length}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <polyline
                points={points}
                fill="none"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.4"
            />
            <polygon
                points={`0,${h} ${points} ${w},${h}`}
                fill={`url(#grad-${data.length})`}
                stroke="none"
            />
            <circle cx={lastX} cy={lastY} r="3" fill={color} opacity="0.8" />
        </svg>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 6: ORGANIC WAVE VISUALIZATION
// ═══════════════════════════════════════════════════════════════════════════════

function OrganicWave() {
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        let raf;
        const animate = () => {
            setOffset((prev) => (prev + 0.005) % 1);
            raf = requestAnimationFrame(animate);
        };
        raf = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(raf);
    }, []);

    const generatePath = (phase, amplitude, frequency) => {
        const points = [];
        for (let x = 0; x <= 100; x += 0.5) {
            const y = 50 + Math.sin((x / 100) * Math.PI * frequency + phase + offset * Math.PI * 2) * amplitude;
            points.push(`${x},${y}`);
        }
        return `M ${points.join(' L ')}`;
    };

    return (
        <div className="w-full h-40 relative overflow-hidden rounded-2xl bg-gradient-to-b from-white/40 to-transparent border border-white/60 backdrop-blur-sm">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full opacity-30">
                <path d={generatePath(0, 15, 2)} fill="none" stroke="#bfa07a" strokeWidth="0.3" />
                <path d={generatePath(1, 12, 3)} fill="none" stroke="#8fa39a" strokeWidth="0.3" />
                <path d={generatePath(2, 18, 1.5)} fill="none" stroke="#c9b8a8" strokeWidth="0.3" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#9c9590]">Live Activity Stream</p>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 7: ANIMATED COUNTER WITH SMOOTH EASE
// ═══════════════════════════════════════════════════════════════════════════════

function AnimatedNumber({ value, prefix = '', suffix = '', className = '' }) {
    const count = useCountUp(value);
    return (
        <span className={`tabular-nums ${className}`}>
            {prefix}{count.toLocaleString()}{suffix}
        </span>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 8: MAIN DASHBOARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function ZenSanctuary() {
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');
    const [hoveredRow, setHoveredRow] = useState(null);
    const [mounted, setMounted] = useState(false);
    const mouse = useMousePosition();
    const clock = useLiveClock();

    // Intersection observers for scroll reveals
    const [heroRef, heroInView] = useInView();
    const [metricsRef, metricsInView] = useInView();
    const [waveRef, waveInView] = useInView();
    const [tableRef, tableInView] = useInView();

    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 100);
        return () => clearTimeout(t);
    }, []);

    // Filter logic
    const filteredData = useMemo(() => {
        return LEDGER_DATA.filter((item) => {
            const matchesFilter = filter === 'All' || item.status === filter;
            const matchesSearch = !search || [item.name, item.email, item.id, item.region].some((field) =>
                field.toLowerCase().includes(search.toLowerCase())
            );
            return matchesFilter && matchesSearch;
        });
    }, [filter, search]);

    // Metrics
    const totalDispatches = 2847;
    const confirmedTotal = 2412;
    const pendingTotal = 312;
    const deliveryRate = 94;

    const metrics = [
        { label: 'Total Dispatches', value: totalDispatches, sub: '+12.4% from last week', spark: [20, 28, 22, 35, 30, 42, 38, 50, 48, 55] },
        { label: 'Confirmed', value: confirmedTotal, sub: 'Successfully delivered', spark: [15, 20, 18, 25, 22, 30, 28, 35, 32, 40] },
        { label: 'Pending', value: pendingTotal, sub: 'Awaiting processing', spark: [5, 8, 6, 10, 8, 12, 10, 15, 12, 18] },
        { label: 'Delivery Rate', value: deliveryRate, suffix: '%', sub: 'Above industry avg', spark: [70, 72, 75, 78, 80, 82, 85, 88, 90, 94] },
    ];

    return (
        <div className="min-h-screen bg-[#faf9f6] text-[#2d2a26] font-sans antialiased overflow-x-hidden relative selection:bg-[#2d2a26] selection:text-[#faf9f6]">
            {/* ─── GLOBAL KEYFRAME STYLES ─── */}
            <style>{`
        @keyframes gentleFloat {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(15px, -20px) rotate(1deg); }
          50% { transform: translate(-10px, 10px) rotate(-0.5deg); }
          75% { transform: translate(20px, 15px) rotate(0.5deg); }
        }
        @keyframes breathe {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.08); }
        }
        @keyframes revealUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes drawLine {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .anim-reveal {
          opacity: 0;
          animation: revealUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .anim-fade {
          opacity: 0;
          animation: fadeIn 1.2s ease-out forwards;
        }
        .anim-slide {
          opacity: 0;
          animation: slideInRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-600 { animation-delay: 0.6s; }
        .delay-700 { animation-delay: 0.7s; }
        .delay-800 { animation-delay: 0.8s; }
      `}</style>

            {/* ─── LIVING CANVAS LAYER ─── */}
            <ZenCanvas />

            {/* ─── AMBIENT ORBS ─── */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-[#e8ddd5] opacity-30 blur-[100px]" style={{ animation: 'gentleFloat 25s ease-in-out infinite' }} />
                <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-[#d4c4b5] opacity-25 blur-[120px]" style={{ animation: 'gentleFloat 30s ease-in-out infinite 5s' }} />
                <div className="absolute top-[40%] left-[60%] w-[300px] h-[300px] rounded-full bg-[#bfa07a] opacity-15 blur-[80px]" style={{ animation: 'gentleFloat 20s ease-in-out infinite 10s' }} />
            </div>

            {/* ─── MOUSE GLOW FOLLOWER ─── */}
            <div
                className="fixed pointer-events-none z-50 transition-opacity duration-700"
                style={{
                    width: 400,
                    height: 400,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(191,160,122,0.08) 0%, transparent 70%)',
                    transform: `translate(${mouse.x - 200}px, ${mouse.y - 200}px)`,
                    opacity: mounted ? 1 : 0,
                }}
            />

            {/* ─── MAIN CONTENT ─── */}
            <div className="relative z-10 max-w-6xl mx-auto px-8 md:px-16">

                {/* ═══════════════════════════════════════════════════ */}
                {/* HEADER                                            */}
                {/* ═══════════════════════════════════════════════════ */}
                <header className={`flex items-center justify-between py-12 ${mounted ? 'anim-fade' : ''}`}>
                    <div className="flex items-center gap-4 group cursor-default">
                        <div className="w-8 h-[1px] bg-[#2d2a26] transition-all duration-500 group-hover:w-12" />
                        <div>
                            <span className="text-[10px] font-bold tracking-[0.35em] uppercase text-[#9c9590] block">Nexus</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="hidden md:flex flex-col items-end">
                            <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#9c9590]">System Time</span>
                            <span className="font-mono text-[11px] text-[#2d2a26] tracking-widest mt-0.5">{clock}</span>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-[#2d2a26] text-[#faf9f6] flex items-center justify-center text-[10px] font-bold tracking-wider">
                            AC
                        </div>
                    </div>
                </header>

                {/* ═══════════════════════════════════════════════════ */}
                {/* HERO SECTION                                      */}
                {/* ═══════════════════════════════════════════════════ */}
                <section ref={heroRef} className="pt-12 pb-24 relative">
                    <div className={`${heroInView ? 'anim-reveal' : 'opacity-0'}`}>
                        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#9c9590] mb-8">
                            Dispatch Overview
                        </p>

                        <h1 className="text-7xl md:text-9xl font-extralight tracking-tighter leading-[0.9] tabular-nums text-[#2d2a26]">
                            <AnimatedNumber value={totalDispatches} />
                        </h1>

                        <div className="flex items-center gap-6 mt-10 max-w-lg">
                            <div
                                className="h-px flex-1 bg-[#2d2a26]/20 origin-left"
                                style={{
                                    transform: heroInView ? 'scaleX(1)' : 'scaleX(0)',
                                    transition: 'transform 1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.3s',
                                }}
                            />
                            <p className="text-[12px] text-[#9c9590] tracking-wide font-medium leading-relaxed">
                                Total dispatches orchestrated across all active channels with real-time synchronization.
                            </p>
                        </div>
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════════ */}
                {/* 3D METRICS BENTO GRID                             */}
                {/* ═══════════════════════════════════════════════════ */}
                <section ref={metricsRef} className="pb-24">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {metrics.map((m, i) => (
                            <div
                                key={m.label}
                                className={`${metricsInView ? 'anim-reveal' : 'opacity-0'}`}
                                style={{ animationDelay: `${0.1 + i * 0.1}s` }}
                            >
                                <TiltCard intensity={5}>
                                    <div className="relative h-full bg-white/50 backdrop-blur-xl border border-white/80 rounded-3xl p-8 shadow-[0_2px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] transition-shadow duration-700 cursor-default overflow-hidden group">
                                        {/* Subtle top accent line */}
                                        <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#bfa07a]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                        <div className="flex items-start justify-between mb-6">
                                            <span className="text-[9px] font-bold tracking-[0.25em] uppercase text-[#9c9590]">
                                                {m.label}
                                            </span>
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-1 group-hover:translate-y-0">
                                                <Sparkline data={m.spark} />
                                            </div>
                                        </div>

                                        <div className="text-4xl md:text-5xl font-extralight tracking-tight tabular-nums text-[#2d2a26] mb-2">
                                            <AnimatedNumber value={m.value} suffix={m.suffix || ''} />
                                        </div>

                                        <p className="text-[11px] text-[#9c9590] tracking-wide font-medium">
                                            {m.sub}
                                        </p>

                                        {/* Bottom reveal line */}
                                        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#2d2a26]/10 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center" />
                                    </div>
                                </TiltCard>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════════ */}
                {/* ORGANIC WAVE SECTION                              */}
                {/* ═══════════════════════════════════════════════════ */}
                <section ref={waveRef} className={`pb-24 ${waveInView ? 'anim-reveal delay-200' : 'opacity-0'}`}>
                    <div className="mb-6 flex items-center justify-between">
                        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#9c9590]">Activity Flow</p>
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#9c9590]">Live</span>
                        </div>
                    </div>
                    <OrganicWave />
                </section>

                {/* ═══════════════════════════════════════════════════ */}
                {/* DIVIDER                                           */}
                {/* ═══════════════════════════════════════════════════ */}
                <div className="h-px bg-[#2d2a26]/10 mb-16" />

                {/* ═══════════════════════════════════════════════════ */}
                {/* FILTER CONSOLE                                    */}
                {/* ═══════════════════════════════════════════════════ */}
                <section className={`flex flex-col sm:flex-row items-start sm:items-end justify-between gap-8 mb-12 ${mounted ? 'anim-reveal delay-300' : ''}`}>
                    <div className="relative w-full sm:w-96 group">
                        <input
                            type="text"
                            placeholder="Search by name, email, or ID..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-transparent border-b border-[#2d2a26]/10 py-3 pr-8 text-sm text-[#2d2a26] placeholder:text-[#9c9590]/40 focus:outline-none focus:border-[#2d2a26]/30 transition-colors duration-500"
                        />
                        <svg className="absolute right-0 top-3.5 w-4 h-4 text-[#9c9590]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        {search && (
                            <button
                                onClick={() => setSearch('')}
                                className="absolute right-6 top-3 text-[9px] font-bold uppercase tracking-widest text-[#9c9590] hover:text-[#2d2a26] transition-colors duration-300"
                            >
                                Clear
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-1 bg-white/30 backdrop-blur-md border border-white/50 rounded-full p-1 shadow-sm">
                        {FILTER_TABS.map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-500 ${filter === f
                                    ? 'bg-[#2d2a26] text-[#faf9f6] shadow-md'
                                    : 'text-[#9c9590] hover:text-[#2d2a26]'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════════ */}
                {/* ENTERPRISE LEDGER TABLE                           */}
                {/* ═══════════════════════════════════════════════════ */}
                <section ref={tableRef} className={`pb-32 ${tableInView ? 'anim-fade' : 'opacity-0'}`}>
                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-4 py-4 border-b border-[#2d2a26]/10">
                        {[
                            { label: 'ID', span: 'col-span-2' },
                            { label: 'Recipient', span: 'col-span-3' },
                            { label: 'Region', span: 'col-span-2 hidden md:block' },
                            { label: 'Status', span: 'col-span-2' },
                            { label: 'Time', span: 'col-span-2 text-right' },
                            { label: 'Value', span: 'col-span-1 text-right hidden sm:block' },
                        ].map((h) => (
                            <div key={h.label} className={`text-[9px] font-bold tracking-[0.2em] uppercase text-[#9c9590] ${h.span}`}>
                                {h.label}
                            </div>
                        ))}
                    </div>

                    {/* Table Body */}
                    <div className="relative">
                        {filteredData.map((item, i) => {
                            const cfg = STATUS_META[item.status];
                            const isHovered = hoveredRow === item.id;
                            const regionColor = REGION_COLORS[item.region] || '#9c9590';

                            return (
                                <div
                                    key={item.id}
                                    onMouseEnter={() => setHoveredRow(item.id)}
                                    onMouseLeave={() => setHoveredRow(null)}
                                    className="grid grid-cols-12 gap-4 py-5 border-b border-[#2d2a26]/5 items-center cursor-pointer transition-all duration-500 relative group"
                                    style={{
                                        opacity: 0,
                                        animation: tableInView ? `slideInRight 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.2 + i * 0.03}s forwards` : 'none',
                                    }}
                                >
                                    {/* Hover Background */}
                                    <div className={`absolute inset-0 bg-[#f0ede8]/60 rounded-xl transition-all duration-500 ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.98]'}`} />

                                    <div className="col-span-2 relative z-10">
                                        <span className="text-[10px] font-mono tracking-wider text-[#9c9590] group-hover:text-[#2d2a26] transition-colors duration-300">
                                            {item.id}
                                        </span>
                                    </div>

                                    <div className="col-span-3 relative z-10">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium tracking-tight text-[#2d2a26]">{item.name}</span>
                                            <span className="text-[10px] text-[#9c9590] md:hidden mt-0.5">{item.email}</span>
                                        </div>
                                    </div>

                                    <div className="col-span-2 hidden md:block relative z-10">
                                        <div className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: regionColor }} />
                                            <span className="text-[11px] text-[#9c9590]">{item.region}</span>
                                        </div>
                                    </div>

                                    <div className="col-span-2 relative z-10">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide ${cfg.bg} ${cfg.text}`}>
                                            <span className={`w-1 h-1 rounded-full ${cfg.dot} ${item.status === 'Pending' ? 'animate-pulse' : ''}`} />
                                            {item.status}
                                        </span>
                                    </div>

                                    <div className="col-span-2 relative z-10 text-right">
                                        <span className="text-[10px] font-mono text-[#9c9590] tracking-wide">{item.time}</span>
                                    </div>

                                    <div className="col-span-1 relative z-10 text-right hidden sm:block">
                                        <span className="text-[11px] font-mono font-medium tabular-nums text-[#2d2a26]">{item.value}</span>
                                    </div>
                                </div>
                            );
                        })}

                        {filteredData.length === 0 && (
                            <div className="py-24 text-center">
                                <p className="text-[11px] text-[#9c9590] tracking-widest uppercase font-medium">No matching records found</p>
                                <p className="text-[10px] text-[#9c9590]/60 mt-2 tracking-wide">Try adjusting your search or filters</p>
                            </div>
                        )}
                    </div>

                    {/* Footer Meta */}
                    <div className="flex flex-col sm:flex-row items-center justify-between pt-12 gap-4">
                        <span className="text-[9px] text-[#9c9590] uppercase tracking-[0.2em] font-bold">
                            Showing {filteredData.length} of {LEDGER_DATA.length} records
                        </span>
                        <span className="flex items-center gap-2 text-[9px] text-[#9c9590] uppercase tracking-[0.2em] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Synchronized {clock}
                        </span>
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════════ */}
                {/* FOOTER                                            */}
                {/* ═══════════════════════════════════════════════════ */}
                <footer className={`py-12 border-t border-[#2d2a26]/10 ${mounted ? 'anim-fade delay-700' : ''}`}>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-[1px] bg-[#2d2a26]/30" />
                            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#9c9590]">Nexus Command</span>
                        </div>
                        <div className="flex items-center gap-8">
                            <span className="text-[9px] text-[#9c9590] tracking-widest uppercase">Status: Operational</span>
                            <span className="text-[9px] text-[#9c9590] tracking-widest uppercase">v2.4.0</span>
                        </div>
                    </div>
                </footer>

            </div>
        </div>
    );
}