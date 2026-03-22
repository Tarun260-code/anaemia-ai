"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Home, ScanLine, Salad, Users, ArrowLeft } from "lucide-react";

const foods = [
  { name: "Ragi Kanji", tamil: "Ragi Kanji", category: "Grains", iron: 4.8, desc: "Finger millet porridge", tip: "Have daily for breakfast" },
  { name: "Murungai Keerai", tamil: "Murungai Keerai", category: "Greens", iron: 7.0, desc: "Drumstick leaves curry", tip: "Add to sambar 3x per week" },
  { name: "Karunai Kizhangu", tamil: "Karunai Kizhangu", category: "Roots", iron: 3.2, desc: "Purple yam", tip: "Replace potato with this" },
  { name: "Kollu Rasam", tamil: "Kollu Rasam", category: "Lentils", iron: 7.0, desc: "Horse gram soup", tip: "Have twice a week" },
  { name: "Ellu Chutney", tamil: "Ellu Chutney", category: "Seeds", iron: 14.6, desc: "Sesame seed chutney", tip: "Use as daily condiment" },
  { name: "Vellam Tea", tamil: "Vellam Tea", category: "Drinks", iron: 11.0, desc: "Jaggery tea", tip: "Replace sugar with jaggery" },
  { name: "Arai Keerai", tamil: "Arai Keerai", category: "Greens", iron: 8.5, desc: "Amaranth leaves", tip: "Add to daily cooking" },
  { name: "Poricha Kadala", tamil: "Poricha Kadala", category: "Lentils", iron: 5.5, desc: "Roasted chickpeas", tip: "Healthy iron-rich snack" },
];

const categories = ["All", "Greens", "Grains", "Lentils", "Seeds", "Roots", "Drinks"];

export default function ThaliPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("All");
  const [added, setAdded] = useState<string[]>([]);

  const filtered = activeCategory === "All" ? foods : foods.filter(f => f.category === activeCategory);
  const totalIron = added.reduce((sum, name) => sum + (foods.find(f => f.name === name)?.iron || 0), 0);

  const nav = [
    { icon: <Home size={22} />, label: "Home", path: "/", active: false },
    { icon: <ScanLine size={22} />, label: "Scan", path: "/scan", active: false },
    { icon: <Salad size={22} />, label: "Diet", path: "/thali", active: true },
    { icon: <Users size={22} />, label: "ASHA", path: "/asha", active: false },
  ];

  return (
    <div style={{ minHeight: "100vh", maxWidth: "430px", margin: "0 auto", background: "#0D0305", overflowY: "auto", overflowX: "hidden", paddingBottom: "100px" }}>
      <div style={{ position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(255,209,102,0.08), transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 24px 8px", position: "relative", zIndex: 10 }}>
        <motion.button onClick={() => router.push("/")} whileTap={{ scale: 0.9 }}
          style={{ width: "40px", height: "40px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <ArrowLeft size={18} color="white" />
        </motion.button>
        <div>
          <p style={{ fontFamily: "Georgia, serif", fontSize: "18px", fontWeight: 700, color: "white", textAlign: "center" }}>Thali Doctor</p>
          <p style={{ color: "#C9A0A8", fontSize: "11px", textAlign: "center" }}>Tamil Nadu iron-rich foods</p>
        </div>
        <div style={{ width: "40px" }} />
      </motion.div>

      {/* Iron Goal */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        style={{ margin: "8px 24px 16px", background: "#1C0A0E", border: "1px solid rgba(255,209,102,0.2)", borderRadius: "16px", padding: "16px", position: "relative", zIndex: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
          <span style={{ color: "#C9A0A8", fontSize: "13px" }}>Daily Iron Goal</span>
          <span style={{ color: "#FFD166", fontSize: "13px", fontWeight: 600 }}>18mg recommended</span>
        </div>
        <div style={{ height: "8px", background: "rgba(255,255,255,0.05)", borderRadius: "4px", overflow: "hidden" }}>
          <motion.div style={{ height: "100%", borderRadius: "4px", background: "linear-gradient(to right, #C41230, #FFD166, #06D6A0)" }}
            animate={{ width: `${Math.min((totalIron / 18) * 100, 100)}%` }}
            transition={{ duration: 0.5 }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
          <span style={{ color: "#C9A0A8", fontSize: "11px" }}>{totalIron.toFixed(1)}mg from today</span>
          <span style={{ color: "#FFD166", fontSize: "11px", fontWeight: 600 }}>{Math.max(0, 18 - totalIron).toFixed(1)}mg remaining</span>
        </div>
      </motion.div>

      {/* Category Filter */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        style={{ padding: "0 24px 16px", overflowX: "auto", display: "flex", gap: "8px", position: "relative", zIndex: 10 }}>
        {categories.map((cat) => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            style={{ padding: "6px 14px", borderRadius: "20px", border: activeCategory === cat ? "1px solid rgba(255,209,102,0.5)" : "1px solid rgba(255,255,255,0.1)", background: activeCategory === cat ? "rgba(255,209,102,0.15)" : "transparent", color: activeCategory === cat ? "#FFD166" : "rgba(255,255,255,0.5)", fontSize: "12px", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>
            {cat}
          </button>
        ))}
      </motion.div>

      {/* Food List */}
      <div style={{ padding: "0 24px", position: "relative", zIndex: 10 }}>
        {filtered.map((food, i) => (
          <motion.div key={food.name}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            style={{ background: "#1C0A0E", border: added.includes(food.name) ? "1px solid rgba(6,214,160,0.4)" : "1px solid rgba(255,45,78,0.1)", borderRadius: "16px", padding: "14px", marginBottom: "10px", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: added.includes(food.name) ? "rgba(6,214,160,0.2)" : "rgba(255,209,102,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Salad size={20} color={added.includes(food.name) ? "#06D6A0" : "#FFD166"} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2px" }}>
                <span style={{ color: "white", fontSize: "14px", fontWeight: 600 }}>{food.name}</span>
                <span style={{ color: "#FFD166", fontSize: "13px", fontWeight: 700 }}>{food.iron}mg</span>
              </div>
              <p style={{ color: "#C9A0A8", fontSize: "11px", marginBottom: "2px" }}>{food.desc}</p>
              <p style={{ color: "#06D6A0", fontSize: "10px" }}>{food.tip}</p>
            </div>
            <motion.button
              onClick={() => setAdded(prev => prev.includes(food.name) ? prev.filter(n => n !== food.name) : [...prev, food.name])}
              whileTap={{ scale: 0.9 }}
              style={{ width: "32px", height: "32px", borderRadius: "50%", background: added.includes(food.name) ? "#06D6A0" : "rgba(255,255,255,0.05)", border: added.includes(food.name) ? "none" : "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
              <span style={{ color: added.includes(food.name) ? "white" : "#C9A0A8", fontSize: "16px", fontWeight: 700 }}>{added.includes(food.name) ? "✓" : "+"}</span>
            </motion.button>
          </motion.div>
        ))}
      </div>

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
