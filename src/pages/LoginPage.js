import React from "react";

export default function LoginPage({ onLogin }) {
  return (
    <div style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #0d0f14 0%, #0d1929 100%)",
      gap: 32,
    }}>
      {/* Logo */}
      <div style={{ textAlign: "center" }}>
        <div style={{
          width: 72, height: 72,
          background: "linear-gradient(135deg, #2e86ff, #0055d4)",
          borderRadius: 20,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 36, margin: "0 auto 16px",
          boxShadow: "0 8px 32px rgba(46,134,255,0.4)",
        }}>
          ✉
        </div>
        <h1 style={{
          fontSize: 28, fontWeight: 600,
          color: "#e8eaf0", letterSpacing: "-0.5px",
        }}>
          Outlook Linux
        </h1>
        <p style={{ color: "#8892a8", marginTop: 8, fontSize: 15 }}>
          Dein Microsoft-Konto auf CachyOS
        </p>
      </div>

      {/* Login Card */}
      <div style={{
        background: "#13161e",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16,
        padding: "32px 40px",
        width: 380,
        textAlign: "center",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
      }}>
        <p style={{ color: "#8892a8", marginBottom: 24, lineHeight: 1.6 }}>
          Melde dich mit deinem Microsoft-Konto an, um auf Mails,
          Kalender, Kontakte und Aufgaben zuzugreifen.
        </p>

        <button
          onClick={onLogin}
          style={{
            width: "100%",
            padding: "12px 0",
            background: "linear-gradient(135deg, #2e86ff, #0055d4)",
            color: "white",
            border: "none",
            borderRadius: 8,
            fontSize: 15,
            fontWeight: 500,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            transition: "opacity 0.15s",
          }}
          onMouseOver={e => e.currentTarget.style.opacity = "0.85"}
          onMouseOut={e => e.currentTarget.style.opacity = "1"}
        >
          <span style={{ fontSize: 18 }}>⊞</span>
          Mit Microsoft anmelden
        </button>

        <p style={{ color: "#4a5268", fontSize: 12, marginTop: 20, lineHeight: 1.6 }}>
          Deine Daten werden direkt von Microsoft abgerufen
          und nie auf fremden Servern gespeichert.
        </p>
      </div>
    </div>
  );
}
