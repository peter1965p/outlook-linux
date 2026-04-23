import React, { useState } from "react";
import {
    Settings as SettingsIcon,
    Clock,
    Shield,
    Palette,
    Info,
    LogOut,
    Monitor
} from "lucide-react";

export default function SettingsPage({ onLogout }) {
    // States für die Systemeinstellungen
    const [timeout, setTimeoutValue] = useState(5); // Die gewünschten 5 Minuten
    const [theme, setTheme] = useState("dark");
    const [systemName, setSystemName] = useState("AETHER OS");

    const sections = [
        {
            id: "general",
            title: "Allgemein",
            icon: SettingsIcon,
            content: (
                <div style={sectionContentStyle}>
                    <div style={rowStyle}>
                        <label>System-Name</label>
                        <input
                            style={inputStyle}
                            value={systemName}
                            onChange={(e) => setSystemName(e.target.value)}
                        />
                    </div>
                    <div style={rowStyle}>
                        <label>Erscheinungsbild</label>
                        <select style={inputStyle} value={theme} onChange={(e) => setTheme(e.target.value)}>
                            <option value="dark">Dark Mode (CachyOS optimized)</option>
                            <option value="light">Light Mode</option>
                            <option value="auto">Systemstandard</option>
                        </select>
                    </div>
                </div>
            )
        },
        {
            id: "security",
            title: "Sicherheit & Sitzung",
            icon: Shield,
            content: (
                <div style={sectionContentStyle}>
                    <div style={rowStyle}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <Clock size={16} color="var(--text-muted)" />
                            <label>Automatischer Logout (Min.)</label>
                        </div>
                        <input
                            type="number"
                            style={{ ...inputStyle, width: "60px" }}
                            value={timeout}
                            onChange={(e) => setTimeoutValue(e.target.value)}
                        />
                    </div>
                    <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 8 }}>
                        Nach {timeout} Minuten Inaktivität erfolgt ein 30-sekündiger Countdown vor dem Logout.
                    </p>
                </div>
            )
        },
        {
            id: "info",
            title: "System-Info",
            icon: Info,
            content: (
                <div style={sectionContentStyle}>
                    <div style={infoBoxStyle}>
                        <p><strong>Version:</strong> 1.0.0-beta (Lucide Edition)</p>
                        <p><strong>Build:</strong> 2026.04.22</p>
                        <p><strong>Plattform:</strong> Endeavour OS / CachyOS Kernel</p>
                        <p style={{ marginTop: 10, color: "var(--accent)" }}>✓ System ist auf dem neuesten Stand.</p>
                    </div>
                </div>
            )
        }
    ];

    return (
        <div style={{ padding: "40px", maxWidth: "900px", margin: "0 auto", color: "var(--text-primary)" }}>
            <header style={{ marginBottom: "40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <h1 style={{ fontSize: 28, fontWeight: 700, display: "flex", alignItems: "center", gap: 12 }}>
                        <Monitor size={32} color="var(--accent)" />
                        Systemeinstellungen
                    </h1>
                    <p style={{ color: "var(--text-muted)", marginTop: 8 }}>Konfiguriere deine AETHER OS Instanz</p>
                </div>
                <button onClick={onLogout} style={logoutBtnStyle}>
                    <LogOut size={18} /> Abmelden
                </button>
            </header>

            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {sections.map(section => (
                    <div key={section.id} style={sectionCardStyle}>
                        <div style={sectionHeaderStyle}>
                            <section.icon size={20} color="var(--accent)" />
                            <h2 style={{ fontSize: 18, fontWeight: 600 }}>{section.title}</h2>
                        </div>
                        {section.content}
                    </div>
                ))}
            </div>
        </div>
    );
}

// --- Styles ---

const sectionCardStyle = {
    background: "var(--bg-elevated)",
    borderRadius: "12px",
    border: "1px solid var(--border)",
    overflow: "hidden"
};

const sectionHeaderStyle = {
    padding: "16px 20px",
    background: "rgba(255,255,255,0.02)",
    borderBottom: "1px solid var(--border)",
    display: "flex",
    alignItems: "center",
    gap: "12px"
};

const sectionContentStyle = {
    padding: "20px"
};

const rowStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px"
};

const inputStyle = {
    background: "var(--bg-surface)",
    border: "1px solid var(--border-strong)",
    borderRadius: "6px",
    padding: "8px 12px",
    color: "var(--text-primary)",
    fontSize: "14px",
    outline: "none"
};

const infoBoxStyle = {
    background: "var(--bg-surface)",
    padding: "16px",
    borderRadius: "8px",
    fontSize: "13px",
    lineHeight: "1.6",
    color: "var(--text-secondary)"
};

const logoutBtnStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 20px",
    background: "#e74c3c22",
    color: "#e74c3c",
    border: "1px solid #e74c3c44",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 600,
    transition: "0.2s"
};