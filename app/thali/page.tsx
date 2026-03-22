"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { Home, ScanLine, Salad, Users, ArrowLeft, MapPin, Filter } from "lucide-react";

const foods = [
  // Tamil Nadu
  { name: "Ragi Kanji", category: "Grains", region: "Tamil Nadu", iron: 4.8, desc: "Finger millet porridge", tip: "Have daily for breakfast", emoji: "🫙" },
  { name: "Murungai Keerai", category: "Greens", region: "Tamil Nadu", iron: 7.0, desc: "Drumstick leaves curry", tip: "Add to sambar 3x per week", emoji: "🥬" },
  { name: "Karunai Kizhangu", category: "Roots", region: "Tamil Nadu", iron: 3.2, desc: "Purple yam", tip: "Replace potato with this", emoji: "🍠" },
  { name: "Kollu Rasam", category: "Lentils", region: "Tamil Nadu", iron: 7.0, desc: "Horse gram soup", tip: "Have twice a week", emoji: "🍲" },
  { name: "Ellu Chutney", category: "Seeds", region: "Tamil Nadu", iron: 14.6, desc: "Sesame seed chutney", tip: "Use as daily condiment", emoji: "🫙" },
  { name: "Vellam Tea", category: "Drinks", region: "Tamil Nadu", iron: 2.8, desc: "Jaggery tea", tip: "Replace sugar with jaggery", emoji: "☕" },
  { name: "Arai Keerai", category: "Greens", region: "Tamil Nadu", iron: 8.5, desc: "Amaranth leaves stir-fry", tip: "Add to daily cooking", emoji: "🥬" },
  { name: "Poricha Kadala", category: "Lentils", region: "Tamil Nadu", iron: 5.5, desc: "Roasted chickpeas", tip: "Healthy iron-rich snack", emoji: "🫘" },
  { name: "Kezhvaragu Dosa", category: "Grains", region: "Tamil Nadu", iron: 3.9, desc: "Finger millet dosa", tip: "Make weekly for iron boost", emoji: "🫓" },
  { name: "Manathakkali Keerai", category: "Greens", region: "Tamil Nadu", iron: 9.2, desc: "Black nightshade leaves", tip: "Cook in ghee weekly", emoji: "🥬" },

  // North India
  { name: "Palak Paneer", category: "Greens", region: "North India", iron: 6.4, desc: "Spinach with cottage cheese", tip: "Pair with roti for best absorption", emoji: "🥬" },
  { name: "Rajma", category: "Lentils", region: "North India", iron: 8.2, desc: "Red kidney bean curry", tip: "Have weekly with rice", emoji: "🫘" },
  { name: "Chana Dal", category: "Lentils", region: "North India", iron: 5.3, desc: "Split chickpea dal", tip: "Daily dal for iron", emoji: "🫘" },
  { name: "Methi Paratha", category: "Greens", region: "North India", iron: 6.0, desc: "Fenugreek flatbread", tip: "Great for breakfast iron", emoji: "🫓" },
  { name: "Bajra Roti", category: "Grains", region: "North India", iron: 8.0, desc: "Pearl millet flatbread", tip: "Replace wheat roti with this", emoji: "🫓" },
  { name: "Sarson Ka Saag", category: "Greens", region: "North India", iron: 7.8, desc: "Mustard greens curry", tip: "Best in winter, high in iron", emoji: "🥬" },
  { name: "Kala Chana", category: "Lentils", region: "North India", iron: 7.5, desc: "Black chickpea curry", tip: "Soak overnight for better iron", emoji: "🫘" },
  { name: "Amaranth Ladoo", category: "Seeds", region: "North India", iron: 7.6, desc: "Rajgira sweet balls", tip: "Navratri iron superfood", emoji: "🍡" },
  { name: "Imli Chutney", category: "Drinks", region: "North India", iron: 2.7, desc: "Tamarind concentrate", tip: "Vitamin C boosts iron absorption", emoji: "🫙" },
  { name: "Jowar Roti", category: "Grains", region: "North India", iron: 4.1, desc: "Sorghum flatbread", tip: "Gluten-free iron grain", emoji: "🫓" },

  // Maharashtra
  { name: "Nachni Ladoo", category: "Grains", region: "Maharashtra", iron: 5.2, desc: "Ragi sweet balls", tip: "Excellent postpartum iron food", emoji: "🍡" },
  { name: "Shenga Chutney", category: "Seeds", region: "Maharashtra", iron: 3.5, desc: "Peanut dry chutney", tip: "Add to every meal", emoji: "🫙" },
  { name: "Matki Usal", category: "Lentils", region: "Maharashtra", iron: 6.8, desc: "Moth bean sprout curry", tip: "Sprouting increases iron by 30%", emoji: "🫘" },
  { name: "Ambadi Bhaji", category: "Greens", region: "Maharashtra", iron: 11.0, desc: "Gongura leaves stir-fry", tip: "Sour leaves — iron powerhouse", emoji: "🥬" },
  { name: "Halim Seeds Water", category: "Seeds", region: "Maharashtra", iron: 12.6, desc: "Garden cress seeds drink", tip: "Soak overnight, drink morning", emoji: "🥤" },
  { name: "Thalipeeth", category: "Grains", region: "Maharashtra", iron: 4.7, desc: "Multi-grain flatbread", tip: "Mix jowar, bajra, besan", emoji: "🫓" },
  { name: "Kuleeth Usal", category: "Lentils", region: "Maharashtra", iron: 6.2, desc: "Horse gram sprout curry", tip: "Soak for 12hrs before cooking", emoji: "🫘" },

  // Pan-India
  { name: "Dates (Khajoor)", category: "Roots", region: "Pan-India", iron: 5.3, desc: "Dried dates fruit", tip: "Have 3 daily, especially in periods", emoji: "🟫" },
  { name: "Pomegranate Juice", category: "Drinks", region: "Pan-India", iron: 0.3, desc: "Iron-absorbing booster drink", tip: "Vitamin C doubles iron absorption", emoji: "🥤" },
  { name: "Sunflower Seeds", category: "Seeds", region: "Pan-India", iron: 5.2, desc: "Roasted sunflower seeds", tip: "Snack instead of chips", emoji: "🌻" },
  { name: "Flaxseeds", category: "Seeds", region: "Pan-India", iron: 5.7, desc: "Alsi / linseed", tip: "Add 1 tsp to morning meal", emoji: "🌾" },
  { name: "Moringa Powder", category: "Greens", region: "Pan-India", iron: 28.2, desc: "Drumstick tree leaf powder", tip: "Add to smoothie or dal", emoji: "🌿" },
  { name: "Jaggery Block", category: "Roots", region: "Pan-India", iron: 11.0, desc: "Unrefined cane sugar", tip: "Replace sugar entirely with this", emoji: "🟫" },
  { name: "Amla Juice", category: "Drinks", region: "Pan-India", iron: 0.5, desc: "Indian gooseberry juice", tip: "Best vitamin C source — drink before meals", emoji: "🥤" },
  { name: "Til Gajak", category: "Seeds", region: "Pan-India", iron: 10.5, desc: "Sesame jaggery brittle", tip: "A sweet that fights anaemia", emoji: "🍬" },
  { name: "Soya Chunks", category: "Lentils", region: "Pan-India", iron: 9.5, desc: "Textured soy protein", tip: "Add to any curry for iron boost", emoji: "🫘" },
  { name: "Beetroot Juice", category: "Drinks", region: "Pan-India", iron: 0.8, desc: "Red iron-boosting juice", tip: "Best with amla/lemon for absorption", emoji: "🥤" },
];

const categories = ["All", "Greens", "Grains", "Lentils", "Seeds", "Roots", "Drinks"];
const regions = ["All Regions", "Tamil Nadu", "North India", "Maharashtra", "Pan-India"];

const regionColors: Record<string, string> = {
  "Tamil Nadu": "#FF6B6B",
  "North India": "#FFD166",
  "Maharashtra": "#A78BFA",
  "Pan-India": "#06D6A0",
};

const regionEmoji: Record<string, string> = {
  "Tamil Nadu": "🌴",
  "North India": "🌾",
  "Maharashtra": "🏔️",
  "Pan-India": "🇮🇳",
};

export default function ThaliPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeRegion, setActiveRegion] = useState("All Regions");
  const [added, setAdded] = useState<string[]>([]);
  const [showRegionFilter, setShowRegionFilter] = useState(false);

  const filtered = useMemo(() => {
    return foods.filter(f => {
      const catMatch = activeCategory === "All" || f.category === activeCategory;
      const regMatch = activeRegion === "All Regions" || f.region === activeRegion;
      return catMatch && regMatch;
    });
  }, [activeCategory, activeRegion]);

  const totalIron = added.reduce((sum, name) => sum + (foods.find(f => f.name === name)?.iron || 0), 0);
  const progress = Math.min((totalIron / 18) * 100, 100);

  const nav = [
    { icon: <Home size={22} />, label: "Home", path: "/", active: false },
    { icon: <ScanLine size={22} />, label: "Scan", path: "/scan", active: false },
    { icon: <Salad size={22} />, label: "Diet", path: "/thali", active: true },
    { icon: <Users size={22} />, label: "ASHA", path: "/asha", active: false },
  ];

  return (
    <div style={{ minHeight: "100vh", maxWidth: "430px", margin: "0 auto", background: "#0D0305", overflowY: "auto", overflowX: "hidden", paddingBottom: "100px" }}>
      {/* Ambient glow */}
      <div style={{ position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(255,209,102,0.07), transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 24px 8px", position: "relative", zIndex: 10 }}>
        <motion.button onClick={() => router.push("/")} whileTap={{ scale: 0.9 }}
          style={{ width: "40px", height: "40px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <ArrowLeft size={18} color="white" />
        </motion.button>
        <div>
          <p style={{ fontFamily: "Georgia, serif", fontSize: "18px", fontWeight: 700, color: "white", textAlign: "center" }}>Thali Doctor</p>
          <p style={{ color: "#C9A0A8", fontSize: "11px", textAlign: "center" }}>Iron-rich foods across India</p>
        </div>
        <motion.button
          onClick={() => setShowRegionFilter(!showRegionFilter)}
          whileTap={{ scale: 0.9 }}
          style={{ width: "40px", height: "40px", borderRadius: "12px", background: showRegionFilter ? "rgba(255,209,102,0.15)" : "rgba(255,255,255,0.05)", border: showRegionFilter ? "1px solid rgba(255,209,102,0.4)" : "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <Filter size={16} color={showRegionFilter ? "#FFD166" : "white"} />
        </motion.button>
      </motion.div>

      {/* Iron Goal */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        style={{ margin: "8px 24px 12px", background: "#1C0A0E", border: "1px solid rgba(255,209,102,0.2)", borderRadius: "16px", padding: "16px", position: "relative", zIndex: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
          <span style={{ color: "#C9A0A8", fontSize: "13px" }}>Daily Iron Goal</span>
          <span style={{ color: "#FFD166", fontSize: "13px", fontWeight: 600 }}>18mg recommended</span>
        </div>
        <div style={{ height: "8px", background: "rgba(255,255,255,0.05)", borderRadius: "4px", overflow: "hidden" }}>
          <motion.div
            style={{ height: "100%", borderRadius: "4px", background: progress >= 100 ? "#06D6A0" : "linear-gradient(to right, #C41230, #FFD166, #06D6A0)" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
          <span style={{ color: "#C9A0A8", fontSize: "11px" }}>{totalIron.toFixed(1)}mg tracked today</span>
          <span style={{ color: progress >= 100 ? "#06D6A0" : "#FFD166", fontSize: "11px", fontWeight: 600 }}>
            {progress >= 100 ? "✓ Goal reached!" : `${Math.max(0, 18 - totalIron).toFixed(1)}mg remaining`}
          </span>
        </div>
      </motion.div>

      {/* Region Filter (collapsible) */}
      <AnimatePresence>
        {showRegionFilter && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: "hidden", position: "relative", zIndex: 10 }}>
            <div style={{ padding: "0 24px 12px" }}>
              <p style={{ color: "#C9A0A8", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                <MapPin size={11} color="#C9A0A8" /> Region
              </p>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {regions.map((reg) => {
                  const isActive = activeRegion === reg;
                  const color = reg === "All Regions" ? "#C9A0A8" : regionColors[reg];
                  return (
                    <motion.button key={reg} onClick={() => setActiveRegion(reg)} whileTap={{ scale: 0.95 }}
                      style={{ padding: "6px 12px", borderRadius: "20px", border: isActive ? `1px solid ${color}` : "1px solid rgba(255,255,255,0.1)", background: isActive ? `${color}22` : "transparent", color: isActive ? color : "rgba(255,255,255,0.5)", fontSize: "12px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
                      {reg !== "All Regions" && <span>{regionEmoji[reg]}</span>}
                      {reg}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active region pill */}
      {activeRegion !== "All Regions" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ padding: "0 24px 8px", position: "relative", zIndex: 10, display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "11px", color: regionColors[activeRegion], background: `${regionColors[activeRegion]}18`, border: `1px solid ${regionColors[activeRegion]}44`, borderRadius: "20px", padding: "3px 10px", display: "flex", alignItems: "center", gap: "4px" }}>
            {regionEmoji[activeRegion]} {activeRegion}
          </span>
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => setActiveRegion("All Regions")}
            style={{ fontSize: "11px", color: "#C9A0A8", background: "transparent", border: "none", cursor: "pointer" }}>
            ✕ clear
          </motion.button>
        </motion.div>
      )}

      {/* Category Filter */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        style={{ padding: "0 24px 14px", overflowX: "auto", display: "flex", gap: "8px", position: "relative", zIndex: 10, scrollbarWidth: "none" }}>
        {categories.map((cat) => (
          <motion.button key={cat} onClick={() => setActiveCategory(cat)} whileTap={{ scale: 0.95 }}
            style={{ padding: "6px 14px", borderRadius: "20px", border: activeCategory === cat ? "1px solid rgba(255,209,102,0.5)" : "1px solid rgba(255,255,255,0.1)", background: activeCategory === cat ? "rgba(255,209,102,0.15)" : "transparent", color: activeCategory === cat ? "#FFD166" : "rgba(255,255,255,0.5)", fontSize: "12px", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>
            {cat}
          </motion.button>
        ))}
      </motion.div>

      {/* Results count */}
      <div style={{ padding: "0 24px 10px", position: "relative", zIndex: 10 }}>
        <span style={{ color: "#C9A0A8", fontSize: "11px" }}>{filtered.length} foods found</span>
      </div>

      {/* Food List */}
      <div style={{ padding: "0 24px", position: "relative", zIndex: 10 }}>
        <AnimatePresence mode="popLayout">
          {filtered.map((food, i) => {
            const isAdded = added.includes(food.name);
            const regColor = regionColors[food.region] || "#C9A0A8";
            return (
              <motion.div key={food.name}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.04 }}
                style={{ background: "#1C0A0E", border: isAdded ? "1px solid rgba(6,214,160,0.4)" : "1px solid rgba(255,45,78,0.1)", borderRadius: "16px", padding: "14px", marginBottom: "10px", display: "flex", alignItems: "center", gap: "12px" }}>
                {/* Emoji icon */}
                <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: isAdded ? "rgba(6,214,160,0.15)" : "rgba(255,209,102,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "22px" }}>
                  {food.emoji}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2px" }}>
                    <span style={{ color: "white", fontSize: "14px", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{food.name}</span>
                    <span style={{ color: "#FFD166", fontSize: "13px", fontWeight: 700, flexShrink: 0, marginLeft: "8px" }}>{food.iron}mg</span>
                  </div>
                  <p style={{ color: "#C9A0A8", fontSize: "11px", marginBottom: "3px" }}>{food.desc}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ color: "#06D6A0", fontSize: "10px" }}>{food.tip}</span>
                    <span style={{ color: regColor, fontSize: "9px", fontWeight: 600, background: `${regColor}18`, border: `1px solid ${regColor}33`, borderRadius: "8px", padding: "1px 6px", flexShrink: 0 }}>
                      {regionEmoji[food.region]} {food.region}
                    </span>
                  </div>
                </div>
                <motion.button
                  onClick={() => setAdded(prev => isAdded ? prev.filter(n => n !== food.name) : [...prev, food.name])}
                  whileTap={{ scale: 0.85 }}
                  style={{ width: "32px", height: "32px", borderRadius: "50%", background: isAdded ? "#06D6A0" : "rgba(255,255,255,0.05)", border: isAdded ? "none" : "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                  <span style={{ color: isAdded ? "white" : "#C9A0A8", fontSize: "16px", fontWeight: 700 }}>{isAdded ? "✓" : "+"}</span>
                </motion.button>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filtered.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ textAlign: "center", padding: "40px 0", color: "#C9A0A8", fontSize: "14px" }}>
            <p style={{ fontSize: "32px", marginBottom: "12px" }}>🔍</p>
            <p>No foods found for this combination.</p>
            <p style={{ fontSize: "12px", marginTop: "6px" }}>Try changing the category or region filter.</p>
          </motion.div>
        )}
      </div>

      {/* Bottom Nav */}
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
