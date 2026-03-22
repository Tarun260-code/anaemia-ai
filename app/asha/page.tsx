"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Home, ScanLine, Salad, Users, ArrowLeft, Phone } from "lucide-react";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Scan {
  id: string;
  created_at: string;
  risk: string;
  confidence: number;
  hemoglobin: number;
  location?: string;
}

interface Stats { total: number; high: number; moderate: number; low: number; }

export default function AshaPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"dashboard" | "scan">("dashboard");
  const [scans, setScans] = useState<Scan[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, high: 0, moderate: 0, low: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: scanData } = await supabase
        .from('scans')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (scanData) {
        setScans(scanData);
        setStats({
          total: scanData.length,
          high: scanData.filter(s => s.risk === 'HIGH').length,
          moderate: scanData.filter(s => s.risk === 'MODERATE').length,
          low: scanData.filter(s => s.risk === 'LOW').length,
        });
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const riskColors: Record<string, string> = { HIGH: "#FF2D4E", MODERATE: "#FF9F1C", LOW: "#06D6A0" };

  const nav = [
    { icon: <Home size={22} />, label: "Home", path: "/", active: false },
    { icon: <ScanLine size={22} />, label: "Scan", path: "/scan", active: false },
    { icon: <Salad size={22} />, label: "Diet", path: "/thali", active: false },
    { icon: <Users size={22} />, label: "ASHA", path: "/asha", active: true },
  ];

  const formatTime = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div style={{ minHeight: "100vh", maxWidth: "430px", margin: "0 auto", background: "#0D0305", overflowY: "auto", overflowX: "hidden", paddingBottom: "100px" }}>
      <div style={{ position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(255,209,102,0.07), transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 24px 8px", position: "relative", zIndex: 10 }}>
        <motion.button onClick={() => router.push("/")} whileTap={{ scale: 0.9 }}
          style={{ width: "40px", height: "40px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <ArrowLeft size={18} color="white" />
        </motion.button>
        <div>
          <p style={{ fontFamily: "Georgia, serif", fontSize: "18px", fontWeight: 700, color: "white", textAlign: "center" }}>ASHA Dashboard</p>
          <p style={{ color: "#C9A0A8", fontSize: "11px", textAlign: "center" }}>Kanchipuram District</p>
        </div>
        <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg, #C41230, #FF2D4E)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "white", fontSize: "14px", fontWeight: 700 }}>KV</span>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        style={{ margin: "8px 24px 16px", background: "#1C0A0E", borderRadius: "16px", padding: "4px", display: "grid", gridTemplateColumns: "1fr 1fr", position: "relative", zIndex: 10 }}>
        {["dashboard", "scan"].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab as "dashboard" | "scan")}
            style={{ padding: "10px", borderRadius: "12px", background: activeTab === tab ? "linear-gradient(135deg, #C41230, #FF2D4E)" : "transparent", color: activeTab === tab ? "white" : "#C9A0A8", fontSize: "13px", fontWeight: 600, border: "none", cursor: "pointer" }}>
            {tab === "dashboard" ? "Dashboard" : "New Scan"}
          </button>
        ))}
      </motion.div>

      {activeTab === "dashboard" && (
        <>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", padding: "0 24px 16px", position: "relative", zIndex: 10 }}>
            <div style={{ background: "#1C0A0E", border: "1px solid rgba(255,209,102,0.2)", borderRadius: "16px", padding: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <Users size={16} color="#C9A0A8" />
                <span style={{ color: "#C9A0A8", fontSize: "12px" }}>Total Scanned</span>
              </div>
              <div style={{ color: "white", fontSize: "32px", fontWeight: 900, fontFamily: "Georgia, serif" }}>
                {loading ? "..." : stats.total}
              </div>
              <div style={{ color: "#06D6A0", fontSize: "11px", marginTop: "4px" }}>Real-time data</div>
            </div>
            <div style={{ background: "#1C0A0E", border: "1px solid rgba(255,45,78,0.2)", borderRadius: "16px", padding: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <span style={{ color: "#FF2D4E", fontSize: "16px", fontWeight: 700 }}>!</span>
                <span style={{ color: "#C9A0A8", fontSize: "12px" }}>High Risk</span>
              </div>
              <div style={{ color: "#FF2D4E", fontSize: "32px", fontWeight: 900, fontFamily: "Georgia, serif" }}>
                {loading ? "..." : stats.high}
              </div>
              <div style={{ color: "#C9A0A8", fontSize: "11px", marginTop: "4px" }}>Need immediate care</div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            style={{ margin: "0 24px 16px", background: "#1C0A0E", border: "1px solid rgba(255,45,78,0.12)", borderRadius: "16px", padding: "16px", position: "relative", zIndex: 10 }}>
            <div style={{ color: "white", fontSize: "14px", fontWeight: 600, marginBottom: "12px" }}>Risk Distribution</div>
            <div style={{ height: "10px", borderRadius: "5px", overflow: "hidden", display: "flex", marginBottom: "10px" }}>
              {stats.total > 0 && (
                <>
                  <div style={{ height: "100%", background: "#FF2D4E", width: `${(stats.high / stats.total) * 100}%`, transition: "width 1s ease" }} />
                  <div style={{ height: "100%", background: "#FF9F1C", width: `${(stats.moderate / stats.total) * 100}%`, transition: "width 1s ease" }} />
                  <div style={{ height: "100%", background: "#06D6A0", width: `${(stats.low / stats.total) * 100}%`, transition: "width 1s ease" }} />
                </>
              )}
              {stats.total === 0 && <div style={{ height: "100%", background: "rgba(255,255,255,0.1)", width: "100%" }} />}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {[{ color: "#FF2D4E", label: `High (${stats.high})` }, { color: "#FF9F1C", label: `Medium (${stats.moderate})` }, { color: "#06D6A0", label: `Low (${stats.low})` }].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: item.color }} />
                  <span style={{ color: "#C9A0A8", fontSize: "11px" }}>{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <div style={{ padding: "0 24px", position: "relative", zIndex: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span style={{ color: "white", fontSize: "15px", fontWeight: 600 }}>Recent Scans</span>
              <motion.button onClick={loadData} whileTap={{ scale: 0.9 }}
                style={{ color: "#FF2D4E", fontSize: "12px", fontWeight: 600, background: "transparent", border: "none", cursor: "pointer" }}>
                Refresh
              </motion.button>
            </div>

            {loading && (
              <div style={{ display: "flex", justifyContent: "center", padding: "24px" }}>
                <motion.div style={{ width: "30px", height: "30px", border: "3px solid rgba(255,45,78,0.3)", borderTop: "3px solid #FF2D4E", borderRadius: "50%" }}
                  animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
              </div>
            )}

            {!loading && scans.length === 0 && (
              <div style={{ textAlign: "center", padding: "32px 24px", background: "#1C0A0E", borderRadius: "16px", border: "1px solid rgba(255,45,78,0.1)" }}>
                <p style={{ color: "#C9A0A8", fontSize: "14px" }}>No scans yet</p>
                <p style={{ color: "#C9A0A8", fontSize: "12px", marginTop: "4px" }}>Start scanning women in your village!</p>
              </div>
            )}

            {!loading && scans.map((scan, i) => (
              <motion.div key={scan.id}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}
                style={{ background: "#1C0A0E", border: "1px solid rgba(255,45,78,0.1)", borderRadius: "14px", padding: "12px 14px", marginBottom: "10px", display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: `${riskColors[scan.risk] || "#FF2D4E"}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ color: riskColors[scan.risk] || "#FF2D4E", fontSize: "14px", fontWeight: 700 }}>S</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "white", fontSize: "13px", fontWeight: 600 }}>Scan #{i + 1}</span>
                    <span style={{ background: `${riskColors[scan.risk] || "#FF2D4E"}20`, color: riskColors[scan.risk] || "#FF2D4E", fontSize: "10px", fontWeight: 700, padding: "3px 8px", borderRadius: "8px" }}>{scan.risk}</span>
                  </div>
                  <div style={{ color: "#C9A0A8", fontSize: "11px", marginTop: "2px" }}>
                    Hb: {scan.hemoglobin} g/dL - {formatTime(scan.created_at)}
                  </div>
                </div>
                <motion.button whileTap={{ scale: 0.9 }}
                  style={{ width: "32px", height: "32px", borderRadius: "50%", background: "rgba(255,45,78,0.1)", border: "1px solid rgba(255,45,78,0.2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                  <Phone size={14} color="#FF2D4E" />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {activeTab === "scan" && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ padding: "0 24px", position: "relative", zIndex: 10 }}>
          <div style={{ background: "#1C0A0E", border: "1px solid rgba(255,45,78,0.15)", borderRadius: "20px", padding: "24px", textAlign: "center" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(255,45,78,0.15)", border: "1px solid rgba(255,45,78,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Users size={28} color="#FF2D4E" />
            </div>
            <h3 style={{ color: "white", fontSize: "18px", fontWeight: 700, fontFamily: "Georgia, serif", marginBottom: "8px" }}>Village Screening Mode</h3>
            <p style={{ color: "#C9A0A8", fontSize: "13px", lineHeight: 1.6, marginBottom: "20px" }}>Screen multiple women in your village. Each scan takes only 10 seconds.</p>
            <motion.button onClick={() => router.push("/scan")} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              style={{ width: "100%", background: "linear-gradient(135deg, #C41230, #FF2D4E)", color: "white", fontWeight: 700, fontSize: "16px", padding: "16px", borderRadius: "16px", border: "none", cursor: "pointer", boxShadow: "0 0 30px rgba(255,45,78,0.35)" }}>
              Start New Scan
            </motion.button>
          </div>

          <div style={{ marginTop: "16px", background: "rgba(6,214,160,0.05)", border: "1px solid rgba(6,214,160,0.2)", borderRadius: "16px", padding: "16px" }}>
            <div style={{ color: "#06D6A0", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "12px" }}>Live Stats</div>
            {[
              { label: "Total Scanned", value: stats.total.toString() },
              { label: "High Risk Found", value: stats.high.toString() },
              { label: "Low Risk", value: stats.low.toString() },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: i < 2 ? "10px" : 0 }}>
                <span style={{ color: "#C9A0A8", fontSize: "13px" }}>{item.label}</span>
                <span style={{ color: "white", fontSize: "14px", fontWeight: 700 }}>{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

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
