'use client'

import { useState } from 'react'

/* ═══════════════════════════════════════════════════════════════════════════
   TICKK — "Pure Peace" Minimalist Enterprise Dashboard
   ═══════════════════════════════════════════════════════════════════════════
   Linear meets Stripe meets Vercel — the ultimate light-mode polish.
   Soft canvas (slate-50/50) · Gradient avatars · Jewel-cut badges
   Ring-1 card edges · Buttery hover dynamics · Microscopic labels
   ═══════════════════════════════════════════════════════════════════════════ */


// ─── INLINE SVG ICON COMPONENTS ─────────────────────────────────────────────

function EnvelopeIcon({ className = 'w-4 h-4' }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
        </svg>
    )
}

function CheckBadgeIcon({ className = 'w-4 h-4' }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
        </svg>
    )
}

function ClockIcon({ className = 'w-4 h-4' }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
    )
}

function ArrowPathIcon({ className = 'w-4 h-4' }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.992 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182M2.985 19.644l3.181-3.183" />
        </svg>
    )
}

function ChartBarIcon({ className = 'w-4 h-4' }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
        </svg>
    )
}

function LinkIcon({ className = 'w-3.5 h-3.5' }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
        </svg>
    )
}

function MapPinIcon({ className = 'w-3.5 h-3.5' }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
        </svg>
    )
}

function EyeIcon({ className = 'w-3.5 h-3.5' }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
    )
}

function SunIcon({ className = 'w-4 h-4' }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
        </svg>
    )
}

function MoonIcon({ className = 'w-4 h-4' }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
        </svg>
    )
}

function UserIcon({ className = 'w-4 h-4' }) {
    return (
        <svg className={className} fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
        </svg>
    )
}

function CheckCircleSolidIcon({ className = 'w-3 h-3' }) {
    return (
        <svg className={className} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
        </svg>
    )
}


// ─── AVATAR GRADIENT PALETTE ────────────────────────────────────────────────
// Soft pastel gradients for a premium, non-flat feel. Mapped per-row by index.

const AVATAR_PALETTE = [
    { bg: 'bg-gradient-to-br from-orange-100 to-amber-50', text: 'text-amber-700' },
    { bg: 'bg-gradient-to-br from-emerald-100 to-teal-50', text: 'text-emerald-700' },
    { bg: 'bg-gradient-to-br from-blue-100 to-sky-50', text: 'text-blue-700' },
    { bg: 'bg-gradient-to-br from-violet-100 to-purple-50', text: 'text-violet-700' },
    { bg: 'bg-gradient-to-br from-rose-100 to-pink-50', text: 'text-rose-700' },
    { bg: 'bg-gradient-to-br from-cyan-100 to-sky-50', text: 'text-cyan-700' },
    { bg: 'bg-gradient-to-br from-amber-100 to-yellow-50', text: 'text-amber-800' },
    { bg: 'bg-gradient-to-br from-teal-100 to-emerald-50', text: 'text-teal-700' },
    { bg: 'bg-gradient-to-br from-indigo-100 to-blue-50', text: 'text-indigo-700' },
    { bg: 'bg-gradient-to-br from-pink-100 to-rose-50', text: 'text-pink-700' },
    { bg: 'bg-gradient-to-br from-lime-100 to-green-50', text: 'text-lime-800' },
    { bg: 'bg-gradient-to-br from-sky-100 to-cyan-50', text: 'text-sky-700' },
]


// ─── MOCK DISPATCH DATA ─────────────────────────────────────────────────────

const DISPATCHES = [
    {
        id: 1,
        email: 'roya.kianmand@compass.com',
        token: 'a97c2e91',
        status: 'Confirmed',
        opens: null,
        clicks: { count: 2, label: '2 clicks' },
        location: null,
        dispatchedAt: '12m ago',
        lastSync: '10m ago',
        hasTimeline: true,
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
        hasTimeline: true,
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
        hasTimeline: true,
    },
    {
        id: 4,
        email: 'scott@scottwilliams.com',
        token: '3a2d0f18',
        status: 'Pending',
        opens: null,
        clicks: null,
        location: null,
        dispatchedAt: '7m ago',
        lastSync: null,
        hasTimeline: false,
    },
    {
        id: 5,
        email: 'justin@justinfreeman.com',
        token: 'c0a7f953',
        status: 'Pending',
        opens: null,
        clicks: null,
        location: null,
        dispatchedAt: '25m ago',
        lastSync: null,
        hasTimeline: false,
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
        hasTimeline: false,
    },
    {
        id: 7,
        email: 'estrada.investments@gmail.com',
        token: '9b30bb87',
        status: 'Pending',
        opens: null,
        clicks: null,
        location: null,
        dispatchedAt: '33m ago',
        lastSync: null,
        hasTimeline: false,
    },
    {
        id: 8,
        email: 'doug@bigproperties.com',
        token: 'ba97c126',
        status: 'Delivered',
        opens: null,
        clicks: null,
        location: null,
        dispatchedAt: '37m ago',
        lastSync: null,
        hasTimeline: false,
    },
    {
        id: 9,
        email: 'dede@mybizipro.com',
        token: 'f0f3c8f9',
        status: 'Pending',
        opens: null,
        clicks: null,
        location: null,
        dispatchedAt: '41m ago',
        lastSync: null,
        hasTimeline: false,
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
        hasTimeline: true,
    },
    {
        id: 11,
        email: 'chris.morrison@compass.com',
        token: 'f4812a13',
        status: 'Confirmed',
        opens: null,
        clicks: { count: 2, label: '2 clicks' },
        location: null,
        dispatchedAt: '48m ago',
        lastSync: '48m ago',
        hasTimeline: true,
    },
    {
        id: 12,
        email: 'carol@carolwolfe.com',
        token: '303c1b4f',
        status: 'Pending',
        opens: null,
        clicks: null,
        location: null,
        dispatchedAt: '52m ago',
        lastSync: null,
        hasTimeline: false,
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
        hasTimeline: true,
    },
    {
        id: 14,
        email: 'amy@widmerhomes.com',
        token: 'a8c1b809',
        status: 'Pending',
        opens: null,
        clicks: null,
        location: null,
        dispatchedAt: '1h ago',
        lastSync: null,
        hasTimeline: false,
    },
    {
        id: 15,
        email: 'alex@agreatyl.com',
        token: 'f1c0c832',
        status: 'Pending',
        opens: null,
        clicks: null,
        location: null,
        dispatchedAt: '1h ago',
        lastSync: null,
        hasTimeline: false,
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
        hasTimeline: false,
    },
    {
        id: 17,
        email: 'marisa@kingsrealtygroup.com',
        token: 'f62a6a12',
        status: 'Confirmed',
        opens: 1,
        clicks: null,
        location: { city: 'Verdes', country: 'United States' },
        dispatchedAt: '1h ago',
        lastSync: '53m ago',
        hasTimeline: false,
    },
    {
        id: 18,
        email: 'playaplay@me.com',
        token: 'a8f1ab85',
        status: 'Confirmed',
        opens: 1,
        clicks: null,
        location: null,
        dispatchedAt: '1h ago',
        lastSync: '58m ago',
        hasTimeline: false,
    },
    {
        id: 19,
        email: 'monica@monicarealty.com',
        token: 'd41a9c07',
        status: 'Pending',
        opens: null,
        clicks: null,
        location: null,
        dispatchedAt: '2h ago',
        lastSync: null,
        hasTimeline: false,
    },
    {
        id: 20,
        email: 'brenda@bkhomes.net',
        token: '8f02cc54',
        status: 'Delivered',
        opens: null,
        clicks: null,
        location: null,
        dispatchedAt: '2h ago',
        lastSync: null,
        hasTimeline: false,
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
        hasTimeline: true,
    },
    {
        id: 22,
        email: 'greg@pacificcoastrealty.com',
        token: 'cc91df72',
        status: 'Pending',
        opens: null,
        clicks: null,
        location: null,
        dispatchedAt: '2h ago',
        lastSync: null,
        hasTimeline: false,
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
        hasTimeline: true,
    },
    {
        id: 24,
        email: 'david@socalestates.com',
        token: 'a203bf19',
        status: 'Pending',
        opens: null,
        clicks: null,
        location: null,
        dispatchedAt: '3h ago',
        lastSync: null,
        hasTimeline: false,
    },
    {
        id: 25,
        email: 'susan@harborhomes.org',
        token: 'f9d81c47',
        status: 'Delivered',
        opens: null,
        clicks: null,
        location: null,
        dispatchedAt: '3h ago',
        lastSync: null,
        hasTimeline: false,
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
        hasTimeline: false,
    },
    {
        id: 27,
        email: 'jessica@jmrealtygroup.com',
        token: '7720cd96',
        status: 'Pending',
        opens: null,
        clicks: null,
        location: null,
        dispatchedAt: '3h ago',
        lastSync: null,
        hasTimeline: false,
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
        hasTimeline: true,
    },
]


// ─── COMPUTED METRICS ───────────────────────────────────────────────────────

const TOTAL_DISPATCHES = DISPATCHES.length
const CONFIRMED_COUNT = DISPATCHES.filter(d => d.status === 'Confirmed').length
const PENDING_COUNT = DISPATCHES.filter(d => d.status === 'Pending').length
const DELIVERY_RATE = TOTAL_DISPATCHES > 0
    ? Math.round((CONFIRMED_COUNT / TOTAL_DISPATCHES) * 100)
    : 0


// ─── JEWEL-TONE STATUS BADGE ────────────────────────────────────────────────

function StatusBadge({ status }) {
    const config = {
        Confirmed: {
            pill: 'bg-emerald-50/80 text-emerald-600 border border-emerald-200/60 shadow-sm shadow-emerald-100/50',
            dot: 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]',
            pulse: true,
        },
        Pending: {
            pill: 'bg-amber-50/80 text-amber-600 border border-amber-200/60 shadow-sm shadow-amber-100/50',
            dot: 'bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.35)]',
            pulse: false,
        },
        Delivered: {
            pill: 'bg-blue-50/80 text-blue-600 border border-blue-200/60 shadow-sm shadow-blue-100/50',
            dot: 'bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.35)]',
            pulse: false,
        },
    }
    const c = config[status] || config.Pending

    return (
        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold leading-none ${c.pill}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${c.dot} ${c.pulse ? 'animate-pulse' : ''}`} />
            {status}
        </span>
    )
}


// ─── HELPER: get initials from email ────────────────────────────────────────

function getInitials(email) {
    const local = email.split('@')[0]
    // If has a dot, take first letter of each part
    if (local.includes('.')) {
        const parts = local.split('.')
        return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    // Otherwise first two letters
    return local.slice(0, 2).toUpperCase()
}


// ═══════════════════════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function Dashboard() {
    const [themeToggle, setThemeToggle] = useState(false)

    return (
        <div className="min-h-screen bg-[#F8FAFC] relative overflow-hidden">

            {/* ════════════════════════════════════════════════════════════════
          TOP NAVIGATION BAR
          ════════════════════════════════════════════════════════════ */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/70">
                <div className="max-w-[1360px] mx-auto px-6 lg:px-8">
                    <div className="flex items-center justify-between h-[60px]">

                        {/* Left: Logo + Brand */}
                        <div className="flex items-center gap-3">
                            <div className="w-[30px] h-[30px] bg-violet-600 rounded-lg flex items-center justify-center shadow-[0_1px_3px_rgba(124,58,237,0.25)]">
                                <span className="text-white text-[13px] font-bold leading-none">T</span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-slate-900 text-[15px] font-bold tracking-[-0.01em]">TICKK</span>
                                <span className="text-slate-400 text-[13px] font-normal">Outbound Audit</span>
                            </div>
                        </div>

                        {/* Right: Controls */}
                        <div className="flex items-center gap-3">

                            {/* Theme toggle */}
                            <button
                                onClick={() => setThemeToggle(!themeToggle)}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors duration-150"
                                aria-label="Toggle theme"
                            >
                                {themeToggle ? <MoonIcon className="w-[18px] h-[18px]" /> : <SunIcon className="w-[18px] h-[18px]" />}
                            </button>

                            {/* Refresh */}
                            <button className="inline-flex items-center gap-1.5 px-3 py-[6px] text-[13px] font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all duration-150 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                                <ArrowPathIcon className="w-3.5 h-3.5 text-slate-400" />
                                Refresh
                            </button>

                            {/* Divider */}
                            <div className="hidden sm:block w-px h-7 bg-slate-200 mx-1" />

                            {/* Workspace */}
                            <div className="hidden sm:flex items-center gap-2.5">
                                <div className="text-right">
                                    <p className="text-[13px] text-slate-700 font-medium leading-tight">Demo Workspace</p>
                                    <p className="text-[11px] text-slate-400 leading-tight flex items-center gap-0.5 justify-end mt-0.5">
                                        <CheckCircleSolidIcon className="w-3 h-3 text-emerald-500" />
                                        Pro Tier
                                    </p>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
                                    <UserIcon className="w-4 h-4 text-slate-400" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>


            {/* ════════════════════════════════════════════════════════════════
          PAGE CONTENT
          ════════════════════════════════════════════════════════════ */}
            {/* ── ATMOSPHERIC BACKGROUND ORBS ─────────────────────────────── */}
            <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
                <div className="absolute -top-[200px] -right-[100px] w-[700px] h-[700px] rounded-full bg-gradient-to-br from-indigo-100 to-purple-50 opacity-60" style={{ filter: 'blur(120px)' }} />
                <div className="absolute top-[40%] -left-[150px] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-blue-100 to-cyan-50 opacity-40" style={{ filter: 'blur(120px)' }} />
                <div className="absolute -bottom-[100px] right-[20%] w-[400px] h-[400px] rounded-full bg-gradient-to-br from-emerald-50 to-teal-50 opacity-50" style={{ filter: 'blur(100px)' }} />
            </div>

            <main className="relative z-10 max-w-[1360px] mx-auto px-6 lg:px-8 py-8">

                {/* ── Header ──────────────────────────────────────────────────── */}
                <div className="mb-8">
                    <h1 className="text-[22px] font-semibold text-slate-900 tracking-[-0.02em]">
                        Outbound Audit Console
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Delivery confirmations and engagement signals for your dispatched emails.
                    </p>
                </div>


                {/* ── METRICS GRID ────────────────────────────────────────────── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">

                    {/* Total Dispatches */}
                    <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,1)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.07)] transition-shadow duration-300">
                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-slate-100 to-slate-50 shadow-sm flex items-center justify-center">
                                <EnvelopeIcon className="w-3.5 h-3.5 text-slate-500" />
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                                Total Dispatches
                            </span>
                        </div>
                        <p className="text-4xl font-bold leading-none tabular-nums tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-slate-900 via-slate-700 to-slate-800">
                            {TOTAL_DISPATCHES}
                        </p>
                    </div>

                    {/* Confirmed */}
                    <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,1)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.07)] transition-shadow duration-300">
                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-100 to-emerald-50 shadow-sm shadow-emerald-100/50 flex items-center justify-center">
                                <CheckBadgeIcon className="w-3.5 h-3.5 text-emerald-600" />
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                                Confirmed
                            </span>
                        </div>
                        <p className="text-4xl font-bold leading-none tabular-nums tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-slate-900 via-slate-700 to-slate-800">
                            {CONFIRMED_COUNT}
                        </p>
                    </div>

                    {/* Pending */}
                    <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,1)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.07)] transition-shadow duration-300">
                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-100 to-amber-50 shadow-sm shadow-amber-100/50 flex items-center justify-center">
                                <ClockIcon className="w-3.5 h-3.5 text-amber-600" />
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                                Pending
                            </span>
                        </div>
                        <p className="text-4xl font-bold leading-none tabular-nums tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-slate-900 via-slate-700 to-slate-800">
                            {PENDING_COUNT}
                        </p>
                    </div>

                    {/* Delivery Rate */}
                    <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,1)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.07)] transition-shadow duration-300">
                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 shadow-sm shadow-blue-100/50 flex items-center justify-center">
                                <ChartBarIcon className="w-3.5 h-3.5 text-blue-600" />
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                                Delivery Rate
                            </span>
                        </div>
                        <p className="text-4xl font-bold leading-none tabular-nums tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-slate-900 via-slate-700 to-slate-800">
                            {DELIVERY_RATE}
                            <span className="text-lg font-normal text-slate-400 ml-0.5 bg-none text-slate-400">%</span>
                        </p>
                    </div>
                </div>


                {/* ── DATA TABLE ──────────────────────────────────────────────── */}
                <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,1)] overflow-hidden">

                    {/* Column Headers */}
                    <div className="grid grid-cols-[1.6fr_0.75fr_0.5fr_0.75fr_0.9fr_0.65fr_0.75fr] gap-3 px-6 py-3.5 border-b border-slate-100/60 bg-slate-50/30">
                        {[
                            'Recipient',
                            'Status',
                            'Opens',
                            'Link Clicks',
                            'Location',
                            'Dispatched At',
                            'Last Audit Sync',
                        ].map((header) => (
                            <span
                                key={header}
                                className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]"
                            >
                                {header}
                            </span>
                        ))}
                    </div>

                    {/* Rows */}
                    <div className="divide-y divide-slate-100/50">
                        {DISPATCHES.map((row, index) => {
                            const palette = AVATAR_PALETTE[index % AVATAR_PALETTE.length]

                            return (
                                <div
                                    key={row.id}
                                    className="grid grid-cols-[1.6fr_0.75fr_0.5fr_0.75fr_0.9fr_0.65fr_0.75fr] gap-3 items-center px-6 py-5 relative hover:bg-white hover:scale-[1.008] hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] hover:z-10 hover:rounded-xl transition-all duration-300 ease-out cursor-pointer"
                                >
                                    {/* ── Recipient ── */}
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className={`w-8 h-8 rounded-full ${palette.bg} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                                            <span className={`text-[10px] font-bold ${palette.text} leading-none`}>
                                                {getInitials(row.email)}
                                            </span>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[13px] font-medium text-slate-800 truncate leading-tight">
                                                {row.email}
                                            </p>
                                            <p className="text-[10px] text-slate-400 font-mono truncate leading-tight mt-0.5">
                                                {row.token} . . .
                                            </p>
                                        </div>
                                    </div>

                                    {/* ── Status ── */}
                                    <div>
                                        <StatusBadge status={row.status} />
                                    </div>

                                    {/* ── Opens ── */}
                                    <div>
                                        {row.opens !== null ? (
                                            <span className="text-[13px] text-slate-700 tabular-nums font-medium">{row.opens}</span>
                                        ) : (
                                            <span className="text-[13px] text-slate-300">—</span>
                                        )}
                                    </div>

                                    {/* ── Link Clicks ── */}
                                    <div>
                                        {row.clicks ? (
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-1">
                                                    <LinkIcon className="w-3 h-3 text-blue-500" />
                                                    <span className="text-[12px] text-blue-600 font-medium">{row.clicks.label}</span>
                                                </div>
                                                {row.hasTimeline && (
                                                    <button className="inline-flex items-center gap-1 px-3 py-1.5 text-[10px] font-semibold text-blue-500 bg-blue-50/40 border border-blue-100/60 hover:bg-blue-50 hover:text-blue-600 hover:shadow-sm hover:shadow-blue-100/50 hover:border-blue-200/60 rounded-lg transition-all duration-200">
                                                        <EyeIcon className="w-3 h-3" />
                                                        View Timeline
                                                    </button>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-[13px] text-slate-300">—</span>
                                        )}
                                    </div>

                                    {/* ── Location ── */}
                                    <div>
                                        {row.location ? (
                                            <div className="flex items-start gap-1.5">
                                                <MapPinIcon className="w-3.5 h-3.5 text-slate-400 mt-[1px] flex-shrink-0" />
                                                <div className="min-w-0">
                                                    <p className="text-[12px] text-slate-600 leading-tight truncate">
                                                        {row.location.city},
                                                    </p>
                                                    <p className="text-[10px] text-slate-400 leading-tight truncate mt-[1px]">
                                                        {row.location.country}
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-[13px] text-slate-300">—</span>
                                        )}
                                    </div>

                                    {/* ── Dispatched At ── */}
                                    <div>
                                        <span className="text-[12px] text-slate-500">{row.dispatchedAt}</span>
                                    </div>

                                    {/* ── Last Audit Sync ── */}
                                    <div>
                                        {row.lastSync ? (
                                            <span className="text-[12px] text-slate-500">{row.lastSync}</span>
                                        ) : (
                                            <span className="text-[12px] text-slate-400 italic">Pending</span>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>


                {/* ── Table Footer ────────────────────────────────────────────── */}
                <div className="flex items-center justify-between mt-5 px-1">
                    <p className="text-[11px] text-slate-400">
                        Showing <span className="font-medium text-slate-500">{DISPATCHES.length}</span> of {DISPATCHES.length} dispatches
                    </p>
                    <p className="text-[11px] text-slate-400">
                        TICKK Systems · v4.2.0
                    </p>
                </div>

            </main>
        </div>
    )
}
