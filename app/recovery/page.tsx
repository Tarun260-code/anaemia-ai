"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Home, ScanLine, Salad, Users, TrendingUp, ArrowLeft, Calendar, Award } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Scan {
  id: string;
  created_at: string;
  risk: string;
  confidence: number;
  hemoglobin: number;
  message: string;
}

interface WeekData {
  week: string;
  avgHb: number;
  scans: number;
  risk: string;
}

export default function RecoveryPage() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);
  const [weekData, setWeekData] = useState<WeekData[]>([]);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    loadScans();
  }, []);

  useEffect(() => {
    if (scans.length > 0) {
      processWeekData();
      drawChart();
    }
  }, [scans]);

  const loadScans = async () => {
    const { data, error } = await supabase
      .from("scans")
      .select("*")
      .order("created_at", { ascending: true })
      .limit(100);
    if (!error && data) {
      setScans(data as Scan[]);
      calculateStreak(data as Scan[]);
    }
    setLoading(false);
  };

  const calculateStreak = (data: Scan[]) => {
    if (data.length === 0) return;
    const days = new Set(data.map(s => new Date(s.created_at).toDateString()));
    let count = 0;
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      if (days.has(d.toDateString())) count++;
      else if (i > 0) break;
    }
    setStreak(count);
  };

  const processWeekData = () => {
    const weeks: Record<string, Scan[]> = {};
    scans.forEach(scan => {
      const d = new Date(scan.created_at);
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() - d.getDay());
      const key = weekStart.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
      if (!weeks[key]) weeks[key] = [];
      weeks[key].push(scan);
    });

    const processed = Object.entries(weeks).map(([week, wScans]) => {
      const avgHb = wScans.reduce((s, sc) => s + sc.hemoglobin, 0) / wScans.length;
      const highCount = wScans.filter(s => s.risk === "HIGH").length;
      const modCount = wScans.filter(s => s.risk === "MODERATE").length;
      const risk = highCount > 0 ? "HIGH" : modCount > 0 ? "MODERATE" : "LOW";
      return { week, avgHb: parseFloat(avgHb.toFixed(1)), scans: wScans.length, risk };
    }).slice(-6);

    setWeekData(processed);
  };

  const drawChart = () => {
    setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas || weekData.length === 0) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const W = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      const H = canvas.height = 220 * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      const w = canvas.offsetWidth;
      const h = 220;

      ctx.clearRect(0, 0, w, h);

      const pad = { top: 20, bottom: 40, left: 40, right: 20 };
      const chartW = w - pad.left - pad.right;
      const chartH = h - pad.top - pad.bottom;

      const allHb = weekData.map(d => d.avgHb);
      const minHb = Math.max(0, Math.min(...allHb) - 2);
      const maxHb = Math.min(16, Math.max(...allHb) + 2);

      // Grid lines
      [8, 10, 12, 14].forEach(val => {
        if (val < minHb || val > maxHb) return;
        const y = pad.top + chartH - ((val - minHb) / (maxHb - minHb)) * chartH;
        ctx.beginPath();
        ctx.strokeStyle = "rgba(255,255,255,0.05)";
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.moveTo(pad.left, y);
        ctx.lineTo(pad.left + chartW, y);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = "rgba(255,255,255,0.25)";
        ctx.font = `${10 * window.devicePixelRatio}px Arial`;
        ctx.scale(1 / window.devicePixelRatio, 1 / window.devicePixelRatio);
        ctx.fillText(`${val}`, 0, y * window.devicePixelRatio + 4);
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      });

      // Normal range band (12-16)
      const y12 = pad.top + chartH - ((12 - minHb) / (maxHb - minHb)) * chartH;
      const y16 = pad.top + chartH - ((Math.min(16, maxHb) - minHb) / (maxHb - minHb)) * chartH;
      ctx.fillStyle = "rgba(6,214,160,0.07)";
      ctx.fillRect(pad.left, y16, chartW, y12 - y16);

      if (weekData.length < 2) return;

      const points = weekData.map((d, i) => ({
        x: pad.left + (i / (weekData.length - 1)) * chartW,
        y: pad.top + chartH - ((d.avgHb - minHb) / (maxHb - minHb)) * chartH,
        ...d,
      }));

      // Gradient fill under line
      const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + chartH);
      grad.addColorStop(0, "rgba(255,45,78,0.3)");
      grad.addColorStop(1, "rgba(255,45,78,0.0)");
      ctx.beginPath();
      ctx.moveTo(points[0].x, pad.top + chartH);
      points.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.lineTo(points[points.length - 1].x, pad.top + chartH);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      // Line
      ctx.beginPath();
      ctx.strokeStyle = "#FF2D4E";
      ctx.lineWidth = 2.5;
      ctx.lineJoin = "round";
      points.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
      ctx.stroke();

      // Dots + labels
      points.forEach((p) => {
        const dotColor = p.risk === "LOW" ? "#06D6A0" : p.risk === "MODERATE" ? "#FF9F1C" : "#FF2D4E";
        ctx.beginPath();
        ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = dotColor;
        ctx.fill();
        ctx.strokeStyle = "#0D0305";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Hb value above dot
        ctx.fillStyle = "white";
        ctx.font = `bold ${10 * window.devicePixelRatio}px Arial`;
        ctx.textAlign = "center";
        ctx.scale(1 / window.devicePixelRatio, 1 / window.devicePixelRatio);
        ctx.fillText(`${p.avgHb}`, p.x * window.devicePixelRatio, (p.y - 10) * window.devicePixelRatio);
        // Week label below
        ctx.fillStyle = "rgba(201,160,168,0.8)";
        ctx.font = `${9 * window.devicePixelRatio}px Arial`;
        ctx.fillText(p.week, p.x * window.devicePixelRatio, (pad.top + chartH + 20) * window.devicePixelRatio);
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      });
    }, 100);
  };

  useEffect(() => {
    if (weekData.length > 0) drawChart();
  }, [weekData]);

  const latestHb = scans.length > 0 ? scans[scans.length - 1].hemoglobin : null;
  const firstHb = scans.length > 1 ? scans[0].hemoglobin : null;
  const improvement = latestHb && firstHb ? parseFloat((latestHb - firstHb).toFixed(1)) : null;
  const trend = improvement !== null ? (improvement > 0 ? "improving" : improvement < 0 ? "declining" : "stable") : null;
  const trendColor = trend === "improving" ? "#06D6A0" : trend === "declining" ? "#FF2D4E" : "#FF9F1C";

  const nav = [
    { icon: <Home size={22} />, label: "Home", path: "/", active: false },
    { icon: <ScanLine size={22} />, label: "Scan", path: "/scan", active: false },
    { icon: <Salad size={22} />, label: "Diet", path: "/thali", active: false },
    { icon: <TrendingUp size={22} />, label: "Track", path: "/recovery", active: true },
  ];

  return (
    <div style={{ minHeight: "100vh", maxWidth: "430px", margin: "0 auto", background: "#0D0305", overflowY: "auto", overflowX: "hidden", paddingBottom: "100px" }}>
      <div style={{ position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(6,214,160,0.07), transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 24px 8px", position: "relative", zIndex: 10 }}>
        <motion.button onClick={() => router.push("/")} whileTap={{ scale: 0.9 }}
          style={{ width: "40px", height: "40px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <ArrowLeft size={18} color="white" />
        </motion.button>
        <div>
          <p style={{ fontFamily: "Georgia, serif", fontSize: "18px", fontWeight: 700, color: "white", textAlign: "center" }}>Recovery Tracker</p>
          <p style={{ color: "#C9A0A8", fontSize: "11px", textAlign: "center" }}>Weekly haemoglobin progress</p>
        </div>
        <div style={{ width: "40px" }} />
      </motion.div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
          <motion.div style={{ width: "36px", height: "36px", border: "3px solid rgba(255,45,78,0.2)", borderTop: "3px solid #FF2D4E", borderRadius: "50%" }}
            animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
        </div>
      ) : scans.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ textAlign: "center", padding: "80px 24px", position: "relative", zIndex: 10 }}>
          <p style={{ fontSize: "48px", marginBottom: "16px" }}>📊</p>
          <p style={{ color: "white", fontSize: "18px", fontWeight: 700, fontFamily: "Georgia, serif", marginBottom: "8px" }}>No scan history yet</p>
          <p style={{ color: "#C9A0A8", fontSize: "13px", lineHeight: 1.6, marginBottom: "24px" }}>Complete your first scan to start tracking your haemoglobin recovery over time.</p>
          <motion.button onClick={() => router.push("/scan")} whileTap={{ scale: 0.97 }}
            style={{ background: "linear-gradient(135deg, #C41230, #FF2D4E)", color: "white", fontWeight: 700, fontSize: "14px", padding: "16px 32px", borderRadius: "16px", border: "none", cursor: "pointer" }}>
            Start First Scan
          </motion.button>
        </motion.div>
      ) : (
        <>
          {/* Summary Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", padding: "12px 24px 16px", position: "relative", zIndex: 10 }}>
            {[
              { label: "Latest Hb", value: latestHb ? `${latestHb}` : "—", unit: "g/dL", color: "#FF2D4E" },
              { label: "Total Scans", value: `${scans.length}`, unit: "scans", color: "#FFD166" },
              { label: "Day Streak", value: `${streak}`, unit: "days", color: "#06D6A0" },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                style={{ background: "#1C0A0E", border: `1px solid ${s.color}25`, borderRadius: "16px", padding: "14px 8px", textAlign: "center", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: `linear-gradient(to right, transparent, ${s.color}60, transparent)` }} />
                <div style={{ fontSize: "22px", fontWeight: 900, color: s.color, fontFamily: "Georgia, serif" }}>{s.value}</div>
                <div style={{ fontSize: "9px", color: s.color, opacity: 0.7, marginBottom: "2px" }}>{s.unit}</div>
                <div style={{ fontSize: "10px", color: "#C9A0A8", textTransform: "uppercase", letterSpacing: "0.4px" }}>{s.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Trend Banner */}
          {trend && improvement !== null && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              style={{ margin: "0 24px 16px", background: `${trendColor}12`, border: `1px solid ${trendColor}35`, borderRadius: "14px", padding: "12px 16px", display: "flex", alignItems: "center", gap: "10px", position: "relative", zIndex: 10 }}>
              <span style={{ fontSize: "22px" }}>{trend === "improving" ? "📈" : trend === "declining" ? "📉" : "➡️"}</span>
              <div>
                <p style={{ color: trendColor, fontSize: "13px", fontWeight: 700, marginBottom: "2px" }}>
                  Haemoglobin {trend === "improving" ? `up ${improvement} g/dL` : trend === "declining" ? `down ${Math.abs(improvement)} g/dL` : "stable"} since first scan
                </p>
                <p style={{ color: "#C9A0A8", fontSize: "11px" }}>
                  {trend === "improving" ? "Great progress! Keep eating iron-rich foods daily." : trend === "declining" ? "Consult a doctor and increase iron intake." : "Maintaining current levels. Keep it up!"}
                </p>
              </div>
            </motion.div>
          )}

          {/* Chart */}
          {weekData.length >= 2 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              style={{ margin: "0 24px 16px", background: "#1C0A0E", border: "1px solid rgba(255,45,78,0.12)", borderRadius: "20px", padding: "16px", position: "relative", zIndex: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <p style={{ color: "white", fontSize: "13px", fontWeight: 700 }}>Weekly Hb Trend</p>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#06D6A0" }} />
                  <span style={{ color: "#C9A0A8", fontSize: "10px" }}>Normal range</span>
                </div>
              </div>
              <canvas ref={canvasRef} style={{ width: "100%", height: "220px", display: "block" }} />
            </motion.div>
          )}

          {/* Achievement badges */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            style={{ margin: "0 24px 16px", position: "relative", zIndex: 10 }}>
            <p style={{ color: "#C9A0A8", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "10px" }}>Achievements</p>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {[
                { condition: scans.length >= 1, icon: "🔍", label: "First Scan", color: "#FFD166" },
                { condition: scans.length >= 5, icon: "⭐", label: "5 Scans", color: "#FFD166" },
                { condition: scans.length >= 10, icon: "🏆", label: "10 Scans", color: "#FFD166" },
                { condition: streak >= 3, icon: "🔥", label: "3-Day Streak", color: "#FF9F1C" },
                { condition: trend === "improving", icon: "📈", label: "Improving!", color: "#06D6A0" },
                { condition: latestHb !== null && latestHb >= 12, icon: "💚", label: "Normal Hb", color: "#06D6A0" },
              ].map((badge, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: badge.condition ? 1 : 0.3, scale: 1 }} transition={{ delay: 0.5 + i * 0.05 }}
                  style={{ background: badge.condition ? `${badge.color}15` : "rgba(255,255,255,0.03)", border: `1px solid ${badge.condition ? badge.color + "40" : "rgba(255,255,255,0.08)"}`, borderRadius: "12px", padding: "8px 12px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontSize: "16px" }}>{badge.icon}</span>
                  <span style={{ color: badge.condition ? badge.color : "#C9A0A8", fontSize: "11px", fontWeight: 600 }}>{badge.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Recent scan history */}
          <div style={{ padding: "0 24px", position: "relative", zIndex: 10 }}>
            <p style={{ color: "#C9A0A8", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "10px" }}>Scan History</p>
            {scans.slice().reverse().slice(0, 8).map((scan, i) => {
              const riskColor = scan.risk === "LOW" ? "#06D6A0" : scan.risk === "MODERATE" ? "#FF9F1C" : "#FF2D4E";
              const d = new Date(scan.created_at);
              const dateStr = d.toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
              return (
                <motion.div key={scan.id}
                  initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 0", borderBottom: i < 7 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                  <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: riskColor, flexShrink: 0, boxShadow: `0 0 6px ${riskColor}` }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "white", fontSize: "13px", fontWeight: 600 }}>{scan.hemoglobin} g/dL</span>
                      <span style={{ color: riskColor, fontSize: "11px", fontWeight: 700 }}>{scan.risk}</span>
                    </div>
                    <span style={{ color: "#C9A0A8", fontSize: "10px" }}>{dateStr}</span>
                  </div>
                  <div style={{ width: "80px", height: "4px", background: "rgba(255,255,255,0.05)", borderRadius: "2px", overflow: "hidden" }}>
                    <div style={{ height: "100%", background: riskColor, width: `${(scan.hemoglobin / 16) * 100}%`, borderRadius: "2px" }} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </>
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
