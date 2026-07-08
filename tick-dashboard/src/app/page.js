'use client'

import { useState } from 'react'

/* ═══════════════════════════════════════════════════════════════════════════
   TICKK — Pristine Enterprise Light‑Mode Dashboard
   “Stripe meets Vercel” — Absolute polish.
   ═══════════════════════════════════════════════════════════════════════════
   No dark mode logic — the toggle is purely decorative.
   ═══════════════════════════════════════════════════════════════════════════ */

// ─── Inline SVG Icons (zero deps) ─────────────────────────────────────────

const Icons = {
    Envelope: ({ className = 'w-4 h-4' }) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
        </svg>
    ),
    CheckCircle: ({ className = 'w-4 h-4' }) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
    ),
    Clock: ({ className = 'w-4 h-4' }) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
    ),
    ArrowPath: ({ className = 'w-4 h-4' }) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.992 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182M2.985 19.644l3.181-3.183" />
        </svg>
    ),
    Moon: ({ className = 'w-4 h-4' }) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
        </svg>
    ),
    Link: ({ className = 'w-3.5 h-3.5' }) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
        </svg>
    ),
    MapPin: ({ className = 'w-3.5 h-3.5' }) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
        </svg>
    ),
    Eye: ({ className = 'w-3.5 h-3.5' }) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
    ),
    ChevronDown: ({ className = 'w-3.5 h-3.5' }) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
    ),
}

// ─── Helpers ────────────────────────────────────────────────────────────────

const statusStyles = {
    Confirmed: { bg: 'bg-emerald-50', dot: 'bg-emerald-500', text: 'text-emerald-700' },
    Pending: { bg: 'bg-amber-50', dot: 'bg-amber-400', text: 'text-amber-700' },
    Delivered: { bg: 'bg-blue-50', dot: 'bg-blue-500', text: 'text-blue-700' },
}

const avatarColors = [
    'bg-orange-500', 'bg-emerald-500', 'bg-cyan-500', 'bg-violet-500',
    'bg-rose-500', 'bg-indigo-500', 'bg-amber-500', 'bg-sky-500',
    'bg-lime-600', 'bg-fuchsia-500', 'bg-teal-500', 'bg-pink-500',
]

const getAvatarColor = (email) => {
    let hash = 0
    for (let i = 0; i < email.length; i++) {
        hash = email.charCodeAt(i) + ((hash << 5) - hash)
    }
    return avatarColors[Math.abs(hash) % avatarColors.length]
}

// ─── Mock Data ─────────────────────────────────────────────────────────────

const DISPATCHES = [
    {
        id: 1,
        email: 'roya.kianmand@compass.com',
        token: 'a97c2e91',
        status: 'Confirmed',
        opens: '—',
        clicks: { count: 2, label: '2 clicks' },
        location: null,
        dispatchedAt: '12m ago',
        lastSync: '10m ago',
    },
    {
        id: 2,
        email: 'laurie@laurieannre.com',
        token: 'e4b6dc03',
        status: 'Confirmed',
        opens: 1,
        clicks: { count: 1, label: '1 click' },
        location: { city: 'Des Moines', country: 'United States' },
        dispatchedAt: '16m ago',
        lastSync: '16m ago',
    },
    {
        id: 3,
        email: 'karen@karenwilliams.com',
        token: '59c38b42',
        status: 'Confirmed',
        opens: 1,
        clicks: { count: 4, label: '4 clicks' },
        location: { city: 'The Rocks', country: 'Australia' },
        dispatchedAt: '20m ago',
        lastSync: '20m ago',
    },
    {
        id: 4,
        email: 'scott@scottwilliams.com',
        token: '3a2d0f18',
        status: 'Pending',
        opens: '—',
        clicks: null,
        location: null,
        dispatchedAt: '7m ago',
        lastSync: null,
    },
    {
        id: 5,
        email: 'justin@justinfreeman.com',
        token: 'c0a7f953',
        status: 'Pending',
        opens: '—',
        clicks: null,
        location: null,
        dispatchedAt: '25m ago',
        lastSync: null,
    },
    {
        id: 6,
        email: 'jay@jaysherman.com',
        token: 'cd5f4a85',
        status: 'Confirmed',
        opens: 1,
        clicks: null,
        location: { city: 'Rancho Palos Verdes', country: 'United States' },
        dispatchedAt: '29m ago',
        lastSync: '23m ago',
    },
    {
        id: 7,
        email: 'estrada.investments@gmail.com',
        token: '9b30bb87',
        status: 'Pending',
        opens: '—',
        clicks: null,
        location: null,
        dispatchedAt: '33m ago',
        lastSync: null,
    },
    {
        id: 8,
        email: 'doug@bigproperties.com',
        token: 'ba97c126',
        status: 'Delivered',
        opens: '—',
        clicks: null,
        location: null,
        dispatchedAt: '37m ago',
        lastSync: null,
    },
    {
        id: 9,
        email: 'dede@mybizipro.com',
        token: 'f0f3c8f9',
        status: 'Pending',
        opens: '—',
        clicks: null,
        location: null,
        dispatchedAt: '41m ago',
        lastSync: null,
    },
    {
        id: 10,
        email: 'crooney@lee-associates.com',
        token: 'f4a86b1e',
        status: 'Confirmed',
        opens: 2,
        clicks: { count: 4, label: '4 clicks' },
        location: { city: 'San Francisco', country: 'United States' },
        dispatchedAt: '45m ago',
        lastSync: '43m ago',
    },
    {
        id: 11,
        email: 'chris.morrison@compass.com',
        token: 'f4812a13',
        status: 'Confirmed',
        opens: '—',
        clicks: { count: 2, label: '2 clicks' },
        location: null,
        dispatchedAt: '48m ago',
        lastSync: '48m ago',
    },
    {
        id: 12,
        email: 'carol@carolwolfe.com',
        token: '303c1b4f',
        status: 'Pending',
        opens: '—',
        clicks: null,
        location: null,
        dispatchedAt: '52m ago',
        lastSync: null,
    },
    {
        id: 13,
        email: 'blaine.bush@sra-re.com',
        token: '50b42338',
        status: 'Confirmed',
        opens: 1,
        clicks: { count: 1, label: '1 click' },
        location: { city: 'Quincy', country: 'United States' },
        dispatchedAt: '57m ago',
        lastSync: '56m ago',
    },
    {
        id: 14,
        email: 'amy@widmerhomes.com',
        token: 'a8c1b809',
        status: 'Pending',
        opens: '—',
        clicks: null,
        location: null,
        dispatchedAt: '1h ago',
        lastSync: null,
    },
    {
        id: 15,
        email: 'alex@agreatyl.com',
        token: 'f1c0c832',
        status: 'Pending',
        opens: '—',
        clicks: null,
        location: null,
        dispatchedAt: '1h ago',
        lastSync: null,
    },
    {
        id: 16,
        email: 'aaron@authoritypris.com',
        token: 'b2b9e4c6',
        status: 'Confirmed',
        opens: 1,
        clicks: null,
        location: { city: 'Mountain View', country: 'United States' },
        dispatchedAt: '1h ago',
        lastSync: '27m ago',
    },
    {
        id: 17,
        email: 'marisa@kingsrealtygroup.com',
        token: 'f62a6a12',
        status: 'Confirmed',
        opens: 1,
        clicks: null,
        location: { city: 'Verdes', country: 'United States' },
        dispatchedAt: '29m ago',
        lastSync: '23m ago',
    },
    {
        id: 18,
        email: 'playaplay@me.com',
        token: 'a8f1ab85',
        status: 'Confirmed',
        opens: 1,
        clicks: null,
        location: null,
        dispatchedAt: '26m ago',
        lastSync: '23m ago',
    },
    {
        id: 19,
        email: 'monica@monicarealty.com',
        token: 'd41a9c07',
        status: 'Pending',
        opens: '—',
        clicks: null,
        location: null,
        dispatchedAt: '1h ago',
        lastSync: null,
    },
    {
        id: 20,
        email: 'brenda@bkhomes.net',
        token: '8f02cc54',
        status: 'Delivered',
        opens: '—',
        clicks: null,
        location: null,
        dispatchedAt: '1h ago',
        lastSync: null,
    },
    {
        id: 21,
        email: 'tina@luxurylistings.co',
        token: '17ae5b30',
        status: 'Confirmed',
        opens: 3,
        clicks: { count: 2, label: '2 clicks' },
        location: { city: 'Beverly Hills', country: 'United States' },
        dispatchedAt: '2h ago',
        lastSync: '1h ago',
    },
    {
        id: 22,
        email: 'greg@pacificcoastrealty.com',
        token: 'cc91df72',
        status: 'Pending',
        opens: '—',
        clicks: null,
        location: null,
        dispatchedAt: '2h ago',
        lastSync: null,
    },
    {
        id: 23,
        email: 'natasha@premierprops.com',
        token: '6b44e1a8',
        status: 'Confirmed',
        opens: 2,
        clicks: { count: 3, label: '3 clicks' },
        location: { city: 'Malibu', country: 'United States' },
        dispatchedAt: '2h ago',
        lastSync: '2h ago',
    },
    {
        id: 24,
        email: 'david@socalestates.com',
        token: 'a203bf19',
        status: 'Pending',
        opens: '—',
        clicks: null,
        location: null,
        dispatchedAt: '2h ago',
        lastSync: null,
    },
    {
        id: 25,
        email: 'susan@harborhomes.org',
        token: 'f9d81c47',
        status: 'Delivered',
        opens: '—',
        clicks: null,
        location: null,
        dispatchedAt: '3h ago',
        lastSync: null,
    },
    {
        id: 26,
        email: 'frank@franklinrealty.com',
        token: '2c87ea53',
        status: 'Confirmed',
        opens: 1,
        clicks: null,
        location: { city: 'Pasadena', country: 'United States' },
        dispatchedAt: '3h ago',
        lastSync: '2h ago',
    },
    {
        id: 27,
        email: 'jessica@jmrealtygroup.com',
        token: '7720cd96',
        status: 'Pending',
        opens: '—',
        clicks: null,
        location: null,
        dispatchedAt: '3h ago',
        lastSync: null,
    },
    {
        id: 28,
        email: 'roberto@casagranderealty.com',
        token: 'de03a4b1',
        status: 'Confirmed',
        opens: 2,
        clicks: { count: 5, label: '5 clicks' },
        location: { city: 'Santa Monica', country: 'United States' },
        dispatchedAt: '3h ago',
        lastSync: '3h ago',
    },
]

const TOTAL = DISPATCHES.length
const CONFIRMED = DISPATCHES.filter(d => d.status === 'Confirmed').length
const PENDING = DISPATCHES.filter(d => d.status === 'Pending').length
const RATE = TOTAL > 0 ? Math.round((CONFIRMED / TOTAL) * 100) : 0

// ─── Components ────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
    const s = statusStyles[status] || statusStyles.Pending
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
            {status}
        </span>
    )
}

function ViewTimelineButton() {
    return (
        <button className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50/70 border border-blue-100 rounded-lg hover:bg-blue-100 transition-colors duration-150">
            <Icons.Eye className="w-3.5 h-3.5" />
            View Timeline
        </button>
    )
}

// ─── Main Page ─────────────────────────────────────────────────────────────

export default function DashboardPage() {
    const [darkMode, setDarkMode] = useState(false) // decorative only

    return (
        <div className="min-h-screen bg-[#FAFAFA] font-sans antialiased">

            {/* ─── TOP NAVBAR ─── */}
            <nav className="sticky top-0 z-50 bg-white border-b border-slate-200/80">
                <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">

                    {/* Left: Logo + Brand */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm font-bold">T</span>
                        </div>
                        <span className="text-slate-900 text-[15px] font-bold tracking-tight">TICKK</span>
                        <span className="text-slate-400 text-sm font-normal ml-1">Outbound Audit</span>
                    </div>

                    {/* Right: Controls */}
                    <div className="flex items-center gap-4">

                        {/* Dark mode toggle (decorative) */}
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="relative w-11 h-6 rounded-full bg-gray-200 transition-colors duration-200 flex items-center"
                            aria-label="Toggle dark mode"
                        >
                            <div
                                className={`absolute w-5 h-5 rounded-full bg-white shadow-sm border border-gray-200 transition-transform duration-200 flex items-center justify-center
                  ${darkMode ? 'translate-x-[22px]' : 'translate-x-[2px]'}`}
                            >
                                <Icons.Moon className="w-3 h-3 text-slate-400" />
                            </div>
                        </button>

                        {/* Refresh button */}
                        <button className="flex items-center gap-1.5 px-3.5 py-1.5 text-sm text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors duration-150">
                            <Icons.ArrowPath className="w-3.5 h-3.5 text-slate-400" />
                            Refresh
                        </button>

                        {/* Workspace + Profile */}
                        <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-slate-200">
                            <div className="text-right">
                                <p className="text-sm text-slate-700 font-medium leading-tight">Demo Workspace</p>
                                <p className="text-[11px] text-slate-400 leading-tight flex items-center gap-1 justify-end">
                                    <svg className="w-3 h-3 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
                                    </svg>
                                    Pro Tier
                                </p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                                <svg className="w-4 h-4 text-slate-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* ─── MAIN CONTENT ─── */}
            <main className="max-w-[1400px] mx-auto px-6 py-8">

                {/* Header text */}
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Outbound Audit Console</h1>
                    <p className="text-sm text-slate-500 mt-1.5">
                        Delivery confirmations and engagement signals for your dispatched emails.
                    </p>
                </div>

                {/* ─── METRICS GRID ─── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">

                    <MetricCard
                        label="Total Dispatches"
                        value={TOTAL}
                        icon={<Icons.Envelope className="w-4 h-4 text-slate-400" />}
                    />
                    <MetricCard
                        label="Confirmed"
                        value={CONFIRMED}
                        icon={<span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />}
                    />
                    <MetricCard
                        label="Pending"
                        value={PENDING}
                        icon={<span className="w-2.5 h-2.5 rounded-full bg-amber-400" />}
                    />
                    <MetricCard
                        label="Delivery Rate"
                        value={RATE}
                        suffix="%"
                        icon={<Icons.ArrowPath className="w-4 h-4 text-blue-500" />}
                    />

                </div>

                {/* ─── DATA TABLE ─── */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] overflow-hidden">

                    {/* Table header */}
                    <div className="grid grid-cols-[1.5fr_0.8fr_0.6fr_0.7fr_0.9fr_0.7fr_0.8fr] gap-4 px-6 py-3 border-b border-slate-200 bg-slate-50/60">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Recipient</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Opens</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Link Clicks</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Location</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dispatched At</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Last Audit Sync</span>
                    </div>

                    {/* Table rows */}
                    <div className="divide-y divide-slate-100">
                        {DISPATCHES.map((row) => {
                            const avatarColor = getAvatarColor(row.email)
                            return (
                                <div
                                    key={row.id}
                                    className="grid grid-cols-[1.5fr_0.8fr_0.6fr_0.7fr_0.9fr_0.7fr_0.8fr] gap-4 items-center px-6 py-4 hover:bg-slate-50/60 transition-colors duration-150"
                                >
                                    {/* Recipient */}
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className={`w-7 h-7 rounded-full ${avatarColor} flex items-center justify-center flex-shrink-0`}>
                                            <span className="text-white text-[10px] font-medium">
                                                {row.email.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[13px] font-medium text-slate-800 truncate">{row.email}</p>
                                            <p className="text-[10px] text-slate-400 font-mono truncate">{row.token} . . .</p>
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div><StatusBadge status={row.status} /></div>

                                    {/* Opens */}
                                    <div className="text-sm text-slate-600">
                                        {row.opens === '—' ? <span className="text-slate-300">—</span> : <span className="tabular-nums">{row.opens}</span>}
                                    </div>

                                    {/* Link Clicks */}
                                    <div className="text-sm text-slate-600">
                                        {row.clicks ? (
                                            <div className="flex items-center gap-1.5">
                                                <Icons.Link className="w-3.5 h-3.5 text-blue-500" />
                                                <span className="text-blue-600 text-xs font-medium">{row.clicks.label}</span>
                                            </div>
                                        ) : (
                                            <span className="text-slate-300">—</span>
                                        )}
                                    </div>

                                    {/* Location */}
                                    <div>
                                        {row.location ? (
                                            <div className="flex items-start gap-1.5">
                                                <Icons.MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                                                <div className="min-w-0">
                                                    <p className="text-xs text-slate-600 truncate">{row.location.city},</p>
                                                    <p className="text-[10px] text-slate-400 truncate">{row.location.country}</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-slate-300 text-sm">—</span>
                                        )}
                                    </div>

                                    {/* Dispatched At */}
                                    <div className="text-sm text-slate-500">{row.dispatchedAt}</div>

                                    {/* Last Audit Sync */}
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-sm">
                                            {row.lastSync ? (
                                                <span className="text-slate-500">{row.lastSync}</span>
                                            ) : (
                                                <span className="text-slate-300 italic">Pending</span>
                                            )}
                                        </span>
                                        <ViewTimelineButton />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* ─── FOOTER ─── */}
                <div className="mt-6 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Showing {DISPATCHES.length} of {DISPATCHES.length} dispatches</span>
                    <span>TICKK Systems &middot; v4.2.0</span>
                </div>

            </main>
        </div>
    )
}

// ─── Metric Card Component ─────────────────────────────────────────────────

function MetricCard({ label, value, suffix = '', icon }) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] p-6">
            <div className="flex items-center gap-2 mb-3">
                {icon}
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    {label}
                </span>
            </div>
            <p className="text-3xl font-semibold text-slate-900 tabular-nums">
                {value}
                {suffix && <span className="text-lg font-normal text-slate-400 ml-0.5">{suffix}</span>}
            </p>
        </div>
    )
}