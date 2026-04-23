import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Search, Calendar as CalIcon, Filter, Clock, MapPin } from "lucide-react";

export default function CalendarPage() {
  const [view, setView] = useState("week");
  const timeSlots = Array.from({ length: 15 }, (_, i) => i + 7); // 7:00 bis 21:00 Uhr

  return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--bg-main)" }}>

        {/* 1. Header */}
        <header style={headerStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <h2 style={{ fontSize: "22px", fontWeight: 700 }}>Kalender</h2>
            <div style={btnGroup}>
              <button style={viewBtn(view === "day")} onClick={() => setView("day")}>Tag</button>
              <button style={viewBtn(view === "week")} onClick={() => setView("week")}>Woche</button>
              <button style={viewBtn(view === "month")} onClick={() => setView("month")}>Monat</button>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <div style={searchWrapper}>
              <Search size={16} color="var(--text-muted)" />
              <input placeholder="Termine suchen..." style={searchInput} />
            </div>
            <button style={primaryBtn}><Plus size={18} /> Neuer Termin</button>
          </div>
        </header>

        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

          {/* 2. Mini-Sidebar */}
          <aside style={calendarSidebar}>
            <div style={miniCalendarBox}>
              <div style={{ fontWeight: 600, marginBottom: "10px", fontSize: "13px" }}>April 2026</div>
              <div style={miniGrid}>
                {Array.from({ length: 30 }, (_, i) => (
                    <div key={i} style={miniDayStyle(i + 1 === 22)}>{i + 1}</div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: "30px" }}>
              <h4 style={sidebarTitle}>Meine Kalender</h4>
              <div style={checkRow}><input type="checkbox" defaultChecked /> <span style={{color: "#2e86ff"}}>●</span> Arbeit</div>
              <div style={checkRow}><input type="checkbox" defaultChecked /> <span style={{color: "#2ecc71"}}>●</span> Privat</div>
              <div style={checkRow}><input type="checkbox" /> <span style={{color: "#f1c40f"}}>●</span> Autohaus-Events</div>
            </div>
          </aside>

          {/* 3. Haupt-View */}
          <main style={mainCalendarArea}>
            <div style={weekHeader}>
              <div style={{ width: "60px" }}></div>
              {["Mo 20.", "Di 21.", "Mi 22.", "Do 23.", "Fr 24.", "Sa 25.", "So 26."].map(day => (
                  <div key={day} style={dayColHeader(day.includes("22"))}>
                    {day}
                  </div>
              ))}
            </div>

            <div style={scrollArea}>
              <div style={timeGrid}>
                {timeSlots.map(hour => (
                    <div key={hour} style={timeRow}>
                      <div style={timeLabel}>{hour}:00</div>
                      {Array.from({ length: 7 }).map((_, i) => (
                          <div key={i} style={cellStyle}>
                            {i === 2 && hour === 10 && (
                                <div style={eventStyle}>
                                  <div style={{fontWeight: 700}}>AETHER OS Launch</div>
                                  <div style={{fontSize: "10px", opacity: 0.8}}>10:00 - 12:00</div>
                                </div>
                            )}
                          </div>
                      ))}
                    </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
  );
}

// --- ALLE STYLES DEFINIERT ---

const headerStyle = {
  padding: "16px 24px",
  borderBottom: "1px solid var(--border)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: "var(--bg-surface)"
};

const btnGroup = {
  display: "flex",
  background: "var(--bg-base)",
  padding: "4px",
  borderRadius: "8px",
  border: "1px solid var(--border)"
};

const viewBtn = (active) => ({
  padding: "6px 16px",
  border: "none",
  borderRadius: "6px",
  background: active ? "var(--bg-elevated)" : "transparent",
  color: active ? "var(--accent)" : "var(--text-muted)",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: active ? 600 : 400
});

const searchWrapper = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  background: "var(--bg-base)",
  padding: "8px 12px",
  borderRadius: "8px",
  border: "1px solid var(--border)"
};

const searchInput = {
  background: "transparent",
  border: "none",
  color: "white",
  outline: "none",
  fontSize: "14px"
};

const primaryBtn = {
  background: "var(--accent)",
  color: "white",
  border: "none",
  padding: "8px 16px",
  borderRadius: "8px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontWeight: 600,
  cursor: "pointer"
};

const calendarSidebar = {
  width: "240px",
  borderRight: "1px solid var(--border)",
  padding: "20px",
  background: "var(--bg-surface)"
};

const miniCalendarBox = {
  background: "var(--bg-base)",
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid var(--border)"
};

const miniGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(7, 1fr)",
  gap: "4px",
  fontSize: "11px",
  textAlign: "center"
};

const miniDayStyle = (active) => ({
  padding: "4px",
  borderRadius: "4px",
  background: active ? "var(--accent)" : "transparent",
  color: active ? "white" : "inherit",
  cursor: "pointer"
});

const mainCalendarArea = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  background: "var(--bg-base)"
};

const weekHeader = {
  display: "flex",
  borderBottom: "1px solid var(--border)",
  background: "var(--bg-surface)"
};

const dayColHeader = (today) => ({
  flex: 1,
  padding: "12px",
  textAlign: "center",
  fontSize: "13px",
  fontWeight: 600,
  color: today ? "var(--accent)" : "var(--text-primary)",
  borderLeft: "1px solid var(--border)",
  background: today ? "rgba(46, 134, 255, 0.05)" : "transparent"
});

const scrollArea = {
  flex: 1,
  overflowY: "auto"
};

const timeGrid = {
  display: "flex",
  flexDirection: "column"
};

const timeRow = {
  display: "flex",
  height: "60px",
  borderBottom: "1px solid var(--border-soft)"
};

const timeLabel = {
  width: "60px",
  fontSize: "11px",
  color: "var(--text-muted)",
  textAlign: "right",
  paddingRight: "10px",
  marginTop: "-8px"
};

const cellStyle = {
  flex: 1,
  borderLeft: "1px solid var(--border-soft)",
  position: "relative"
};

const eventStyle = {
  position: "absolute",
  top: "2px",
  left: "4px",
  right: "4px",
  height: "116px",
  background: "var(--accent)",
  borderRadius: "6px",
  padding: "8px",
  fontSize: "12px",
  color: "white",
  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  zIndex: 10,
  borderLeft: "4px solid rgba(0,0,0,0.3)"
};

const sidebarTitle = { fontSize: "11px", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "12px", letterSpacing: "1px", fontWeight: 700 };
const checkRow = { display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", marginBottom: "8px", cursor: "pointer" };