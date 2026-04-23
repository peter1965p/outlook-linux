import React from "react";
// Seiten-Imports
import MailPage from "../pages/MailPage";
import CalendarPage from "../pages/CalendarPage";
import ContactsPage from "../pages/ContactsPage";
import TasksPage from "../pages/TasksPage";
import SettingsPage from "../pages/SettingsPage";
import AccountsPage from "../pages/AccountPage";

// Lucide Icons
import {
  Mail,
  Calendar,
  Users,
  CheckSquare,
  Settings,
  UserPlus,
  LogOut,
  Power
} from "lucide-react";

// Navigation Konfiguration
const NAV = [
  { id: "mail",     icon: Mail,        label: "Posteingang" },
  { id: "calendar", icon: Calendar,    label: "Kalender"    },
  { id: "contacts", icon: Users,       label: "Kontakte"    },
  { id: "tasks",    icon: CheckSquare, label: "Aufgaben"    },
  { id: "accounts", icon: UserPlus,    label: "Konten"      },
  { id: "settings", icon: Settings,    label: "Optionen"    },
];

export default function Layout({ user, activePage, setActivePage, onLogout }) {
  // Mapping der IDs zu den tatsächlichen Komponenten
  const pageMap = {
    mail: MailPage,
    calendar: CalendarPage,
    contacts: ContactsPage,
    tasks: TasksPage,
    accounts: AccountsPage,
    settings: SettingsPage
  };

  // Fallback, falls die Seite nicht gefunden wird
  const ActivePage = pageMap[activePage] || MailPage;

  return (
      <div style={{
        display: "flex",
        height: "100vh",
        background: "var(--bg-base)",
        color: "var(--text-primary)",
        overflow: "hidden"
      }}>
        {/* Sidebar */}
        <aside style={{
          width: "260px", // Standardbreite, falls Variable nicht definiert
          background: "var(--bg-surface)",
          borderRight: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
        }}>
          {/* App title / Branding */}
          <div style={{
            padding: "20px 16px",
            borderBottom: "1px solid var(--border)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 32, height: 32,
                background: "linear-gradient(135deg, #2e86ff, #0055d4)",
                borderRadius: 8,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", fontWeight: "bold"
              }}>A</div>
              <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: "-0.5px" }}>
              AETHER OS
            </span>
            </div>
          </div>

          {/* Nav items */}
          <nav style={{ flex: 1, padding: "16px 8px", display: "flex", flexDirection: "column", gap: 4 }}>
            {NAV.map(item => {
              const Icon = item.icon;
              const isActive = activePage === item.id;

              return (
                  <button
                      key={item.id}
                      onClick={() => setActivePage(item.id)}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "10px 12px",
                        borderRadius: "8px",
                        background: isActive ? "var(--bg-active)" : "transparent",
                        color: isActive ? "var(--accent)" : "var(--text-secondary)",
                        fontWeight: isActive ? 600 : 400,
                        fontSize: "14px",
                        border: "none",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        textAlign: "left",
                      }}
                      onMouseOver={e => { if (!isActive) e.currentTarget.style.background = "var(--bg-hover)"; }}
                      onMouseOut={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                  >
                    <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                    <span>{item.label}</span>
                  </button>
              );
            })}
          </nav>

          {/* User footer */}
          <div style={{
            padding: "16px 8px",
            borderTop: "1px solid var(--border)",
            background: "rgba(0,0,0,0.05)"
          }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "8px", borderRadius: "8px",
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "var(--accent)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, fontWeight: 700, color: "white", flexShrink: 0,
                boxShadow: "0 2px 8px rgba(46,134,255,0.3)"
              }}>
                {user?.name?.[0]?.toUpperCase() || "P"}
              </div>
              <div style={{ flex: 1, overflow: "hidden" }}>
                <div style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}>
                  {user?.name || "Peter"}
                </div>
                <div style={{
                  fontSize: "11px",
                  color: "var(--text-muted)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}>
                  {user?.username || "news24regional@gmail.com"}
                </div>
              </div>
              <button
                  onClick={onLogout}
                  title="Abmelden"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--text-muted)",
                    display: "flex",
                    padding: "6px",
                    borderRadius: "6px",
                    transition: "all 0.2s"
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.color = "#ff4d4d";
                    e.currentTarget.style.background = "rgba(255,77,77,0.1)";
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.color = "var(--text-muted)";
                    e.currentTarget.style.background = "transparent";
                  }}
              >
                <Power size={18} />
              </button>
            </div>
          </div>
        </aside>

        {/* Main content area */}
        <main style={{
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          background: "var(--bg-main)"
        }}>
          <ActivePage onLogout={onLogout} user={user} />
        </main>
      </div>
  );
}