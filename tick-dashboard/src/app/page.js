export default function DashboardPage() {
    const dispatches = [
        {
            id: 1,
            recipient: "elon@tesla.com",
            status: "Confirmed",
            opens: 3,
            clicks: 1,
            location: "Austin, US",
        },
        {
            id: 2,
            recipient: "sundar@google.com",
            status: "Confirmed",
            opens: 7,
            clicks: 2,
            location: "Mountain View, US",
        },
        {
            id: 3,
            recipient: "satya@microsoft.com",
            status: "Pending",
            opens: 0,
            clicks: 0,
            location: "Redmond, US",
        },
        {
            id: 4,
            recipient: "tim@apple.com",
            status: "Confirmed",
            opens: 12,
            clicks: 4,
            location: "Cupertino, US",
        },
        {
            id: 5,
            recipient: "jeff@amazon.com",
            status: "Confirmed",
            opens: 5,
            clicks: 0,
            location: "Seattle, US",
        },
    ];

    const activityBars = [
        40, 65, 30, 80, 55, 90, 45, 70, 35, 85, 60, 95,
        50, 75, 40, 88, 55, 70, 45, 92, 60, 78, 35, 85,
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans antialiased selection:bg-zinc-800">
            {/* Navigation */}
            <header className="border-b border-zinc-900/80 sticky top-0 bg-[#050505]/90 backdrop-blur-sm z-50">
                <div className="max-w-7xl mx-auto px-8 h-14 flex items-center justify-between">
                    <div className="text-sm font-semibold tracking-tight text-white">
                        TICKK
                    </div>

                    <nav className="flex items-center gap-8">
                        <a
                            href="#"
                            className="text-xs text-zinc-500 hover:text-white transition-colors duration-200"
                        >
                            Overview
                        </a>
                        <a href="#" className="text-xs text-white">
                            Emails
                        </a>
                        <a
                            href="#"
                            className="text-xs text-zinc-500 hover:text-white transition-colors duration-200"
                        >
                            Webhooks
                        </a>
                    </nav>

                    <div className="flex items-center gap-4">
                        <button className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors duration-200">
                            Refresh
                        </button>
                        <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700" />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-8 py-16 space-y-16">
                {/* Metrics Grid */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    <div>
                        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 mb-3">
                            Total Dispatches
                        </p>
                        <p className="text-6xl font-extralight text-zinc-100 tracking-tight">
                            2,847
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 mb-3">
                            Confirmed
                        </p>
                        <p className="text-6xl font-extralight text-zinc-100 tracking-tight">
                            2,631
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 mb-3">
                            Pending
                        </p>
                        <p className="text-6xl font-extralight text-zinc-100 tracking-tight">
                            216
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 mb-3">
                            Delivery Rate
                        </p>
                        <p className="text-6xl font-extralight text-zinc-100 tracking-tight">
                            92.4%
                        </p>
                    </div>
                </section>

                {/* Activity Trend */}
                <section>
                    <div className="flex items-end gap-[3px] h-32 mb-3">
                        {activityBars.map((height, i) => (
                            <div
                                key={i}
                                className="flex-1 bg-zinc-800 rounded-sm hover:bg-zinc-700 transition-colors duration-200"
                                style={{ height: `${height}%` }}
                            />
                        ))}
                    </div>
                    <div className="flex justify-between text-[10px] font-mono text-zinc-600 tracking-wider">
                        <span>00:00</span>
                        <span>06:00</span>
                        <span>12:00</span>
                        <span>18:00</span>
                        <span>23:59</span>
                    </div>
                </section>

                {/* Utility Bar */}
                <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="relative w-full sm:w-80">
                        <input
                            type="text"
                            placeholder="Search dispatches..."
                            className="w-full bg-zinc-900/30 border border-zinc-800 rounded-md px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-700 transition-colors duration-200"
                        />
                    </div>
                    <div className="flex items-center gap-1">
                        <button className="px-4 py-2 text-xs text-white bg-zinc-800 rounded-md hover:bg-zinc-700 transition-colors duration-200">
                            All
                        </button>
                        <button className="px-4 py-2 text-xs text-zinc-500 hover:text-white transition-colors duration-200">
                            Confirmed
                        </button>
                        <button className="px-4 py-2 text-xs text-zinc-500 hover:text-white transition-colors duration-200">
                            Pending
                        </button>
                    </div>
                </section>

                {/* Ledger Table */}
                <section className="overflow-x-auto">
                    <table className="w-full min-w-[640px]">
                        <thead>
                            <tr className="text-left">
                                <th className="text-[10px] font-mono uppercase text-zinc-600 pb-4 tracking-wider">
                                    Recipient
                                </th>
                                <th className="text-[10px] font-mono uppercase text-zinc-600 pb-4 tracking-wider">
                                    Status
                                </th>
                                <th className="text-[10px] font-mono uppercase text-zinc-600 pb-4 tracking-wider">
                                    Opens
                                </th>
                                <th className="text-[10px] font-mono uppercase text-zinc-600 pb-4 tracking-wider">
                                    Clicks
                                </th>
                                <th className="text-[10px] font-mono uppercase text-zinc-600 pb-4 tracking-wider text-right">
                                    Location
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {dispatches.map((item) => (
                                <tr
                                    key={item.id}
                                    className="border-b border-zinc-900/50 group hover:bg-zinc-900/20 transition-colors duration-200"
                                >
                                    <td className="py-7 text-sm text-zinc-300 group-hover:text-white transition-colors duration-200">
                                        {item.recipient}
                                    </td>
                                    <td className="py-7">
                                        <span
                                            className={`text-xs ${item.status === "Confirmed"
                                                ? "text-zinc-400"
                                                : "text-zinc-500"
                                                }`}
                                        >
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="py-7 text-sm text-zinc-500 font-mono">
                                        {item.opens}
                                    </td>
                                    <td className="py-7 text-sm text-zinc-500 font-mono">
                                        {item.clicks}
                                    </td>
                                    <td className="py-7 text-sm text-zinc-500 text-right">
                                        {item.location}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            </main>
        </div>
    );
}