import React, { useState } from "react";
import {
    Chrome,
    Settings,
    ShieldCheck,
    Mail,
    Lock,
    Server,
    Globe,
    ChevronDown,
    Plus
} from "lucide-react";

export default function AccountPage() {
    const [isManual, setIsManual] = useState(false);
    const [config, setConfig] = useState({
        label: "Privat",
        email: "",
        password: "",
        type: "imap",
        incomingHost: "",
        incomingPort: 993,
        outgoingHost: "",
        outgoingPort: 465,
    });

    const handleGoogleAuth = async () => {
        // Triggered den Google OAuth Flow im Electron Main
        console.log("Starte Google OAuth für Mail und Kalender...");
        const result = await window.api.startGoogleAuth();
        if (result.success) {
            alert("Google Konto erfolgreich verknüpft!");
        }
    };

    const handleSaveManual = async () => {
        const result = await window.api.saveAccount(config);
        if (result.success) {
            alert("Konto erfolgreich hinzugefügt!");
        } else {
            alert("Login fehlgeschlagen: " + result.error);
        }
    };

    return (
        <div style={{ padding: "40px", maxWidth: "700px", margin: "0 auto", color: "var(--text-primary)" }}>
            <header style={{ marginBottom: "32px" }}>
                <h2 style={{ fontSize: "28px", fontWeight: 800, marginBottom: "8px" }}>Konto einrichten</h2>
                <p style={{ color: "var(--text-muted)" }}>Verbinde deine Dienste mit AETHER OS</p>
            </header>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

                {/* Google OAuth Sektion */}
                <button onClick={handleGoogleAuth} style={googleBtnStyle}>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <div style={iconBoxStyle}><Chrome size={24} color="#4285F4" /></div>
                        <div style={{ textAlign: "left" }}>
                            <div style={{ fontWeight: 700, fontSize: "16px" }}>Mit Google anmelden</div>
                            <div style={{ fontSize: "12px", opacity: 0.7 }}>Synchronisiert Mail, Kalender & Kontakte</div>
                        </div>
                    </div>
                    <Plus size={20} />
                </button>

                <div style={dividerStyle}><span>oder manuell einrichten</span></div>

                {/* Manuelle Felder */}
                <div style={formCardStyle}>
                    <div style={inputGroup}>
                        <label style={labelStyle}><Settings size={14} /> Kontoname</label>
                        <input
                            placeholder="z.B. Arbeit oder Privat"
                            style={inputStyle}
                            value={config.label}
                            onChange={e => setConfig({...config, label: e.target.value})}
                        />
                    </div>

                    <div style={inputGroup}>
                        <label style={labelStyle}><Mail size={14} /> E-Mail Adresse</label>
                        <input
                            placeholder="name@beispiel.de"
                            style={inputStyle}
                            value={config.email}
                            onChange={e => setConfig({...config, email: e.target.value})}
                        />
                    </div>

                    <div style={inputGroup}>
                        <label style={labelStyle}><Lock size={14} /> Passwort / App-Passwort</label>
                        <input
                            type="password"
                            placeholder="••••••••••••"
                            style={inputStyle}
                            value={config.password}
                            onChange={e => setConfig({...config, password: e.target.value})}
                        />
                    </div>

                    <div
                        onClick={() => setIsManual(!isManual)}
                        style={{ ...checkRowStyle, color: isManual ? "var(--accent)" : "var(--text-muted)" }}
                    >
                        <Server size={16} />
                        <span style={{ fontSize: 13, fontWeight: 500 }}>Erweiterte Server-Einstellungen</span>
                        <ChevronDown size={14} style={{ transform: isManual ? "rotate(180deg)" : "none", transition: "0.2s" }} />
                    </div>

                    {isManual && (
                        <div style={manualBoxStyle}>
                            <div style={inputGroup}>
                                <label style={labelStyle}>Protokoll</label>
                                <select
                                    style={inputStyle}
                                    value={config.type}
                                    onChange={e => setConfig({...config, type: e.target.value})}
                                >
                                    <option value="imap">IMAP (Empfohlen)</option>
                                    <option value="pop3">POP3</option>
                                </select>
                            </div>
                            <div style={{ display: "flex", gap: "12px" }}>
                                <div style={{ flex: 3 }}>
                                    <label style={labelStyle}><Globe size={14} /> Server</label>
                                    <input placeholder="imap.beispiel.de" style={inputStyle} onChange={e => setConfig({...config, incomingHost: e.target.value})} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={labelStyle}>Port</label>
                                    <input placeholder="993" style={inputStyle} onChange={e => setConfig({...config, incomingPort: e.target.value})} />
                                </div>
                            </div>
                        </div>
                    )}

                    <button onClick={handleSaveManual} style={btnStyle}>
                        Konto manuell erstellen
                    </button>
                </div>

                <div style={securityBadgeStyle}>
                    <ShieldCheck size={16} />
                    <span>Deine Daten werden lokal verschlüsselt gespeichert.</span>
                </div>
            </div>
        </div>
    );
}

// --- Modern AETHER OS Styles ---

const googleBtnStyle = {
    background: "#ffffff",
    color: "#1a1a1a",
    border: "none",
    borderRadius: "12px",
    padding: "16px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    cursor: "pointer",
    fontWeight: 600,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    transition: "transform 0.2s"
};

const iconBoxStyle = {
    background: "#f0f0f0",
    padding: "10px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
};

const dividerStyle = {
    textAlign: "center",
    borderBottom: "1px solid var(--border)",
    lineHeight: "0.1em",
    margin: "10px 0 20px",
    fontSize: "12px",
    color: "var(--text-muted)",
    width: "100%"
};

const formCardStyle = {
    background: "var(--bg-surface)",
    border: "1px solid var(--border)",
    borderRadius: "16px",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "16px"
};

const inputGroup = {
    display: "flex",
    flexDirection: "column",
    gap: "6px"
};

const labelStyle = {
    fontSize: "12px",
    fontWeight: 600,
    color: "var(--text-secondary)",
    display: "flex",
    alignItems: "center",
    gap: "6px"
};

const inputStyle = {
    background: "var(--bg-base)",
    border: "1px solid var(--border-strong)",
    borderRadius: "8px",
    padding: "12px",
    color: "var(--text-primary)",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s"
};

const checkRowStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
    padding: "8px 0",
    marginTop: "8px"
};

const manualBoxStyle = {
    padding: "16px",
    background: "var(--bg-elevated)",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    border: "1px solid var(--border-soft)"
};

const btnStyle = {
    background: "var(--accent)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "14px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "15px",
    marginTop: "12px",
    boxShadow: "0 4px 10px rgba(46, 134, 255, 0.2)"
};

const securityBadgeStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontSize: "12px",
    color: "var(--text-muted)",
    marginTop: "10px"
};