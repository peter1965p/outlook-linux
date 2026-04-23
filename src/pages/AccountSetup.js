// In einer neuen Datei: src/pages/AccountSetup.js
import React, { useState } from "react";

export default function AccountSetup({ onComplete }) {
    const [config, setConfig] = useState({
        user: "news24regional@gmail.com",
        pass: "",
        host: "imap.gmail.com",
        port: 993
    });

    const handleSubmit = async () => {
        const success = await window.api.addAccount(config);
        if (success) onComplete();
        else alert("Verbindung fehlgeschlagen!");
    };

    return (
        <div style={{ padding: 40, background: "var(--bg-elevated)", borderRadius: 12 }}>
            <h3>E-Mail Konto verknüpfen</h3>
            <input
                style={inputStyle}
                value={config.user}
                onChange={e => setConfig({...config, user: e.target.value})}
                placeholder="E-Mail"
            />
            <input
                type="password"
                style={inputStyle}
                value={config.pass}
                onChange={e => setConfig({...config, pass: e.target.value})}
                placeholder="App-Passwort"
            />
            <button onClick={handleSubmit} style={btnStyle}>Konto hinzufügen</button>
            <p style={{ fontSize: 10, marginTop: 10, color: "var(--text-muted)" }}>
                Tipp: Bei Gmail benötigst du ein "App-Passwort".
            </p>
        </div>
    );
}

const inputStyle = { width: '100%', marginBottom: 10, padding: 10, background: '#000', color: '#fff', border: '1px solid #333' };
const btnStyle = { width: '100%', padding: 10, background: 'var(--accent)', border: 'none', color: '#fff', cursor: 'pointer' };