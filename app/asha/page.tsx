"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Home, ScanLine, Salad, Users, ArrowLeft, Activity, AlertTriangle, CheckCircle, TrendingUp, MapPin, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Risk = "LOW" | "MODERATE" | "HIGH";
interface Scan {
  id: string;
  created_at: string;
  risk: Risk;
  confidence: number;
  hemoglobin: number;
  message: string;
  location: string;
}

export default function AshaPage() {
  const router = useRouter();
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"dashboard" | "scan">("dashboard");
  const [refreshing, setRefreshing] = useState(false);

  const loadScans = async () => {
    setRefreshing(true);
    const { data, error } = await supabase
      .from("scans")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    if (!error && data) setScans(data as Scan[]);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    loadScans();
    const channel = supabase
      .channel("scans-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "scans" }, (payload) => {
        setScans((prev) => [payload.new as Scan, ...prev]);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const total = scans.length;
  const highRisk = scans.filter(s => s.risk === "HIGH").length;
  const moderateRisk = scans.filter(s => s.risk === "MODERATE").length;
  const lowRisk = scans.filter(s => s.risk === "LOW").length;
  const todayScans = scans.filter(s => new Date(s.created_at).toDateString() === new Date().toDateString()).length;

  const riskColor = (r: Risk) => r === "LOW" ? "#06D6A0" : r === "MODERATE" ? "#FF9F1C" : "#FF2D4E";
  const riskBg = (r: Risk) => r === "LOW" ? "rgba(6,214,160,0.12)" : r === "MODERATE" ? "rgba(255,159,28,0.12)" : "rgba(255,45,78,0.12)";
  const riskLabel = (r: Risk) => r === "LOW" ? "Low Risk" : r === "MODERATE" ? "Moderate" : "High Risk";

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const nav = [
    { icon: <Home size={22} />, label: "Home", path: "/", active: false },
    { icon: <ScanLine size={22} />, label: "Scan", path: "/scan", active: false },
    { icon: <Salad size={22} />, label: "Diet", path: "/thali", active: false },
    { icon: <Users size={22} />, label: "ASHA", path: "/asha", active: true },
  ];

  return (
    <div style={{ minHeight: "100vh", maxWidth: "430px", margin: "0 auto", background: "#0D0305", overflowY: "auto", overflowX: "hidden", paddingBottom: "100px" }}>
      <div style={{ position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(255,45,78,0.07), transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 24px 8px", position: "relative", zIndex: 10 }}>
        <motion.button onClick={() => router.push("/")} whileTap={{ scale: 0.9 }}
          style={{ width: "40px", height: "40px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <ArrowLeft size={18} color="white" />
        </motion.button>
        <div>
          <p style={{ fontFamily: "Georgia, serif", fontSize: "18px", fontWeight: 700, color: "white", textAlign: "center" }}>ASHA Dashboard</p>
          <p style={{ color: "#C9A0A8", fontSize: "11px", textAlign: "center" }}>Village health worker view</p>
        </div>
        <motion.button onClick={loadScans} whileTap={{ scale: 0.9 }}
          style={{ width: "40px", height: "40px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <motion.div animate={refreshing ? { rotate: 360 } : { rotate: 0 }} transition={{ duration: 0.6, repeat: refreshing ? Infinity : 0, ease: "linear" }}>
            <RefreshCw size={16} color="white" />
          </motion.div>
        </motion.button>
      </motion.div>

      {/* Tab Toggle */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        style={{ margin: "8px 24px 16px", background: "#1C0A0E", border: "1px solid rgba(255,45,78,0.15)", borderRadius: "14px", padding: "4px", display: "grid", gridTemplateColumns: "1fr 1fr", position: "relative", zIndex: 10 }}>
        {(["dashboard", "scan"] as const).map((tab) => (
          <motion.button key={tab} onClick={() => setActiveTab(tab)} whileTap={{ scale: 0.97 }}
            style={{ padding: "10px", borderRadius: "10px", border: "none", background: activeTab === tab ? "rgba(255,45,78,0.2)" : "transparent", color: activeTab === tab ? "#FF2D4E" : "#C9A0A8", fontSize: "13px", fontWeight: 700, cursor: "pointer", textTransform: "capitalize" }}>
            {tab === "dashboard" ? "📊 Dashboard" : "🔍 New Scan"}
          </motion.button>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        {activeTab === "dashboard" ? (
          <motion.div key="dashboard" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>

            {/* Stats Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", padding: "0 24px 16px", position: "relative", zIndex: 10 }}>
              {[
                { label: "Total Scans", value: total, icon: <Activity size={18} color="#FFD166" />, color: "#FFD166", bg: "rgba(255,209,102,0.1)" },
                { label: "Today", value: todayScans, icon: <TrendingUp size={18} color="#06D6A0" />, color: "#06D6A0", bg: "rgba(6,214,160,0.1)" },
                { label: "High Risk", value: highRisk, icon: <AlertTriangle size={18} color="#FF2D4E" />, color: "#FF2D4E", bg: "rgba(255,45,78,0.1)" },
                { label: "Low Risk", value: lowRisk, icon: <CheckCircle size={18} color="#06D6A0" />, color: "#06D6A0", bg: "rgba(6,214,160,0.1)" },
              ].map((stat, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  style={{ background: "#1C0A0E", border: `1px solid ${stat.color}25`, borderRadius: "16px", padding: "16px", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: `linear-gradient(to right, transparent, ${stat.color}60, transparent)` }} />
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                    <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: stat.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>{stat.icon}</div>
                  </div>
                  <div style={{ fontSize: "28px", fontWeight: 900, color: stat.color, fontFamily: "Georgia, serif", lineHeight: 1 }}>{stat.value}</div>
                  <div style={{ fontSize: "11px", color: "#C9A0A8", marginTop: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Risk Distribution Bar */}
            {total > 0 && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                style={{ margin: "0 24px 16px", background: "#1C0A0E", border: "1px solid rgba(255,45,78,0.12)", borderRadius: "16px", padding: "16px", position: "relative", zIndex: 10 }}>
                <p style={{ color: "#C9A0A8", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "12px" }}>Risk Distribution</p>
                <div style={{ display: "flex", height: "12px", borderRadius: "6px", overflow: "hidden", gap: "2px" }}>
                  {highRisk > 0 && <motion.div initial={{ width: 0 }} animate={{ width: `${(highRisk / total) * 100}%` }} transition={{ duration: 0.8, delay: 0.4 }} style={{ background: "#FF2D4E", borderRadius: "6px 0 0 6px" }} />}
                  {moderateRisk > 0 && <motion.div initial={{ width: 0 }} animate={{ width: `${(moderateRisk / total) * 100}%` }} transition={{ duration: 0.8, delay: 0.5 }} style={{ background: "#FF9F1C" }} />}
                  {lowRisk > 0 && <motion.div initial={{ width: 0 }} animate={{ width: `${(lowRisk / total) * 100}%` }} transition={{ duration: 0.8, delay: 0.6 }} style={{ background: "#06D6A0", borderRadius: "0 6px 6px 0" }} />}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                  {[{ label: "High", count: highRisk, color: "#FF2D4E" }, { label: "Moderate", count: moderateRisk, color: "#FF9F1C" }, { label: "Low", count: lowRisk, color: "#06D6A0" }].map((r) => (
                    <div key={r.label} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                      <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: r.color }} />
                      <span style={{ color: "#C9A0A8", fontSize: "11px" }}>{r.label}: <span style={{ color: r.color, fontWeight: 700 }}>{r.count}</span></span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Recent Scans */}
            <div style={{ padding: "0 24px", position: "relative", zIndex: 10 }}>
              <p style={{ color: "#C9A0A8", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "12px" }}>Recent Scans</p>
              {loading ? (
                <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
                  <motion.div style={{ width: "32px", height: "32px", border: "3px solid rgba(255,45,78,0.2)", borderTop: "3px solid #FF2D4E", borderRadius: "50%" }}
                    animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
                </div>
              ) : scans.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{ textAlign: "center", padding: "40px 0", color: "#C9A0A8" }}>
                  <p style={{ fontSize: "32px", marginBottom: "12px" }}>🔍</p>
                  <p style={{ fontSize: "14px" }}>No scans yet.</p>
                  <p style={{ fontSize: "12px", marginTop: "6px" }}>Start scanning to see data here.</p>
                </motion.div>
              ) : (
                scans.slice(0, 10).map((scan, i) => (
                  <motion.div key={scan.id}
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    style={{ background: "#1C0A0E", border: `1px solid ${riskColor(scan.risk)}25`, borderRadius: "14px", padding: "12px 14px", marginBottom: "8px", display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: riskBg(scan.risk), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {scan.risk === "HIGH" ? <AlertTriangle size={18} color="#FF2D4E" /> : scan.risk === "MODERATE" ? <Activity size={18} color="#FF9F1C" /> : <CheckCircle size={18} color="#06D6A0" />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2px" }}>
                        <span style={{ color: riskColor(scan.risk), fontSize: "13px", fontWeight: 700 }}>{riskLabel(scan.risk)}</span>
                        <span style={{ color: "#C9A0A8", fontSize: "10px" }}>{timeAgo(scan.created_at)}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ color: "#C9A0A8", fontSize: "11px" }}>Hb: <span style={{ color: "white", fontWeight: 600 }}>{scan.hemoglobin} g/dL</span></span>
                        <span style={{ color: "#C9A0A8", fontSize: "11px" }}>·</span>
                        <span style={{ color: "#C9A0A8", fontSize: "11px" }}>{scan.confidence}% confidence</span>
                      </div>
                      {scan.location && (
                        <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
                          <MapPin size={9} color="#C9A0A8" />
                          <span style={{ color: "#C9A0A8", fontSize: "10px" }}>{scan.location}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>

          </motion.div>
        ) : (
          <motion.div key="newscan" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            style={{ padding: "0 24px", position: "relative", zIndex: 10 }}>
            <div style={{ background: "#1C0A0E", border: "1px solid rgba(255,45,78,0.15)", borderRadius: "20px", padding: "32px 24px", textAlign: "center" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>👁️</div>
              <p style={{ fontFamily: "Georgia, serif", fontSize: "20px", fontWeight: 700, color: "white", marginBottom: "8px" }}>Start Village Scan</p>
              <p style={{ color: "#C9A0A8", fontSize: "13px", lineHeight: 1.6, marginBottom: "24px" }}>
                Use AnaemiaAI to screen women in your village. Each scan takes only 10 seconds and results are saved to the dashboard automatically.
              </p>
              <motion.button onClick={() => router.push("/scan")} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", background: "linear-gradient(135deg, #C41230, #FF2D4E)", color: "white", fontWeight: 700, fontSize: "15px", padding: "18px 32px", borderRadius: "16px", border: "none", cursor: "pointer", boxShadow: "0 0 30px rgba(255,45,78,0.35)", width: "100%" }}>
                <ScanLine size={18} />
                Open Eye Scanner
              </motion.button>
            </div>

            {/* Today Summary */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              style={{ marginTop: "16px", background: "#1C0A0E", border: "1px solid rgba(255,209,102,0.15)", borderRadius: "16px", padding: "16px" }}>
              <p style={{ color: "#FFD166", fontSize: "13px", fontWeight: 700, marginBottom: "12px" }}>📅 Today's Summary</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                {[
                  { label: "Scanned", value: todayScans, color: "#FFD166" },
                  { label: "High Risk", value: scans.filter(s => s.risk === "HIGH" && new Date(s.created_at).toDateString() === new Date().toDateString()).length, color: "#FF2D4E" },
                  { label: "Safe", value: scans.filter(s => s.risk === "LOW" && new Date(s.created_at).toDateString() === new Date().toDateString()).length, color: "#06D6A0" },
                ].map((s, i) => (
                  <div key={i} style={{ textAlign: "center", background: "rgba(255,255,255,0.03)", borderRadius: "12px", padding: "12px 8px" }}>
                    <div style={{ fontSize: "22px", fontWeight: 900, color: s.color, fontFamily: "Georgia, serif" }}>{s.value}</div>
                    <div style={{ fontSize: "10px", color: "#C9A0A8", marginTop: "2px" }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <nav style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: "430px", background: "rgba(13,3,5,0.95)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,45,78,0.12)", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", zIndex: 50, paddingBottom: "16px", paddingTop: "8px" }}>
        {nav.map((item, i) => (
          <motion.button key={i} onClick={() => router.push(item.path)} whileTap={{ scale: 0.88 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px", fontSize: "10px", fontWeight: 500, color: item.active ? "#FFD166" : "#C9A0A8", background: "transparent", border: "none", cursor: "pointer", paddingTop: "4px" }}>
            <div style={{ padding: "6px", borderRadius: "12px", background: item.active ? "rgba(255,209,102,0.15)" : "transparent" }}>{item.icon}</div>
            {item.label}
          </motion.button>
        ))}
      </nav>
    </div>
  );
}
