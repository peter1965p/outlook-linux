import React from "react";
import MailPage from "../pages/MailPage";
import CalendarPage from "../pages/CalendarPage";
import ContactsPage from "../pages/ContactsPage";
import TasksPage from "../pages/TasksPage";

const NAV = [
  { id: "mail",     icon: "✉",  label: "Posteingang" },
  { id: "calendar", icon: "📅", label: "Kalender"    },
  { id: "contacts", icon: "👤", label: "Kontakte"    },
  { id: "tasks",    icon: "✓",  label: "Aufgaben"    },
];

export default function Layout({ user, activePage, setActivePage, onLogout }) {
  const pageMap = { mail: MailPage, calendar: CalendarPage, contacts: ContactsPage, tasks: TasksPage };
  const ActivePage = pageMap[activePage];

  return (
    <div style={{ display: "flex", height: "100vh", background: "var(--bg-base)", overflow: "hidden" }}>
      {/* Sidebar */}
      <aside style={{
        width: "var(--sidebar-width)",
        background: "var(--bg-surface)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}>
        {/* App title */}
        <div style={{
          padding: "18px 16px 12px",
          borderBottom: "1px solid var(--border)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32,
              background: "linear-gradient(135deg, #2e86ff, #0055d4)",
              borderRadius: 8,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16,
            }}>✉</div>
            <span style={{ fontWeight: 600, fontSize: 15, color: "var(--text-primary)" }}>
              Outlook Linux
            </span>
          </div>
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: "12px 8px" }}>
          {NAV.map(item => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 12px",
                borderRadius: "var(--radius-sm)",
                marginBottom: 2,
                background: activePage === item.id ? "var(--bg-active)" : "transparent",
                color: activePage === item.id ? "var(--accent)" : "var(--text-secondary)",
                fontWeight: activePage === item.id ? 500 : 400,
                fontSize: 14,
                border: "none",
                cursor: "pointer",
                transition: "all 0.12s",
                textAlign: "left",
              }}
              onMouseOver={e => { if (activePage !== item.id) e.currentTarget.style.background = "var(--bg-hover)"; }}
              onMouseOut={e => { if (activePage !== item.id) e.currentTarget.style.background = "transparent"; }}
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* User footer */}
        <div style={{
          padding: "12px 8px",
          borderTop: "1px solid var(--border)",
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "8px 12px", borderRadius: "var(--radius-sm)",
          }}>
            <div style={{
              width: 30, height: 30, borderRadius: "50%",
              background: "var(--accent)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 600, color: "white", flexShrink: 0,
            }}>
              {user?.name?.[0]?.toUpperCase() || "?"}
            </div>
            <div style={{ flex: 1, overflow: "hidden" }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user?.name || "Unbekannt"}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user?.username || ""}
              </div>
            </div>
            <button
              onClick={onLogout}
              title="Abmelden"
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: "var(--text-muted)", fontSize: 16,
                padding: 4, borderRadius: 4,
              }}
              onMouseOver={e => { e.currentTarget.style.color = "var(--text-primary)"; }}
              onMouseOut={e => { e.currentTarget.style.color = "var(--text-muted)"; }}
            >
              ⏻
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <ActivePage />
      </main>
    </div>
  );
}
