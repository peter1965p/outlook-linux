import React, { useState } from "react";

export default function AccountPage() {
    const [isManual, setIsManual] = useState(false);
    const [config, setConfig] = useState({
        label: "Privat",
        email: "",
        password: "",
        type: "imap", // Standard
        incomingHost: "",
        incomingPort: 993,
        outgoingHost: "",
        outgoingPort: 465,
    });

    const handleSave = async () => {
        // Schickt die Daten an den Electron-Main-Prozess
        const result = await window.api.saveAccount(config);
        if (result.success) {
            alert("Konto erfolgreich hinzugefügt!");
        } else {
            alert("Login fehlgeschlagen: " + result.error);
        }
    };

    return (
        <div style={{ padding: 32, maxWidth: 600, color: "var(--text-primary)" }}>
            <h2 style={{ marginBottom: 24 }}>E-Mail-Konto einrichten</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <input
                    placeholder="Name des Kontos (z.B. Arbeit)"
                    style={inputStyle}
                    value={config.label}
                    onChange={e => setConfig({...config, label: e.target.value})}
                />
                <input
                    placeholder="E-Mail Adresse"
                    style={inputStyle}
                    value={config.email}
                    onChange={e => setConfig({...config, email: e.target.value})}
                />
                <input
                    type="password"
                    placeholder="Passwort"
                    style={inputStyle}
                    value={config.password}
                    onChange={e => setConfig({...config, password: e.target.value})}
                />

                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <input
                        type="checkbox"
                        checked={isManual}
                        onChange={() => setIsManual(!isManual)}
                    />
                    <label style={{ fontSize: 13 }}>Manuelle Konfiguration (POP/IMAP)</label>
                </div>

                {isManual && (
                    <div style={{ padding: 16, background: "var(--bg-elevated)", borderRadius: 8, display: "flex", flexDirection: "column", gap: 12 }}>
                        <select
                            style={inputStyle}
                            value={config.type}
                            onChange={e => setConfig({...config, type: e.target.value})}
                        >
                            <option value="imap">IMAP (Nachrichten bleiben auf dem Server)</option>
                            <option value="pop3">POP3 (Nachrichten werden heruntergeladen)</option>
                        </select>
                        <div style={{ display: "flex", gap: 10 }}>
                            <input placeholder="Server" style={{...inputStyle, flex: 3}} onChange={e => setConfig({...config, incomingHost: e.target.value})} />
                            <input placeholder="Port" style={{...inputStyle, flex: 1}} onChange={e => setConfig({...config, incomingPort: e.target.value})} />
                        </div>
                    </div>
                )}

                <button onClick={handleSave} style={btnStyle}>
                    Konto erstellen
                </button>
            </div>
        </div>
    );
}

const inputStyle = {
    background: "var(--bg-surface)", border: "1px solid var(--border-strong)",
    borderRadius: 8, padding: "10px 14px", color: "var(--text-primary)", fontSize: 14, outline: "none"
};

const btnStyle = {
    background: "var(--accent)", color: "white", border: "none",
    borderRadius: 8, padding: "12px", cursor: "pointer", fontWeight: 600, marginTop: 10
};