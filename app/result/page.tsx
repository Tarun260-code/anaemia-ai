"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Home, ScanLine, Salad, Users, ArrowLeft, Eye } from "lucide-react";

type Risk = "LOW" | "MODERATE" | "HIGH";
interface Result { risk: Risk; confidence: number; hemoglobin: number; message: string; }

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<Result | null>(null);
  const [animatedHb, setAnimatedHb] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("anaemia_result");
    if (stored) {
      try {
        const r = JSON.parse(stored) as Result;
        setResult(r);
        let v = 0;
        const t = setInterval(() => {
          v = parseFloat((v + 0.1).toFixed(1));
          setAnimatedHb(v);
          if (v >= r.hemoglobin) { clearInterval(t); setAnimatedHb(r.hemoglobin); }
        }, 30);
        return () => clearInterval(t);
      } catch {
        router.push("/scan");
      }
    } else {
      router.push("/scan");
    }
  }, [router]);

  const nav = [
    { icon: <Home size={22} />, label: "Home", path: "/", active: false },
    { icon: <ScanLine size={22} />, label: "Scan", path: "/scan", active: false },
    { icon: <Salad size={22} />, label: "Diet", path: "/thali", active: false },
    { icon: <Users size={22} />, label: "ASHA", path: "/asha", active: false },
  ];

  if (!result) {
    return (
      <div style={{ minHeight: "100vh", background: "#0D0305", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <motion.div
          style={{ width: "40px", height: "40px", border: "3px solid rgba(255,45,78,0.3)", borderTop: "3px solid #FF2D4E", borderRadius: "50%" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  const riskColor = result.risk === "LOW" ? "#06D6A0" : result.risk === "MODERATE" ? "#FF9F1C" : "#FF2D4E";
  const riskBg = result.risk === "LOW" ? "rgba(6,214,160,0.1)" : result.risk === "MODERATE" ? "rgba(255,159,28,0.1)" : "rgba(255,45,78,0.1)";
  const riskLabel = result.risk === "LOW" ? "Low Risk" : result.risk === "MODERATE" ? "Moderate Risk" : "High Risk";
  const riskMessage = result.risk === "LOW"
    ? "Great news! Your eyelid colour suggests healthy haemoglobin levels. Keep eating iron-rich foods to stay healthy."
    : result.risk === "MODERATE"
    ? "Your eyelid shows some pallor. You may have mild anaemia. Visit a doctor and start eating more iron-rich foods."
    : "Your eyelid shows significant pallor indicating possible severe anaemia. Please see a doctor immediately.";

  return (
    <div style={{ minHeight: "100vh", maxWidth: "430px", margin: "0 auto", background: "#0D0305", overflowY: "auto", overflowX: "hidden", paddingBottom: "100px" }}>
      <div style={{ position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)", width: "400px", height: "400px", background: `radial-gradient(circle, ${riskBg}, transparent 70%)`, pointerEvents: "none", zIndex: 0 }} />

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 24px 8px", position: "relative", zIndex: 10 }}>
        <motion.button onClick={() => router.push("/scan")} whileTap={{ scale: 0.9 }}
          style={{ width: "40px", height: "40px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <ArrowLeft size={18} color="white" />
        </motion.button>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Eye size={18} color="#FF2D4E" />
          <span style={{ fontFamily: "Georgia, serif", fontSize: "18px", fontWeight: 700, color: "white" }}>Your Results</span>
        </div>
        <div style={{ width: "40px" }} />
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        style={{ display: "flex", justifyContent: "center", padding: "24px 24px 16px", position: "relative", zIndex: 10 }}>
        <div style={{ textAlign: "center" }}>
          <motion.div
            animate={{ boxShadow: [`0 0 30px ${riskColor}40`, `0 0 60px ${riskColor}70`, `0 0 30px ${riskColor}40`] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ width: "140px", height: "140px", borderRadius: "50%", background: riskBg, border: `3px solid ${riskColor}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <span style={{ fontSize: "36px", fontWeight: 900, color: riskColor, fontFamily: "Georgia, serif" }}>{result.confidence}%</span>
            <span style={{ fontSize: "11px", color: riskColor, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Confidence</span>
          </motion.div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: riskBg, border: `1px solid ${riskColor}40`, borderRadius: "20px", padding: "8px 20px" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: riskColor, boxShadow: `0 0 8px ${riskColor}` }} />
            <span style={{ color: riskColor, fontSize: "16px", fontWeight: 700 }}>{riskLabel}</span>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        style={{ margin: "0 24px 16px", background: "#1C0A0E", border: `1px solid ${riskColor}30`, borderRadius: "20px", padding: "20px", position: "relative", zIndex: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <span style={{ color: "#C9A0A8", fontSize: "13px", fontWeight: 500 }}>Estimated Haemoglobin</span>
          <span style={{ color: riskColor, fontSize: "22px", fontWeight: 900, fontFamily: "Georgia, serif" }}>{animatedHb} g/dL</span>
        </div>
        <div style={{ height: "8px", background: "rgba(255,255,255,0.05)", borderRadius: "4px", overflow: "hidden" }}>
          <motion.div
            style={{ height: "100%", borderRadius: "4px", background: `linear-gradient(to right, ${riskColor}80, ${riskColor})` }}
            initial={{ width: "0%" }}
            animate={{ width: `${(result.hemoglobin / 16) * 100}%` }}
            transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
          <span style={{ color: "#C9A0A8", fontSize: "10px" }}>0</span>
          <span style={{ color: "#C9A0A8", fontSize: "10px" }}>Normal: 12-16 g/dL</span>
          <span style={{ color: "#C9A0A8", fontSize: "10px" }}>16</span>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        style={{ margin: "0 24px 16px", background: riskBg, border: `1px solid ${riskColor}30`, borderRadius: "16px", padding: "16px", position: "relative", zIndex: 10 }}>
        <div style={{ fontSize: "11px", fontWeight: 700, color: riskColor, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>Analysis</div>
        <p style={{ color: "white", fontSize: "14px", lineHeight: 1.6 }}>{riskMessage}</p>
        <p style={{ color: "#C9A0A8", fontSize: "12px", marginTop: "8px", fontStyle: "italic" }}>{result.message}</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", padding: "0 24px 16px", position: "relative", zIndex: 10 }}>
        {[
          { label: "Risk Level", value: result.risk, color: riskColor },
          { label: "Confidence", value: `${result.confidence}%`, color: "#FFD166" },
          { label: "Hb Level", value: `${result.hemoglobin}`, color: "#06D6A0" },
        ].map((s, i) => (
          <div key={i} style={{ background: "#1C0A0E", border: "1px solid rgba(255,45,78,0.12)", borderRadius: "14px", padding: "14px 8px", textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: `linear-gradient(to right, transparent, ${s.color}60, transparent)` }} />
            <div style={{ fontSize: "16px", fontWeight: 900, color: s.color, fontFamily: "Georgia, serif", marginBottom: "2px" }}>{s.value}</div>
            <div style={{ fontSize: "10px", color: "#C9A0A8", textTransform: "uppercase", letterSpacing: "0.5px" }}>{s.label}</div>
          </div>
        ))}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
        style={{ padding: "0 24px 16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", position: "relative", zIndex: 10 }}>
        <motion.button onClick={() => router.push("/thali")} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "linear-gradient(135deg, #C41230, #FF2D4E)", color: "white", fontWeight: 700, fontSize: "14px", padding: "16px", borderRadius: "16px", border: "none", cursor: "pointer", boxShadow: "0 0 20px rgba(255,45,78,0.3)" }}>
          <Salad size={16} />
          Thali Doctor
        </motion.button>
        <motion.button onClick={() => router.push("/scan")} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "transparent", color: "#FFD166", fontWeight: 700, fontSize: "14px", padding: "16px", borderRadius: "16px", border: "2px solid rgba(255,209,102,0.4)", cursor: "pointer" }}>
          <ScanLine size={16} />
          Scan Again
        </motion.button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
        style={{ margin: "0 24px 16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "14px 16px", position: "relative", zIndex: 10 }}>
        <p style={{ color: "#C9A0A8", fontSize: "11px", lineHeight: 1.6, textAlign: "center" }}>
          This is a screening tool only and not a medical diagnosis. Always consult a qualified doctor for accurate diagnosis and treatment.
        </p>
      </motion.div>

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
