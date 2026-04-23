// src/pages/AccountWizard.js
import React, { useState } from "react";

export default function AccountWizard({ onAccountAdded }) {
    const [manual, setManual] = useState(false);
    const [config, setConfig] = useState({
        name: "",
        email: "",
        password: "",
        type: "imap", // oder pop3
        incomingHost: "",
        incomingPort: 993,
        outgoingHost: "",
        outgoingPort: 465,
        secure: true
    });

    const handleAutoDetect = async () => {
        // Hier schicken wir die E-Mail an das Backend, 
        // das versucht, die Server-Settings autom. zu finden
        const settings = await window.api.detectSettings(config.email);
        if (settings) {
            setConfig({ ...config, ...settings });
            setManual(true);
        }
    };

    const handleSave = async () => {
        const result = await window.api.saveAccount(config);
        if (result.success) {
            onAccountAdded();
        } else {
            alert("Fehler: " + result.error);
        }
    };

    return (
        <div className="wizard-container" style={wizardStyle}>
            <h2>Konto einrichten</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <input placeholder="Ihr Name" onChange={e => setConfig({...config, name: e.target.value})} style={inputStyle} />
                <input placeholder="E-Mail Adresse" onChange={e => setConfig({...config, email: e.target.value})} style={inputStyle} />
                <input type="password" placeholder="Passwort" onChange={e => setConfig({...config, password: e.target.value})} style={inputStyle} />

                {!manual && (
                    <button onClick={handleAutoDetect} style={btnSecondary}>Weiter</button>
                )}

                {manual && (
                    <div style={{ borderTop: "1px solid #333", paddingTop: "10px" }}>
                        <select value={config.type} onChange={e => setConfig({...config, type: e.target.value})} style={inputStyle}>
                            <option value="imap">IMAP (Nachrichten auf dem Server lassen)</option>
                            <option value="pop3">POP3 (Nachrichten herunterladen)</option>
                        </select>
                        <input placeholder="Posteingangs-Server" value={config.incomingHost} onChange={e => setConfig({...config, incomingHost: e.target.value})} style={inputStyle} />
                        <input placeholder="Port" value={config.incomingPort} onChange={e => setConfig({...config, incomingPort: e.target.value})} style={inputStyle} />
                        <button onClick={handleSave} style={btnPrimary}>Konto erstellen</button>
                    </div>
                )}
            </div>
        </div>
    );
}

// Styles (Ausschnitt)
const wizardStyle = { background: "var(--bg-elevated)", padding: "30px", borderRadius: "12px", width: "450px", border: "1px solid var(--border)" };
const inputStyle = { width: "100%", padding: "10px", marginBottom: "8px", background: "var(--bg-surface)", border: "1px solid #444", color: "white" };
const btnPrimary = { width: "100%", padding: "12px", background: "var(--accent)", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" };
const btnSecondary = { width: "100%", padding: "12px", background: "#444", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" };