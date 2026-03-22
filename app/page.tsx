"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Eye, Shield, Clock, Home, ScanLine, Salad, Users } from "lucide-react";
import { useState, useEffect } from "react";

type Lang = "EN" | "TM" | "HI";

const stats = [
  { icon: "🩸", num: "57%", label: "Anaemic" },
  { icon: "⚡", num: "10s", label: "Detection" },
  { icon: "🛡", num: "100%", label: "Free" },
];

const facts = [
  { dot: "#FF2D4E", text: "India has 400M+ anaemic women - most dont know it" },
  { dot: "#FFD166", text: "The cure costs just Rs.2/day - yet 98% go untreated" },
  { dot: "#06D6A0", text: "Govt gives free iron tablets - 75% of women dont know" },
];

const ctas: Record<Lang, string> = {
  EN: "Scan My Eye Now",
  TM: "Scan My Eye Now (Tamil)",
  HI: "Scan My Eye Now (Hindi)",
};

export default function HomePage() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>("EN");
  const [count, setCount] = useState(0);

  useEffect(() => {
    let c = 0;
    const t = setInterval(() => {
      c++;
      setCount(c);
      if (c >= 57) clearInterval(t);
    }, 35);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      maxWidth: "430px",
      margin: "0 auto",
      background: "#0D0305",
      overflowY: "auto",
      overflowX: "hidden",
      paddingBottom: "100px",
      position: "relative",
    }}>

      {/* BG Glow */}
      <div style={{ position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(255,45,78,0.12), transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 24px 8px", position: "relative", zIndex: 10 }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "linear-gradient(135deg, #3D0A10, #7A1020)", border: "1px solid rgba(255,45,78,0.35)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 20px rgba(255,45,78,0.3)" }}>
            <Eye size={20} color="#FF2D4E" />
          </div>
          <span style={{ fontFamily: "Georgia, serif", fontSize: "20px", fontWeight: 700, color: "white" }}>
            Anaemia<span style={{ color: "#FFD166" }}>AI</span>
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(6,214,160,0.1)", border: "1px solid rgba(6,214,160,0.3)", borderRadius: "20px", padding: "6px 12px" }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#06D6A0" }} />
          <span style={{ color: "#06D6A0", fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Validated</span>
        </div>
      </motion.div>

      {/* Language Toggle */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{ display: "flex", justifyContent: "center", gap: "8px", padding: "12px 24px", position: "relative", zIndex: 10 }}
      >
        {(["EN", "TM", "HI"] as Lang[]).map((l) => (
          <button key={l} onClick={() => setLang(l)} style={{
            padding: "5px 14px",
            borderRadius: "20px",
            border: lang === l ? "1px solid rgba(255,209,102,0.5)" : "1px solid rgba(255,255,255,0.1)",
            background: lang === l ? "rgba(255,209,102,0.15)" : "transparent",
            color: lang === l ? "#FFD166" : "rgba(255,255,255,0.4)",
            fontSize: "11px",
            fontWeight: 600,
            cursor: "pointer",
          }}>{l === "EN" ? "English" : l === "TM" ? "Tamil" : "Hindi"}</button>
        ))}
      </motion.div>

      {/* Eye Hero */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        style={{ display: "flex", justifyContent: "center", padding: "24px 0", position: "relative", zIndex: 10 }}
      >
        <div style={{ position: "relative", width: "170px", height: "170px" }}>
          {[0, 1, 2].map((i) => (
            <motion.div key={i}
              style={{ position: "absolute", inset: i * 14, borderRadius: "50%", border: "1px solid rgba(255,45,78,0.25)" }}
              animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2.5, delay: i * 0.3, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
          <div style={{
            position: "absolute", inset: "42px", borderRadius: "50%",
            background: "radial-gradient(circle at 38% 35%, #7A1525, #3D0810)",
            border: "2px solid rgba(255,45,78,0.5)",
            boxShadow: "0 0 40px rgba(255,45,78,0.4), inset 0 0 20px rgba(0,0,0,0.6)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #1a0305, #0D0305)", position: "relative" }}>
              <div style={{ position: "absolute", top: "8px", left: "8px", width: "10px", height: "10px", background: "rgba(255,255,255,0.65)", borderRadius: "50%" }} />
            </div>
          </div>
          <div style={{ position: "absolute", inset: "42px", borderRadius: "50%", overflow: "hidden", zIndex: 5 }}>
            <motion.div
              style={{ position: "absolute", left: 0, right: 0, height: "1px", background: "linear-gradient(to right, transparent, rgba(255,45,78,0.8), transparent)" }}
              animate={{ top: ["8%", "88%", "8%"] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ position: "absolute", bottom: "-14px", left: "50%", transform: "translateX(-50%)", background: "#FF2D4E", color: "white", fontSize: "11px", fontWeight: 700, padding: "4px 12px", borderRadius: "20px", whiteSpace: "nowrap", boxShadow: "0 4px 15px rgba(255,45,78,0.5)" }}
          >
            {count}% at risk
          </motion.div>
        </div>
      </motion.div>

      {/* Hero Text */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        style={{ padding: "16px 28px 0", textAlign: "center", position: "relative", zIndex: 10 }}
      >
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "44px", fontWeight: 900, lineHeight: 1.05, color: "white", marginBottom: "14px" }}>
          Are you <span style={{ color: "#FFD166", fontStyle: "italic" }}>1 in 2?</span>
        </h1>
        <p style={{ color: "#C9A0A8", fontSize: "15px", lineHeight: 1.65 }}>
          <strong style={{ color: "#FF2D4E" }}>57%</strong> of Indian women are anaemic. Find out in <strong style={{ color: "white" }}>10 seconds.</strong>
        </p>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        style={{ padding: "24px 24px 0", position: "relative", zIndex: 10 }}
      >
        <motion.button
          onClick={() => router.push("/scan")}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", background: "linear-gradient(135deg, #C41230, #FF2D4E)", color: "white", fontWeight: 700, fontSize: "17px", padding: "18px", borderRadius: "18px", border: "none", cursor: "pointer", boxShadow: "0 0 40px rgba(255,45,78,0.45)", position: "relative", overflow: "hidden" }}
        >
          <motion.div
            style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, transparent, rgba(255,255,255,0.15), transparent)" }}
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5, ease: "easeInOut" }}
          />
          <Eye size={20} style={{ position: "relative", zIndex: 1 }} />
          <span style={{ position: "relative", zIndex: 1 }}>{ctas[lang]}</span>
        </motion.button>
        <p style={{ textAlign: "center", fontSize: "11px", color: "#C9A0A8", marginTop: "10px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
          <Shield size={12} color="#06D6A0" /> No needles, No lab, No cost <Clock size={12} color="#FFD166" /> 10 sec
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", padding: "20px 24px 0", position: "relative", zIndex: 10 }}
      >
        {stats.map((s, i) => (
          <motion.div key={i} whileHover={{ y: -3 }} style={{ background: "#1C0A0E", border: "1px solid rgba(255,45,78,0.15)", borderRadius: "16px", padding: "16px 12px", textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(to right, transparent, rgba(255,45,78,0.6), transparent)" }} />
            <div style={{ fontSize: "20px", marginBottom: "4px" }}>{s.icon}</div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: "22px", fontWeight: 900, color: "#FFD166" }}>{s.num}</div>
            <div style={{ fontSize: "10px", color: "#C9A0A8", textTransform: "uppercase", letterSpacing: "0.5px", marginTop: "2px" }}>{s.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Science */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        style={{ margin: "16px 24px 0", background: "rgba(6,214,160,0.05)", border: "1px solid rgba(6,214,160,0.2)", borderRadius: "16px", padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px", position: "relative", zIndex: 10 }}
      >
        <div style={{ width: "40px", height: "40px", background: "rgba(6,214,160,0.15)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>🔬</div>
        <div>
          <div style={{ fontSize: "10px", fontWeight: 700, color: "#06D6A0", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "2px" }}>Peer Reviewed Science</div>
          <div style={{ fontSize: "11px", color: "#C9A0A8", lineHeight: 1.4 }}>98.47% accuracy - Nature 2025 - SRM IST Research</div>
        </div>
      </motion.div>

      {/* Facts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        style={{ margin: "14px 24px 0", background: "#1C0A0E", border: "1px solid rgba(255,45,78,0.15)", borderRadius: "16px", padding: "18px", position: "relative", zIndex: 10 }}
      >
        <h3 style={{ fontFamily: "Georgia, serif", fontSize: "15px", fontWeight: 700, color: "white", marginBottom: "14px" }}>Why this matters</h3>
        {facts.map((f, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: i < 2 ? "10px" : 0 }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: f.dot, boxShadow: `0 0 8px ${f.dot}80`, marginTop: "5px", flexShrink: 0 }} />
            <p style={{ fontSize: "13px", color: "#C9A0A8", lineHeight: 1.5 }}>{f.text}</p>
          </div>
        ))}
      </motion.div>

      {/* ASHA Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        style={{ margin: "14px 24px 0", position: "relative", zIndex: 10 }}
      >
        <motion.button
          onClick={() => router.push("/asha")}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          style={{ width: "100%", background: "linear-gradient(to right, #1C0A0E, #2A1018)", border: "1px solid rgba(255,209,102,0.2)", borderRadius: "16px", padding: "16px", display: "flex", alignItems: "center", gap: "14px", cursor: "pointer" }}
        >
          <div style={{ width: "46px", height: "46px", background: "rgba(255,209,102,0.1)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }}>🏥</div>
          <div style={{ flex: 1, textAlign: "left" }}>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#FFD166", marginBottom: "2px" }}>ASHA Village Mode</div>
            <div style={{ fontSize: "11px", color: "#C9A0A8" }}>Screen entire villages - Dashboard for health workers</div>
          </div>
          <span style={{ color: "rgba(255,209,102,0.4)", fontSize: "18px" }}>›</span>
        </motion.button>
      </motion.div>

      {/* Bottom Nav */}
      <nav style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: "430px",
        background: "rgba(13,3,5,0.95)", backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(255,45,78,0.12)",
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
        zIndex: 50, paddingBottom: "16px", paddingTop: "8px"
      }}>
        {[
          { icon: <Home size={22} />, label: "Home", path: "/", active: true },
          { icon: <ScanLine size={22} />, label: "Scan", path: "/scan", active: false },
          { icon: <Salad size={22} />, label: "Diet", path: "/thali", active: false },
          { icon: <Users size={22} />, label: "ASHA", path: "/asha", active: false },
        ].map((item, i) => (
          <motion.button key={i}
            onClick={() => router.push(item.path)}
            whileTap={{ scale: 0.88 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px", fontSize: "10px", fontWeight: 500, color: item.active ? "#FFD166" : "#C9A0A8", background: "transparent", border: "none", cursor: "pointer", paddingTop: "4px" }}
          >
            <div style={{ padding: "6px", borderRadius: "12px", background: item.active ? "rgba(255,209,102,0.15)" : "transparent" }}>
              {item.icon}
            </div>
            {item.label}
          </motion.button>
        ))}
      </nav>
    </div>
  );
}
