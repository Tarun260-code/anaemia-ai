"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Home, ScanLine, Salad, Users, ArrowLeft, Eye, Share2, Download } from "lucide-react";

type Risk = "LOW" | "MODERATE" | "HIGH";
interface Result { risk: Risk; confidence: number; hemoglobin: number; message: string; pregnancyMode?: boolean; symptomScore?: number; }

export default function ResultPage() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [animatedHb, setAnimatedHb] = useState(0);
  const [sharing, setSharing] = useState(false);
  const [shared, setShared] = useState(false);

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
      } catch { router.push("/scan"); }
    } else { router.push("/scan"); }
  }, [router]);

  const generateCard = (): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = canvasRef.current!;
      canvas.width = 800;
      canvas.height = 800;
      const ctx = canvas.getContext("2d")!;
      if (!result) return;

      const color = result.risk === "LOW" ? "#06D6A0" : result.risk === "MODERATE" ? "#FF9F1C" : "#FF2D4E";
      const label = result.risk === "LOW" ? "Low Risk" : result.risk === "MODERATE" ? "Moderate Risk" : "High Risk";
      const emoji = result.risk === "LOW" ? "✅" : result.risk === "MODERATE" ? "⚠️" : "🚨";

      // Background
      ctx.fillStyle = "#0D0305";
      ctx.fillRect(0, 0, 800, 800);

      // Radial glow
      const grd = ctx.createRadialGradient(400, 300, 0, 400, 300, 400);
      grd.addColorStop(0, color + "22");
      grd.addColorStop(1, "transparent");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, 800, 800);

      // Top accent line
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, 800, 4);

      // App name
      ctx.fillStyle = "#C9A0A8";
      ctx.font = "bold 22px Georgia, serif";
      ctx.textAlign = "center";
      ctx.fillText("AnaemiaAI", 400, 60);

      // Tagline
      ctx.fillStyle = "#C9A0A8";
      ctx.font = "16px Arial";
      ctx.fillText("Free anaemia screening for every woman", 400, 88);

      // Big risk circle
      ctx.beginPath();
      ctx.arc(400, 230, 120, 0, Math.PI * 2);
      ctx.strokeStyle = color;
      ctx.lineWidth = 6;
      ctx.stroke();
      ctx.fillStyle = color + "22";
      ctx.fill();

      // Confidence number
      ctx.fillStyle = color;
      ctx.font = "bold 64px Georgia, serif";
      ctx.textAlign = "center";
      ctx.fillText(`${result.confidence}%`, 400, 248);

      ctx.fillStyle = color;
      ctx.font = "bold 14px Arial";
      ctx.fillText("CONFIDENCE", 400, 272);

      // Risk label pill background
      const pillW = 220;
      const pillH = 44;
      const pillX = 400 - pillW / 2;
      const pillY = 370;
      ctx.beginPath();
      ctx.roundRect(pillX, pillY, pillW, pillH, 22);
      ctx.fillStyle = color + "22";
      ctx.fill();
      ctx.strokeStyle = color + "66";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = color;
      ctx.font = "bold 20px Georgia, serif";
      ctx.textAlign = "center";
      ctx.fillText(`${emoji} ${label}`, 400, 399);

      // Divider
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(60, 440);
      ctx.lineTo(740, 440);
      ctx.stroke();

      // Stats row
      const stats = [
        { label: "Haemoglobin", value: `${result.hemoglobin} g/dL`, color: color },
        { label: "Risk Level", value: result.risk, color: color },
        { label: "Symptom Score", value: result.symptomScore !== undefined ? `${result.symptomScore}/9` : "N/A", color: "#FFD166" },
      ];
      stats.forEach((s, i) => {
        const x = 133 + i * 267;
        // Stat box
        ctx.beginPath();
        ctx.roundRect(x - 90, 460, 180, 90, 12);
        ctx.fillStyle = "#1C0A0E";
        ctx.fill();
        ctx.strokeStyle = s.color + "33";
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = s.color;
        ctx.font = "bold 22px Georgia, serif";
        ctx.textAlign = "center";
        ctx.fillText(s.value, x, 510);

        ctx.fillStyle = "#C9A0A8";
        ctx.font = "13px Arial";
        ctx.fillText(s.label, x, 535);
      });

      // Message
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.font = "15px Arial";
      ctx.textAlign = "center";
      const msg = result.risk === "LOW"
        ? "Your haemoglobin levels look healthy! Keep eating iron-rich foods."
        : result.risk === "MODERATE"
        ? "Mild anaemia detected. Visit a doctor & eat more iron-rich foods."
        : "Significant anaemia risk detected. Please see a doctor immediately.";
      // Word wrap
      const words = msg.split(" ");
      let line = "";
      let y = 590;
      words.forEach((word) => {
        const test = line + word + " ";
        if (ctx.measureText(test).width > 680 && line !== "") {
          ctx.fillText(line, 400, y);
          line = word + " ";
          y += 24;
        } else { line = test; }
      });
      ctx.fillText(line, 400, y);

      // Pregnancy mode badge
      if (result.pregnancyMode) {
        ctx.beginPath();
        ctx.roundRect(270, 640, 260, 34, 17);
        ctx.fillStyle = "rgba(255,209,102,0.15)";
        ctx.fill();
        ctx.strokeStyle = "rgba(255,209,102,0.4)";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = "#FFD166";
        ctx.font = "bold 14px Arial";
        ctx.textAlign = "center";
        ctx.fillText("🤰 Pregnancy Mode Scan", 400, 662);
      }

      // Science badge
      ctx.fillStyle = "rgba(6,214,160,0.1)";
      ctx.beginPath();
      ctx.roundRect(200, 690, 400, 32, 16);
      ctx.fill();
      ctx.strokeStyle = "rgba(6,214,160,0.3)";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = "#06D6A0";
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Based on Nature 2025 research · 98.47% accuracy", 400, 711);

      // Bottom
      ctx.fillStyle = "#C9A0A8";
      ctx.font = "13px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Scan yours free at AnaemiaAI · For every Indian woman", 400, 760);

      ctx.fillStyle = "#FF2D4E";
      ctx.font = "bold 13px Arial";
      ctx.fillText("This is a screening tool. Not a medical diagnosis.", 400, 785);

      canvas.toBlob((blob) => { if (blob) resolve(blob); }, "image/png");
    });
  };

  const handleShare = async () => {
    setSharing(true);
    try {
      const blob = await generateCard();
      const file = new File([blob], "anaemia-result.png", { type: "image/png" });
      const riskLabel = result?.risk === "LOW" ? "Low Risk" : result?.risk === "MODERATE" ? "Moderate Risk" : "High Risk";
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "My AnaemiaAI Result",
          text: `My anaemia screening result: ${riskLabel} (${result?.confidence}% confidence, Hb: ${result?.hemoglobin} g/dL). Screened free with AnaemiaAI!`,
          files: [file],
        });
        setShared(true);
      } else {
        // Fallback: download
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "anaemia-result.png";
        a.click();
        URL.revokeObjectURL(url);
        setShared(true);
      }
    } catch (e) { console.error(e); }
    setSharing(false);
    setTimeout(() => setShared(false), 3000);
  };

  if (!result) return (
    <div style={{ minHeight: "100vh", background: "#0D0305", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <motion.div style={{ width: "40px", height: "40px", border: "3px solid rgba(255,45,78,0.3)", borderTop: "3px solid #FF2D4E", borderRadius: "50%" }}
        animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
    </div>
  );

  const color = result.risk === "LOW" ? "#06D6A0" : result.risk === "MODERATE" ? "#FF9F1C" : "#FF2D4E";
  const bgColor = result.risk === "LOW" ? "rgba(6,214,160,0.1)" : result.risk === "MODERATE" ? "rgba(255,159,28,0.1)" : "rgba(255,45,78,0.1)";
  const label = result.risk === "LOW" ? "Low Risk" : result.risk === "MODERATE" ? "Moderate Risk" : "High Risk";
  const message = result.risk === "LOW"
    ? "Great news! Your eyelid colour suggests healthy haemoglobin levels. Keep eating iron-rich foods to stay healthy."
    : result.risk === "MODERATE"
    ? "Your eyelid shows some pallor. You may have mild anaemia. Visit a doctor and start eating more iron-rich foods."
    : "Your eyelid shows significant pallor indicating possible severe anaemia. Please see a doctor immediately.";

  const nav = [
    { icon: <Home size={22} />, label: "Home", path: "/", active: false },
    { icon: <ScanLine size={22} />, label: "Scan", path: "/scan", active: false },
    { icon: <Salad size={22} />, label: "Diet", path: "/thali", active: false },
    { icon: <Users size={22} />, label: "ASHA", path: "/asha", active: false },
  ];

  return (
    <div style={{ minHeight: "100vh", maxWidth: "430px", margin: "0 auto", background: "#0D0305", overflowY: "auto", overflowX: "hidden", paddingBottom: "100px" }}>
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <div style={{ position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)", width: "400px", height: "400px", background: `radial-gradient(circle, ${bgColor}, transparent 70%)`, pointerEvents: "none", zIndex: 0 }} />

      {/* Header */}
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
        {/* Share button in header */}
        <motion.button onClick={handleShare} whileTap={{ scale: 0.9 }} disabled={sharing}
          style={{ width: "40px", height: "40px", borderRadius: "12px", background: shared ? "rgba(6,214,160,0.2)" : "rgba(255,255,255,0.05)", border: shared ? "1px solid rgba(6,214,160,0.4)" : "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          {sharing ? (
            <motion.div style={{ width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid white", borderRadius: "50%" }}
              animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} />
          ) : shared ? (
            <span style={{ fontSize: "16px" }}>✓</span>
          ) : (
            <Share2 size={16} color="white" />
          )}
        </motion.button>
      </motion.div>

      {/* Pregnancy mode badge */}
      {result.pregnancyMode && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ margin: "0 24px 8px", background: "rgba(255,209,102,0.1)", border: "1px solid rgba(255,209,102,0.3)", borderRadius: "10px", padding: "8px 14px", display: "flex", alignItems: "center", gap: "6px", position: "relative", zIndex: 10 }}>
          <span style={{ fontSize: "14px" }}>🤰</span>
          <span style={{ color: "#FFD166", fontSize: "12px", fontWeight: 600 }}>Pregnancy Mode — threshold 10.5 g/dL</span>
        </motion.div>
      )}

      {/* Risk Badge */}
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        style={{ display: "flex", justifyContent: "center", padding: "16px 24px 16px", position: "relative", zIndex: 10 }}>
        <div style={{ textAlign: "center" }}>
          <motion.div
            animate={{ boxShadow: [`0 0 30px ${color}40`, `0 0 60px ${color}70`, `0 0 30px ${color}40`] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ width: "140px", height: "140px", borderRadius: "50%", background: bgColor, border: `3px solid ${color}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <span style={{ fontSize: "36px", fontWeight: 900, color: color, fontFamily: "Georgia, serif" }}>{result.confidence}%</span>
            <span style={{ fontSize: "11px", color: color, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Confidence</span>
          </motion.div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: bgColor, border: `1px solid ${color}40`, borderRadius: "20px", padding: "8px 20px" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: color, boxShadow: `0 0 8px ${color}` }} />
            <span style={{ color: color, fontSize: "16px", fontWeight: 700 }}>{label}</span>
          </div>
        </div>
      </motion.div>

      {/* Hemoglobin Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        style={{ margin: "0 24px 16px", background: "#1C0A0E", border: `1px solid ${color}30`, borderRadius: "20px", padding: "20px", position: "relative", zIndex: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <span style={{ color: "#C9A0A8", fontSize: "13px", fontWeight: 500 }}>Estimated Haemoglobin</span>
          <span style={{ color: color, fontSize: "22px", fontWeight: 900, fontFamily: "Georgia, serif" }}>{animatedHb} g/dL</span>
        </div>
        <div style={{ height: "8px", background: "rgba(255,255,255,0.05)", borderRadius: "4px", overflow: "hidden" }}>
          <motion.div style={{ height: "100%", borderRadius: "4px", background: `linear-gradient(to right, ${color}80, ${color})` }}
            initial={{ width: "0%" }} animate={{ width: `${(result.hemoglobin / 16) * 100}%` }}
            transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
          <span style={{ color: "#C9A0A8", fontSize: "10px" }}>0</span>
          <span style={{ color: "#C9A0A8", fontSize: "10px" }}>Normal: 12-16 g/dL</span>
          <span style={{ color: "#C9A0A8", fontSize: "10px" }}>16</span>
        </div>
      </motion.div>

      {/* Message */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        style={{ margin: "0 24px 16px", background: bgColor, border: `1px solid ${color}30`, borderRadius: "16px", padding: "16px", position: "relative", zIndex: 10 }}>
        <div style={{ fontSize: "11px", fontWeight: 700, color: color, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>Analysis</div>
        <p style={{ color: "white", fontSize: "14px", lineHeight: 1.6 }}>{message}</p>
        <p style={{ color: "#C9A0A8", fontSize: "12px", marginTop: "8px", fontStyle: "italic" }}>{result.message}</p>
      </motion.div>

      {/* Stats Row */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", padding: "0 24px 16px", position: "relative", zIndex: 10 }}>
        {[
          { label: "Risk Level", value: result.risk, color },
          { label: "Confidence", value: `${result.confidence}%`, color: "#FFD166" },
          { label: "Symptom Score", value: result.symptomScore !== undefined ? `${result.symptomScore}/9` : "—", color: "#06D6A0" },
        ].map((s, i) => (
          <div key={i} style={{ background: "#1C0A0E", border: "1px solid rgba(255,45,78,0.12)", borderRadius: "14px", padding: "14px 8px", textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: `linear-gradient(to right, transparent, ${s.color}60, transparent)` }} />
            <div style={{ fontSize: "16px", fontWeight: 900, color: s.color, fontFamily: "Georgia, serif", marginBottom: "2px" }}>{s.value}</div>
            <div style={{ fontSize: "10px", color: "#C9A0A8", textTransform: "uppercase", letterSpacing: "0.5px" }}>{s.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Action Buttons */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
        style={{ padding: "0 24px 12px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", position: "relative", zIndex: 10 }}>
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

      {/* Share Card Button */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}
        style={{ padding: "0 24px 16px", position: "relative", zIndex: 10 }}>
        <motion.button onClick={handleShare} disabled={sharing} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", background: shared ? "rgba(6,214,160,0.15)" : "rgba(255,255,255,0.04)", color: shared ? "#06D6A0" : "#C9A0A8", fontWeight: 700, fontSize: "14px", padding: "14px", borderRadius: "16px", border: shared ? "1px solid rgba(6,214,160,0.4)" : "1px solid rgba(255,255,255,0.1)", cursor: "pointer" }}>
          {sharing ? (
            <motion.div style={{ width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.2)", borderTop: "2px solid #C9A0A8", borderRadius: "50%" }}
              animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} />
          ) : shared ? (
            <><span>✓</span> Result card saved!</>
          ) : (
            <><Share2 size={16} /> Share Result on WhatsApp</>
          )}
        </motion.button>
      </motion.div>

      {/* Disclaimer */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
        style={{ margin: "0 24px 16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "14px 16px", position: "relative", zIndex: 10 }}>
        <p style={{ color: "#C9A0A8", fontSize: "11px", lineHeight: 1.6, textAlign: "center" }}>
          This is a screening tool only and not a medical diagnosis. Always consult a qualified doctor for accurate diagnosis and treatment. Based on Nature 2025 research — 98.47% accuracy.
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
