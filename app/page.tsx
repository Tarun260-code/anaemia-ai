"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Eye, Shield, Clock, Home, ScanLine, Salad, Users } from "lucide-react";

type Lang = "EN" | "TM" | "HI";

export default function HomePage() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>("EN");
  const [count, setCount] = useState(0);

  useEffect(() => {
    let c = 0;
    const timer = setInterval(() => {
      c++;
      setCount(c);
      if (c >= 57) clearInterval(timer);
    }, 35);
    return () => clearInterval(timer);
  }, []);

  // All text stored as unicode escape sequences to avoid encoding issues
  const translations: Record<Lang, Record<string, string>> = {
    EN: {
      title: "Are you 1 in 2?",
      sub: "57% of Indian women are anaemic. Find out in 10 seconds.",
      cta: "Scan My Eye Now",
      safe: "No needles, No lab, No cost",
      why: "Why this matters",
      f1: "India has 400M+ anaemic women - most do not know it",
      f2: "The cure costs just Rs.2 per day - yet 98% go untreated",
      f3: "Govt gives free iron tablets - 75% of women do not know",
      asha: "ASHA Village Mode",
      ashaDesc: "Screen entire villages - Dashboard for health workers",
      s1: "Anaemic", s2: "Detection", s3: "Free",
      btn1: "English", btn2: "Tamil", btn3: "Hindi",
    },
    TM: {
      title: "\u0b28\u0bc0\u0b99\u0bcd\u0b95\u0bb3\u0bcd 2\u0bb2\u0bcd 1 \u0baa\u0bc7\u0bb0\u0bbe?",
      sub: "57% \u0b87\u0ba8\u0bcd\u0ba4\u0bbf\u0baf \u0baa\u0bc6\u0ba3\u0bcd\u0b95\u0bb3\u0bc1\u0b95\u0bcd\u0b95\u0bc1 \u0b87\u0bb0\u0ba4\u0bcd\u0ba4 \u0b9a\u0bcb\u0b95\u0bc8. 10 \u0bb5\u0bbf\u0ba9\u0bbe\u0b9f\u0bbf\u0baf\u0bbf\u0bb2\u0bcd \u0ba4\u0bc6\u0bb0\u0bbf\u0ba8\u0bcd\u0ba4\u0bc1\u0b95\u0bcd\u0b95\u0bca\u0bb3\u0bcd\u0bb3\u0bc1\u0b99\u0bcd\u0b95\u0bb3\u0bcd.",
      cta: "\u0b8e\u0ba9\u0bcd \u0b95\u0ba3\u0bcd\u0ba3\u0bc8 \u0bb8\u0bcd\u0b95\u0bc7\u0ba9\u0bcd \u0b9a\u0bc6\u0baf\u0bcd",
      safe: "\u0b8a\u0b9a\u0bbf \u0b87\u0bb2\u0bcd\u0bb2\u0bc8, \u0b86\u0baf\u0bcd\u0bb5\u0b95\u0bae\u0bcd \u0b87\u0bb2\u0bcd\u0bb2\u0bc8, \u0b9a\u0bc6\u0bb2\u0bb5\u0bc1 \u0b87\u0bb2\u0bcd\u0bb2\u0bc8",
      why: "\u0b8f\u0ba9\u0bcd \u0b87\u0ba4\u0bc1 \u0bae\u0bc1\u0b95\u0bcd\u0b95\u0bbf\u0baf\u0bae\u0bcd",
      f1: "\u0b87\u0ba8\u0bcd\u0ba4\u0bbf\u0baf\u0bbe\u0bb5\u0bbf\u0bb2\u0bcd 40 \u0b95\u0bcb\u0b9f\u0bbf \u0baa\u0bc6\u0ba3\u0bcd\u0b95\u0bb3\u0bc1\u0b95\u0bcd\u0b95\u0bc1 \u0b87\u0bb0\u0ba4\u0bcd\u0ba4 \u0b9a\u0bcb\u0b95\u0bc8 \u0b89\u0bb3\u0bcd\u0bb3\u0ba4\u0bc1",
      f2: "\u0b9a\u0bbf\u0b95\u0bbf\u0b9a\u0bcd\u0b9a\u0bc8 \u0ba8\u0bbe\u0bb3\u0bca\u0ba9\u0bcd\u0bb1\u0bc1\u0b95\u0bcd\u0b95\u0bc1 \u0bb5\u0bc6\u0bb1\u0bc1\u0bae\u0bcd 2 \u0bb0\u0bc2\u0baa\u0bbe\u0baf\u0bcd \u0bae\u0b9f\u0bcd\u0b9f\u0bc1\u0bae\u0bc7",
      f3: "\u0b85\u0bb0\u0b9a\u0bc1 \u0b87\u0bb2\u0bb5\u0b9a \u0b87\u0bb0\u0bc1\u0bae\u0bcd\u0baa\u0bc1 \u0bae\u0bbe\u0ba4\u0bcd\u0ba4\u0bbf\u0bb0\u0bc8\u0b95\u0bb3\u0bcd \u0ba4\u0bb0\u0bc1\u0b95\u0bbf\u0bb1\u0ba4\u0bc1",
      asha: "\u0b86\u0b9a\u0bbe \u0b95\u0bbf\u0bb0\u0bbe\u0bae \u0baa\u0baf\u0ba9\u0bcd\u0bae\u0bc1\u0bb1\u0bc8",
      ashaDesc: "\u0b95\u0bbf\u0bb0\u0bbe\u0bae\u0b99\u0bcd\u0b95\u0bb3\u0bc8 \u0bae\u0bc1\u0bb4\u0bc1\u0bae\u0bc8\u0baf\u0bbe\u0b95 \u0baa\u0bb0\u0bbf\u0b9a\u0bcb\u0ba4\u0bbf\u0b95\u0bcd\u0b95\u0bb5\u0bc1\u0bae\u0bcd",
      s1: "\u0b87\u0bb0\u0ba4\u0bcd\u0ba4 \u0b9a\u0bcb\u0b95\u0bc8", s2: "\u0b95\u0ba3\u0bcd\u0b9f\u0bb1\u0bbf\u0ba4\u0bb2\u0bcd", s3: "\u0b87\u0bb2\u0bb5\u0b9a\u0bae\u0bcd",
      btn1: "English", btn2: "\u0ba4\u0bae\u0bbf\u0bb4\u0bcd", btn3: "Hindi",
    },
    HI: {
      title: "\u0915\u094d\u092f\u093e \u0906\u092a 2 \u092e\u0947\u0902 1 \u0939\u0948\u0902?",
      sub: "57% \u092d\u093e\u0930\u0924\u0940\u092f \u092e\u0939\u093f\u0932\u093e\u090f\u0902 \u090f\u0928\u0940\u092e\u093f\u0915 \u0939\u0948\u0902\u0964 10 \u0938\u0947\u0915\u0902\u0921 \u092e\u0947\u0902 \u091c\u093e\u0928\u0947\u0902\u0964",
      cta: "\u092e\u0947\u0930\u0940 \u0906\u0902\u0916 \u0938\u094d\u0915\u0948\u0928 \u0915\u0930\u0947\u0902",
      safe: "\u0915\u094b\u0908 \u0938\u0941\u0908 \u0928\u0939\u0940\u0902, \u0915\u094b\u0908 \u0932\u0948\u092c \u0928\u0939\u0940\u0902, \u0915\u094b\u0908 \u0916\u0930\u094d\u091a \u0928\u0939\u0940\u0902",
      why: "\u092f\u0939 \u0915\u094d\u092f\u094b\u0902 \u092e\u093e\u092f\u0928\u0947 \u0930\u0916\u0924\u093e \u0939\u0948",
      f1: "\u092d\u093e\u0930\u0924 \u092e\u0947\u0902 40 \u0915\u0930\u094b\u095c \u0938\u0947 \u091c\u094d\u092f\u093e\u0926\u093e \u092e\u0939\u093f\u0932\u093e\u090f\u0902 \u090f\u0928\u0940\u092e\u093f\u0915 \u0939\u0948\u0902",
      f2: "\u0907\u0932\u093e\u091c \u0938\u093f\u0930\u094d\u092b \u0930\u0941. 2 \u092a\u094d\u0930\u0924\u093f\u0926\u093f\u0928 - \u092b\u093f\u0930 \u092d\u0940 98% \u0915\u093e \u0907\u0932\u093e\u091c \u0928\u0939\u0940\u0902",
      f3: "\u0938\u0930\u0915\u093e\u0930 \u092e\u0941\u092b\u093c\u094d\u0924 \u0906\u092f\u0930\u0928 \u0917\u094b\u0932\u093f\u092f\u093e\u0902 \u0926\u0947\u0924\u0940 \u0939\u0948 - 75% \u092e\u0939\u093f\u0932\u093e\u0913\u0902 \u0915\u094b \u092a\u0924\u093e \u0928\u0939\u0940\u0902",
      asha: "\u0906\u0936\u093e \u0917\u094d\u0930\u093e\u092e \u092e\u094b\u0921",
      ashaDesc: "\u092a\u0942\u0930\u0947 \u0917\u093e\u0902\u0935 \u0915\u0940 \u091c\u093e\u0902\u091a \u0915\u0930\u0947\u0902",
      s1: "\u0930\u0915\u094d\u0924\u093e\u0932\u094d\u092a\u0924\u093e", s2: "\u092a\u0939\u091a\u093e\u0928", s3: "\u092e\u0941\u092b\u093c\u094d\u0924",
      btn1: "English", btn2: "Tamil", btn3: "\u0939\u093f\u0902\u0926\u0940",
    },
  };

  const t = translations[lang];

  const nav = [
    { icon: <Home size={22} />, label: "Home", path: "/", active: true },
    { icon: <ScanLine size={22} />, label: "Scan", path: "/scan", active: false },
    { icon: <Salad size={22} />, label: "Diet", path: "/thali", active: false },
    { icon: <Users size={22} />, label: "ASHA", path: "/asha", active: false },
  ];

  return (
    <div style={{ minHeight: "100vh", maxWidth: "430px", margin: "0 auto", background: "#0D0305", overflowY: "auto", overflowX: "hidden", paddingBottom: "100px" }}>
      <div style={{ position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(255,45,78,0.12), transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 24px 8px", position: "relative", zIndex: 10 }}>
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

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        style={{ display: "flex", justifyContent: "center", gap: "8px", padding: "12px 24px", position: "relative", zIndex: 10 }}>
        {(["EN", "TM", "HI"] as Lang[]).map((l, i) => (
          <button key={l} onClick={() => setLang(l)} style={{
            padding: "5px 14px", borderRadius: "20px",
            border: lang === l ? "1px solid rgba(255,209,102,0.5)" : "1px solid rgba(255,255,255,0.1)",
            background: lang === l ? "rgba(255,209,102,0.15)" : "transparent",
            color: lang === l ? "#FFD166" : "rgba(255,255,255,0.4)",
            fontSize: "11px", fontWeight: 600, cursor: "pointer",
          }}>{i === 0 ? t.btn1 : i === 1 ? t.btn2 : t.btn3}</button>
        ))}
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.3 }}
        style={{ display: "flex", justifyContent: "center", padding: "24px 0", position: "relative", zIndex: 10 }}>
        <div style={{ position: "relative", width: "170px", height: "170px" }}>
          {[0, 1, 2].map((i) => (
            <motion.div key={i} style={{ position: "absolute", inset: i * 14, borderRadius: "50%", border: "1px solid rgba(255,45,78,0.25)" }}
              animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2.5, delay: i * 0.3, repeat: Infinity, ease: "easeInOut" }} />
          ))}
          <div style={{ position: "absolute", inset: "42px", borderRadius: "50%", background: "radial-gradient(circle at 38% 35%, #7A1525, #3D0810)", border: "2px solid rgba(255,45,78,0.5)", boxShadow: "0 0 40px rgba(255,45,78,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #1a0305, #0D0305)", position: "relative" }}>
              <div style={{ position: "absolute", top: "8px", left: "8px", width: "10px", height: "10px", background: "rgba(255,255,255,0.65)", borderRadius: "50%" }} />
            </div>
          </div>
          <div style={{ position: "absolute", inset: "42px", borderRadius: "50%", overflow: "hidden", zIndex: 5 }}>
            <motion.div style={{ position: "absolute", left: 0, right: 0, height: "1px", background: "linear-gradient(to right, transparent, rgba(255,45,78,0.8), transparent)" }}
              animate={{ top: ["8%", "88%", "8%"] }} transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }} />
          </div>
          <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ position: "absolute", bottom: "-14px", left: "50%", transform: "translateX(-50%)", background: "#FF2D4E", color: "white", fontSize: "11px", fontWeight: 700, padding: "4px 12px", borderRadius: "20px", whiteSpace: "nowrap", boxShadow: "0 4px 15px rgba(255,45,78,0.5)" }}>
            {count}% at risk
          </motion.div>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div key={lang} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }}
          style={{ padding: "16px 28px 0", textAlign: "center", position: "relative", zIndex: 10 }}>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "40px", fontWeight: 900, lineHeight: 1.1, color: "white", marginBottom: "14px" }}>
            {t.title.split("1 in 2").map((part, i, arr) => (
              <span key={i}>{part}{i < arr.length - 1 && <span style={{ color: "#FFD166", fontStyle: "italic" }}>1 in 2</span>}</span>
            ))}
          </h1>
          <p style={{ color: "#C9A0A8", fontSize: "15px", lineHeight: 1.65 }}>
            <strong style={{ color: "#FF2D4E" }}>57%</strong> {t.sub.replace("57% ", "")}
          </p>
        </motion.div>
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        style={{ padding: "24px 24px 0", position: "relative", zIndex: 10 }}>
        <motion.button onClick={() => router.push("/scan")} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", background: "linear-gradient(135deg, #C41230, #FF2D4E)", color: "white", fontWeight: 700, fontSize: "17px", padding: "18px", borderRadius: "18px", border: "none", cursor: "pointer", boxShadow: "0 0 40px rgba(255,45,78,0.45)", position: "relative", overflow: "hidden" }}>
          <motion.div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, transparent, rgba(255,255,255,0.15), transparent)" }}
            animate={{ x: ["-100%", "100%"] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5 }} />
          <Eye size={20} style={{ position: "relative", zIndex: 1 }} />
          <span style={{ position: "relative", zIndex: 1 }}>{t.cta}</span>
        </motion.button>
        <p style={{ textAlign: "center", fontSize: "11px", color: "#C9A0A8", marginTop: "10px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
          <Shield size={12} color="#06D6A0" /> {t.safe} <Clock size={12} color="#FFD166" />
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
        style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", padding: "20px 24px 0", position: "relative", zIndex: 10 }}>
        {[{ num: "57%", label: t.s1 }, { num: "10s", label: t.s2 }, { num: "100%", label: t.s3 }].map((s, i) => (
          <motion.div key={i} whileHover={{ y: -3 }} style={{ background: "#1C0A0E", border: "1px solid rgba(255,45,78,0.15)", borderRadius: "16px", padding: "16px 12px", textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(to right, transparent, rgba(255,45,78,0.6), transparent)" }} />
            <div style={{ fontFamily: "Georgia, serif", fontSize: "22px", fontWeight: 900, color: "#FFD166" }}>{s.num}</div>
            <div style={{ fontSize: "10px", color: "#C9A0A8", textTransform: "uppercase", letterSpacing: "0.5px", marginTop: "2px" }}>{s.label}</div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
        style={{ margin: "16px 24px 0", background: "rgba(6,214,160,0.05)", border: "1px solid rgba(6,214,160,0.2)", borderRadius: "16px", padding: "14px 16px", zIndex: 10, position: "relative" }}>
        <div style={{ fontSize: "10px", fontWeight: 700, color: "#06D6A0", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "2px" }}>Peer Reviewed Science</div>
        <div style={{ fontSize: "11px", color: "#C9A0A8" }}>98.47% accuracy - Nature 2025 - SRM IST Research</div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
        style={{ margin: "14px 24px 0", background: "#1C0A0E", border: "1px solid rgba(255,45,78,0.15)", borderRadius: "16px", padding: "18px", position: "relative", zIndex: 10 }}>
        <h3 style={{ fontFamily: "Georgia, serif", fontSize: "15px", fontWeight: 700, color: "white", marginBottom: "14px" }}>{t.why}</h3>
        {[t.f1, t.f2, t.f3].map((f, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: i < 2 ? "10px" : 0 }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: i === 0 ? "#FF2D4E" : i === 1 ? "#FFD166" : "#06D6A0", marginTop: "5px", flexShrink: 0 }} />
            <p style={{ fontSize: "13px", color: "#C9A0A8", lineHeight: 1.5 }}>{f}</p>
          </div>
        ))}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
        style={{ margin: "14px 24px 0", position: "relative", zIndex: 10 }}>
        <motion.button onClick={() => router.push("/asha")} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
          style={{ width: "100%", background: "linear-gradient(to right, #1C0A0E, #2A1018)", border: "1px solid rgba(255,209,102,0.2)", borderRadius: "16px", padding: "16px", display: "flex", alignItems: "center", gap: "14px", cursor: "pointer" }}>
          <div style={{ width: "46px", height: "46px", background: "rgba(255,209,102,0.1)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0, color: "#FFD166", fontWeight: 700 }}>A</div>
          <div style={{ flex: 1, textAlign: "left" }}>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#FFD166", marginBottom: "2px" }}>{t.asha}</div>
            <div style={{ fontSize: "11px", color: "#C9A0A8" }}>{t.ashaDesc}</div>
          </div>
          <span style={{ color: "rgba(255,209,102,0.4)", fontSize: "18px" }}>â€º</span>
        </motion.button>
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
