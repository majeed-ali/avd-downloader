"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Activity,
  Users,
  CheckCircle2,
  XCircle,
  PlayCircle,
  Download,
  Percent,
  Layers,
  Globe,
  Clock,
  Search,
  Filter,
  DownloadCloud,
  Trash2,
  Eye,
  RefreshCw,
  LogOut,
  X,
  ExternalLink,
  Laptop,
  Smartphone,
  Tablet,
  Calendar,
  AlertTriangle,
} from "lucide-react";

interface KpiData {
  total: number;
  successCount: number;
  failedCount: number;
  uniqueVisitors: number;
  videoPlays: number;
  downloadClicks: number;
  successRate: number;
  topPlatform: string;
  topCountry: string;
  avgDuration: number;
}

interface ChartData {
  dailyTrend: Array<{ date: string; total: number; success: number; failed: number }>;
  platformDistribution: Array<{ name: string; value: number }>;
  deviceDistribution: Array<{ name: string; value: number }>;
  browserDistribution: Array<{ name: string; value: number }>;
  countries: Array<{ country: string; count: number }>;
  tools: Array<{ name: string; count: number }>;
}

const COLORS = ["#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#6366f1", "#64748b"];

export function AdminDashboard() {
  const router = useRouter();
  const [range, setRange] = useState("30d");
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [kpis, setKpis] = useState<KpiData | null>(null);
  const [charts, setCharts] = useState<ChartData | null>(null);

  // Table state
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoadingTable, setIsLoadingTable] = useState(true);

  // Modal detail
  const [selectedSubmission, setSelectedSubmission] = useState<any | null>(null);
  const [submissionEvents, setSubmissionEvents] = useState<any[]>([]);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  // Cleanup modal
  const [showCleanupModal, setShowCleanupModal] = useState(false);
  const [cleanupDays, setCleanupDays] = useState(90);
  const [isCleaning, setIsCleaning] = useState(false);
  const [cleanupMessage, setCleanupMessage] = useState<string | null>(null);

  // Fetch KPI & Charts
  const fetchStats = useCallback(async () => {
    setIsLoadingStats(true);
    try {
      const res = await fetch(`/api/admin/stats?range=${range}`);
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      setKpis(data.kpis);
      setCharts(data.charts);
    } catch (err) {
      console.error("Failed to load stats", err);
    } finally {
      setIsLoadingStats(false);
    }
  }, [range, router]);

  // Fetch Submissions Table
  const fetchSubmissions = useCallback(async () => {
    setIsLoadingTable(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "15",
        platform: platformFilter,
        status: statusFilter,
        search,
      });

      const res = await fetch(`/api/admin/submissions?${params.toString()}`);
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      setSubmissions(data.records || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalCount(data.pagination?.totalCount || 0);
    } catch (err) {
      console.error("Failed to load submissions", err);
    } finally {
      setIsLoadingTable(false);
    }
  }, [page, platformFilter, statusFilter, search, router]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const handleOpenDetail = async (id: string) => {
    setIsLoadingDetail(true);
    setSelectedSubmission(null);
    setSubmissionEvents([]);

    try {
      const res = await fetch(`/api/admin/submissions/${id}`);
      const data = await res.json();
      setSelectedSubmission(data.submission);
      setSubmissionEvents(data.events || []);
    } catch (err) {
      console.error("Failed to load submission details", err);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleDeleteRecord = async (id: string) => {
    if (!confirm("Are you sure you want to delete this submission record?")) return;

    try {
      await fetch(`/api/admin/submissions/${id}`, { method: "DELETE" });
      if (selectedSubmission?.id === id) setSelectedSubmission(null);
      fetchSubmissions();
      fetchStats();
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  const handleCleanupSubmit = async () => {
    setIsCleaning(true);
    setCleanupMessage(null);
    try {
      const res = await fetch("/api/admin/cleanup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ days: cleanupDays }),
      });
      const data = await res.json();
      setCleanupMessage(data.message || `Deleted ${data.deletedCount} old records.`);
      fetchStats();
      fetchSubmissions();
    } catch {
      setCleanupMessage("Error performing cleanup.");
    } finally {
      setIsCleaning(false);
    }
  };

  const getDeviceIcon = (device: string) => {
    if (device === "mobile") return <Smartphone className="w-3.5 h-3.5 text-blue-400" />;
    if (device === "tablet") return <Tablet className="w-3.5 h-3.5 text-purple-400" />;
    return <Laptop className="w-3.5 h-3.5 text-cyan-400" />;
  };

  return (
    <div className="min-h-screen bg-[#060a14] text-slate-100 p-4 lg:p-8 space-y-8">
      {/* TOP HEADER */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div className="flex items-center gap-4">
          <Image
            src="/AVD-WHITE-VERSION.webp"
            alt="AVD Logo"
            width={160}
            height={46}
            priority
            className="h-8 w-auto"
          />
          <div className="h-6 w-px bg-slate-800" />
          <div className="text-xs font-semibold px-2.5 py-1 rounded-md bg-cyan-950/80 border border-cyan-800/50 text-cyan-300">
            Super Admin Dashboard
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* RANGE SELECTOR */}
          <div className="flex items-center rounded-xl bg-slate-900 border border-slate-800 p-1 text-xs">
            {["today", "yesterday", "7d", "30d", "90d"].map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-colors ${
                  range === r ? "bg-cyan-600 text-white font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                {r === "7d" ? "7 Days" : r === "30d" ? "30 Days" : r === "90d" ? "90 Days" : r}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              fetchStats();
              fetchSubmissions();
            }}
            title="Refresh Data"
            className="p-2.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleLogout}
            title="Log out"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-red-900/40 bg-red-950/20 hover:bg-red-900/40 text-red-300 text-xs font-semibold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* 10 KPI SUMMARY CARDS */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-2xl bg-[#0c1222] border border-slate-800/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Submissions</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white">{kpis?.total.toLocaleString() ?? "–"}</div>
          <p className="text-[11px] text-slate-500">Total submitted links</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0c1222] border border-slate-800/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Unique Visitors</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white">{kpis?.uniqueVisitors.toLocaleString() ?? "–"}</div>
          <p className="text-[11px] text-slate-500">Estimated unique</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0c1222] border border-slate-800/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Successful</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">{kpis?.successCount.toLocaleString() ?? "–"}</div>
          <p className="text-[11px] text-slate-500">Successfully resolved</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0c1222] border border-slate-800/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Failed</span>
            <XCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-rose-400">{kpis?.failedCount.toLocaleString() ?? "–"}</div>
          <p className="text-[11px] text-slate-500">Rejected or upstream error</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0c1222] border border-slate-800/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Success Rate</span>
            <Percent className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white">{kpis?.successRate ?? 0}%</div>
          <p className="text-[11px] text-slate-500">Resolution ratio</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0c1222] border border-slate-800/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Video Plays</span>
            <PlayCircle className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white">{kpis?.videoPlays.toLocaleString() ?? "–"}</div>
          <p className="text-[11px] text-slate-500">Player play events</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0c1222] border border-slate-800/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Download Clicks</span>
            <Download className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white">{kpis?.downloadClicks.toLocaleString() ?? "–"}</div>
          <p className="text-[11px] text-slate-500">Download button clicks</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0c1222] border border-slate-800/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Top Platform</span>
            <Layers className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-lg font-black text-white truncate">{kpis?.topPlatform || "–"}</div>
          <p className="text-[11px] text-slate-500">Most submitted service</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0c1222] border border-slate-800/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Top Country</span>
            <Globe className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-lg font-black text-white">{kpis?.topCountry || "–"}</div>
          <p className="text-[11px] text-slate-500">Most frequent location</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0c1222] border border-slate-800/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Avg Processing</span>
            <Clock className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-lg font-black text-white">{kpis?.avgDuration ? `${kpis.avgDuration}ms` : "–"}</div>
          <p className="text-[11px] text-slate-500">Response latency</p>
        </div>
      </section>

      {/* CHARTS ROW */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SUBMISSION TREND OVER TIME */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#0c1222] border border-slate-800/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-200">Submission Trends ({range})</h3>
            <span className="text-xs text-slate-500">Daily count</span>
          </div>

          <div className="h-64 w-full">
            {charts?.dailyTrend && charts.dailyTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={charts.dailyTrend}>
                  <defs>
                    <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" stroke="#64748b" textAnchor="end" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155" }} />
                  <Area type="monotone" dataKey="total" stroke="#06b6d4" fillOpacity={1} fill="url(#totalGrad)" />
                  <Area type="monotone" dataKey="success" stroke="#10b981" fillOpacity={0} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-500">
                No submissions recorded yet for this period.
              </div>
            )}
          </div>
        </div>

        {/* PLATFORM DISTRIBUTION */}
        <div className="p-6 rounded-3xl bg-[#0c1222] border border-slate-800/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-200">Platforms Breakdown</h3>
            <span className="text-xs text-slate-500">Share %</span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            {charts?.platformDistribution && charts.platformDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.platformDistribution}
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {charts.platformDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155" }} />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-slate-500">No platform events yet.</div>
            )}
          </div>
        </div>
      </section>

      {/* SECOND CHARTS ROW */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* DEVICES */}
        <div className="p-5 rounded-3xl bg-[#0c1222] border border-slate-800/80 shadow-sm space-y-3">
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Visitor Devices</h4>
          <div className="h-44 w-full">
            {charts?.deviceDistribution && charts.deviceDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.deviceDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155" }} />
                  <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-500">No device data.</div>
            )}
          </div>
        </div>

        {/* TOP COUNTRIES */}
        <div className="p-5 rounded-3xl bg-[#0c1222] border border-slate-800/80 shadow-sm space-y-3">
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Top Countries</h4>
          <div className="h-44 w-full">
            {charts?.countries && charts.countries.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.countries.slice(0, 5)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="country" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155" }} />
                  <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-500">No country data.</div>
            )}
          </div>
        </div>

        {/* BROWSERS */}
        <div className="p-5 rounded-3xl bg-[#0c1222] border border-slate-800/80 shadow-sm space-y-3">
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Browsers</h4>
          <div className="h-44 w-full">
            {charts?.browserDistribution && charts.browserDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.browserDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155" }} />
                  <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-500">No browser data.</div>
            )}
          </div>
        </div>
      </section>

      {/* SUBMITTED LINKS TABLE SECTION */}
      <section className="rounded-3xl bg-[#0c1222] border border-slate-800/80 p-6 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white">Centralized Submitted Links</h3>
            <p className="text-xs text-slate-400">
              Real-time audit log of submissions across all downloaders and player ({totalCount.toLocaleString()} total)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* CSV EXPORT */}
            <a
              href={`/api/admin/export-csv?platform=${platformFilter}&status=${statusFilter}`}
              download
              className="px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <DownloadCloud className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export CSV</span>
            </a>

            {/* DATA RETENTION CLEANUP */}
            <button
              onClick={() => setShowCleanupModal(true)}
              className="px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Retention Cleanup</span>
            </button>
          </div>
        </div>

        {/* SEARCH & FILTERS BAR */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by URL or title…"
              className="w-full h-10 pl-9 pr-3 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-cyan-500"
            />
          </div>

          <select
            value={platformFilter}
            onChange={(e) => {
              setPlatformFilter(e.target.value);
              setPage(1);
            }}
            className="h-10 px-3 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-slate-200 outline-none focus:border-cyan-500"
          >
            <option value="all">All Platforms</option>
            <option value="YouTube">YouTube</option>
            <option value="TeraBox">TeraBox</option>
            <option value="Instagram">Instagram</option>
            <option value="Facebook">Facebook</option>
            <option value="Vimeo">Vimeo</option>
            <option value="Dailymotion">Dailymotion</option>
            <option value="Twitch">Twitch</option>
            <option value="Pinterest">Pinterest</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="h-10 px-3 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-slate-200 outline-none focus:border-cyan-500"
          >
            <option value="all">All Statuses</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
            <option value="processing">Processing</option>
          </select>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Date/Time (UTC)</th>
                <th className="py-3.5 px-4">Platform</th>
                <th className="py-3.5 px-4">Video Link</th>
                <th className="py-3.5 px-4">Country</th>
                <th className="py-3.5 px-4">IP Address</th>
                <th className="py-3.5 px-4">Device</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {isLoadingTable ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    Loading records…
                  </td>
                </tr>
              ) : submissions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No matching submission records found.
                  </td>
                </tr>
              ) : (
                submissions.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                      {new Date(row.created_at).toISOString().replace("T", " ").slice(0, 19)}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                        {row.platform}
                      </span>
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate">
                      <span className="text-slate-200" title={row.original_url}>
                        {row.video_title ? (
                          <span className="font-medium text-white">{row.video_title}</span>
                        ) : (
                          row.original_url
                        )}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-slate-300">
                      {row.country || "–"} {row.city && row.city !== "Unknown" ? `(${row.city})` : ""}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                      {row.ip_address || "–"}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        {getDeviceIcon(row.device_type)}
                        <span className="capitalize">{row.device_type}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {row.status === "success" ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Success
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-400 font-semibold">
                          <XCircle className="w-3.5 h-3.5" /> Failed
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenDetail(row.id)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDeleteRecord(row.id)}
                          className="p-1 rounded-lg hover:bg-red-950/50 text-slate-500 hover:text-red-400 transition-colors"
                          title="Delete record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
          <div>
            Showing Page <span className="text-white font-bold">{page}</span> of{" "}
            <span className="text-white font-bold">{totalPages}</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </section>

      {/* VIEW DETAILS MODAL */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0c1222] border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6">
            <button
              onClick={() => setSelectedSubmission(null)}
              className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-950 text-cyan-300 uppercase">
                  {selectedSubmission.platform}
                </span>
                <span
                  className={`text-xs font-bold ${
                    selectedSubmission.status === "success" ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  Status: {selectedSubmission.status.toUpperCase()}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white">
                {selectedSubmission.video_title || "Submission Details"}
              </h3>
            </div>

            {/* VIDEO PLAYER PREVIEW IF APPLICABLE */}
            {selectedSubmission.platform === "YouTube" && (
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${getYouTubeVideoId(selectedSubmission.original_url)}`}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            {/* VISITOR & SUBMISSION METADATA GRIDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">Submission Info</h4>
                <div>
                  <span className="text-slate-500">Original URL: </span>
                  <a
                    href={selectedSubmission.original_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:underline break-all"
                  >
                    {selectedSubmission.original_url} <ExternalLink className="w-3 h-3 inline" />
                  </a>
                </div>
                <div>
                  <span className="text-slate-500">Tool: </span>
                  <span className="text-slate-200">{selectedSubmission.tool}</span>
                </div>
                <div>
                  <span className="text-slate-500">Duration: </span>
                  <span className="text-slate-200">{selectedSubmission.processing_duration_ms}ms</span>
                </div>
                <div>
                  <span className="text-slate-500">Date (UTC): </span>
                  <span className="text-slate-200">
                    {new Date(selectedSubmission.created_at).toUTCString()}
                  </span>
                </div>
                {selectedSubmission.error_message && (
                  <div>
                    <span className="text-rose-400 font-semibold">Error: </span>
                    <span className="text-rose-300">{selectedSubmission.error_message}</span>
                  </div>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">Visitor Info</h4>
                <div>
                  <span className="text-slate-500">IP Address: </span>
                  <span className="text-slate-200 font-mono">{selectedSubmission.ip_address}</span>
                </div>
                <div>
                  <span className="text-slate-500">Location: </span>
                  <span className="text-slate-200">
                    {selectedSubmission.city}, {selectedSubmission.region}, {selectedSubmission.country}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Device / OS: </span>
                  <span className="text-slate-200 capitalize">
                    {selectedSubmission.device_type} • {selectedSubmission.os}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Browser: </span>
                  <span className="text-slate-200">
                    {selectedSubmission.browser} {selectedSubmission.browser_version}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Locale: </span>
                  <span className="text-slate-200">{selectedSubmission.locale}</span>
                </div>
              </div>
            </div>

            {/* INTERACTION TIMELINE */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                Interaction History ({submissionEvents.length} events)
              </h4>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span>Submission created</span>
                  <span className="ml-auto font-mono text-[11px]">
                    {new Date(selectedSubmission.created_at).toLocaleTimeString()}
                  </span>
                </div>
                {submissionEvents.map((evt) => (
                  <div key={evt.id} className="flex items-center gap-2 text-slate-300">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        evt.event_type === "download_clicked" ? "bg-emerald-400" : "bg-purple-400"
                      }`}
                    />
                    <span className="font-semibold capitalize">{evt.event_type.replace("_", " ")}</span>
                    <span className="ml-auto font-mono text-[11px]">
                      {new Date(evt.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CLEANUP MODAL */}
      {showCleanupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-3xl bg-[#0c1222] border border-slate-800 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                Data Retention Cleanup
              </h3>
              <button onClick={() => setShowCleanupModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Permanently purge analytics submissions and interaction events older than the specified retention threshold.
            </p>

            {cleanupMessage && (
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-cyan-300">
                {cleanupMessage}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">Delete records older than:</label>
              <select
                value={cleanupDays}
                onChange={(e) => setCleanupDays(parseInt(e.target.value, 10))}
                className="w-full h-11 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none"
              >
                <option value={30}>30 Days</option>
                <option value={60}>60 Days</option>
                <option value={90}>90 Days</option>
                <option value={180}>180 Days</option>
                <option value={365}>1 Year</option>
              </select>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCleanupModal(false)}
                className="flex-1 h-11 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCleanupSubmit}
                disabled={isCleaning}
                className="flex-1 h-11 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-600/20 disabled:opacity-50"
              >
                {isCleaning ? "Cleaning…" : "Confirm Purge"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getYouTubeVideoId(urlStr: string): string {
  try {
    const url = new URL(urlStr);
    if (url.hostname.includes("youtu.be")) {
      return url.pathname.slice(1);
    }
    return url.searchParams.get("v") || "";
  } catch {
    return "";
  }
}
