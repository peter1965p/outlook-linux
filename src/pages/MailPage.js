import React, { useState, useEffect, useCallback } from "react";
import { format, isValid } from "date-fns";
import { de } from "date-fns/locale";

const FOLDERS = [
  { id: "INBOX",       label: "Posteingang", icon: "📥" },
  { id: "SENT",        label: "Gesendet",    icon: "📤" },
  { id: "DRAFTS",      label: "Entwürfe",    icon: "📝" },
  { id: "TRASH",       label: "Gelöscht",    icon: "🗑" },
];

export default function MailPage() {
  const [mails, setMails] = useState([]);
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);
  const [folder, setFolder] = useState("INBOX");
  const [loading, setLoading] = useState(true);
  const [composing, setComposing] = useState(false);
  const [compose, setCompose] = useState({ to: "", subject: "", body: "" });

  // Hilfsfunktion für sicheres Datums-Parsing
  const safeFormat = (dateStr, formatStr, options = {}) => {
    const d = new Date(dateStr);
    return isValid(d) ? format(d, formatStr, options) : "Unbekannt";
  };

  // Mails laden
  const loadMails = useCallback(async () => {
    setLoading(true);
    try {
      if (window.api && window.api.fetchEmails) {
        const data = await window.api.fetchEmails(folder);
        setMails(Array.isArray(data) ? data : []);
      } else {
        setMails([
          { id: "1", from: "System", subject: "Willkommen bei AETHER OS", date: new Date().toISOString(), isRead: false, snippet: "Entdecke die Möglichkeiten..." },
          { id: "2", from: "CachyOS", subject: "Performance optimiert", date: new Date().toISOString(), isRead: true, snippet: "Dein System läuft jetzt schneller." }
        ]);
      }
    } catch (error) {
      console.error("Fehler beim Laden:", error);
      setMails([]);
    } finally {
      setLoading(false);
    }
  }, [folder]);

  useEffect(() => {
    setSelected(null);
    setDetail(null);
    loadMails();
  }, [folder, loadMails]);

  const openMail = async (mail) => {
    setSelected(mail.id);
    // Sofort-Feedback für den User
    setDetail({ subject: mail.subject, from: mail.from, date: mail.date, body: "<p>Lade Inhalt...</p>" });

    try {
      if (window.api && window.api.getMailDetail) {
        const fullMail = await window.api.getMailDetail(mail.id);
        setDetail(prev => ({ ...prev, body: fullMail.body }));

        if (!mail.isRead && window.api.markAsRead) {
          await window.api.markAsRead(mail.id);
          setMails(prev => prev.map(m => m.id === mail.id ? { ...m, isRead: true } : m));
        }
      }
    } catch (error) {
      console.error("Detail-Fehler:", error);
      setDetail(prev => ({ ...prev, body: "<p style='color:red;'>Fehler beim Laden der Nachricht.</p>" }));
    }
  };

  const handleSend = async () => {
    try {
      if (window.api && window.api.sendMail) {
        await window.api.sendMail(compose);
        setComposing(false);
        setCompose({ to: "", subject: "", body: "" });
        alert("Mail erfolgreich gesendet!");
      }
    } catch (error) {
      alert("Senden fehlgeschlagen!");
    }
  };

  return (
      <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "var(--bg-main)" }}>

        {/* --- Sidebar für Ordner --- */}
        <div style={sidebarStyle}>
          <div style={sidebarHeaderStyle}>AETHER OS MAIL</div>
          {FOLDERS.map(f => (
              <button key={f.id} onClick={() => setFolder(f.id)} style={{
                ...folderBtnStyle,
                background: folder === f.id ? "var(--bg-active)" : "transparent",
                color: folder === f.id ? "var(--accent)" : "var(--text-secondary)",
                fontWeight: folder === f.id ? 600 : 400,
              }}>
                <span style={{ fontSize: "16px" }}>{f.icon}</span> {f.label}
              </button>
          ))}
          <div style={{ marginTop: "auto", paddingTop: 12, borderTop: "1px solid var(--border)" }}>
            <button onClick={() => setComposing(true)} style={composeBtnStyle}>
              + Neue Mail
            </button>
          </div>
        </div>

        {/* --- Mail Liste --- */}
        <div style={listContainerStyle}>
          <div style={listHeaderStyle}>
            <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>{FOLDERS.find(f => f.id === folder)?.label}</h2>
          </div>

          {loading ? (
              <div style={emptyStateStyle}>Lade Nachrichten...</div>
          ) : mails.length === 0 ? (
              <div style={emptyStateStyle}>Keine Nachrichten vorhanden.</div>
          ) : mails.map(mail => (
              <div key={mail.id} onClick={() => openMail(mail)} style={{
                ...mailCardStyle,
                background: selected === mail.id ? "var(--bg-active)" : !mail.isRead ? "rgba(46, 134, 255, 0.05)" : "transparent",
                borderLeft: !mail.isRead ? "4px solid var(--accent)" : "4px solid transparent",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: "13px", fontWeight: mail.isRead ? 500 : 800 }}>
                {mail.from.split('<')[0].trim()}
              </span>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                {safeFormat(mail.date, "dd.MM.")}
              </span>
                </div>
                <div style={{ fontSize: "14px", fontWeight: mail.isRead ? 400 : 700, marginBottom: 4 }}>
                  {mail.subject}
                </div>
                <div style={snippetStyle}>{mail.snippet}</div>
              </div>
          ))}
        </div>

        {/* --- Mail Reader (Der HTML Teil) --- */}
        <div style={{ flex: 1, overflowY: "auto", background: "var(--bg-main)" }}>
          {detail ? (
              <div style={{ maxWidth: "850px", margin: "0 auto", padding: "40px" }}>
                <h1 style={{ fontSize: "28px", fontWeight: 800, marginBottom: "30px", lineHeight: 1.2 }}>{detail.subject}</h1>

                <div style={readerHeaderInfoStyle}>
                  <div style={avatarStyle}>
                    {detail.from ? detail.from[0].toUpperCase() : "?"}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "16px", fontWeight: 700 }}>{detail.from}</div>
                    <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                      {safeFormat(detail.date, "PPP p", { locale: de })}
                    </div>
                  </div>
                </div>

                <div
                    style={htmlContainerStyle}
                    dangerouslySetInnerHTML={{ __html: detail.body }}
                />
              </div>
          ) : (
              <div style={readerEmptyStateStyle}>
                <div style={{ fontSize: "48px", marginBottom: "20px" }}>📬</div>
                <div style={{ fontSize: "18px", fontWeight: 600 }}>Posteingang durchsuchen</div>
                <p>Wähle eine Nachricht aus der Liste aus.</p>
              </div>
          )}
        </div>

        {/* --- Editor Modal --- */}
        {composing && (
            <div style={modalOverlayStyle}>
              <div style={modalContentStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <h3 style={{ margin: 0, fontSize: "20px", fontWeight: 800 }}>Neue Nachricht</h3>
                  <button onClick={() => setComposing(false)} style={closeModalBtnStyle}>✕</button>
                </div>
                <input placeholder="An" style={inputStyle} value={compose.to} onChange={e => setCompose({ ...compose, to: e.target.value })} />
                <input placeholder="Betreff" style={inputStyle} value={compose.subject} onChange={e => setCompose({ ...compose, subject: e.target.value })} />
                <textarea placeholder="Schreibe deine Nachricht..." rows={12} style={{ ...inputStyle, resize: "none" }} value={compose.body} onChange={e => setCompose({ ...compose, body: e.target.value })} />
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 15 }}>
                  <button onClick={() => setComposing(false)} style={cancelBtnStyle}>Abbrechen</button>
                  <button onClick={handleSend} style={sendBtnStyle}>Senden</button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
}

// --- Styles ---

const sidebarStyle = {
  width: 200, background: "var(--bg-surface)", borderRight: "1px solid var(--border)",
  padding: "12px 8px", flexShrink: 0, display: "flex", flexDirection: "column"
};

const sidebarHeaderStyle = {
  padding: "0 12px 16px 12px", fontWeight: 800, fontSize: "12px",
  color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px"
};

const folderBtnStyle = {
  width: "100%", display: "flex", alignItems: "center", gap: 10,
  padding: "10px 12px", borderRadius: 8, marginBottom: 4, border: "none",
  cursor: "pointer", fontSize: "14px", transition: "all 0.2s"
};

const composeBtnStyle = {
  width: "100%", padding: "12px", borderRadius: 8, background: "var(--accent)",
  color: "white", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: 700,
  boxShadow: "0 4px 12px rgba(46, 134, 255, 0.3)"
};

const listContainerStyle = {
  width: 380, borderRight: "1px solid var(--border)", overflowY: "auto",
  flexShrink: 0, background: "var(--bg-list)"
};

const listHeaderStyle = {
  padding: "20px 16px", borderBottom: "1px solid var(--border)",
  position: "sticky", top: 0, background: "var(--bg-list)", zIndex: 10
};

const mailCardStyle = {
  padding: "16px", borderBottom: "1px solid var(--border)",
  cursor: "pointer", transition: "background 0.2s"
};

const snippetStyle = {
  fontSize: "12px", color: "var(--text-muted)", whiteSpace: "nowrap",
  overflow: "hidden", textOverflow: "ellipsis"
};

const htmlContainerStyle = {
  lineHeight: "normal", fontSize: "16px", background: "white",
  color: "#333", padding: "30px", borderRadius: "12px", minHeight: "400px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.15)"
};

const readerHeaderInfoStyle = {
  display: "flex", alignItems: "center", gap: 15, marginBottom: "40px",
  padding: "20px", background: "var(--bg-surface)", borderRadius: "16px",
  border: "1px solid var(--border)"
};

const avatarStyle = {
  width: 48, height: 48, borderRadius: "50%", background: "var(--accent)",
  display: "flex", alignItems: "center", justifyContent: "center",
  color: "white", fontSize: "20px", fontWeight: 800
};

const emptyStateStyle = { padding: 40, textAlign: "center", color: "var(--text-muted)" };

const readerEmptyStateStyle = {
  height: "100%", display: "flex", flexDirection: "column",
  alignItems: "center", justifyContent: "center", color: "var(--text-muted)"
};

const modalOverlayStyle = {
  position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)",
  display: "flex", alignItems: "center", justifyContent: "center",
  zIndex: 100, backdropFilter: "blur(4px)"
};

const modalContentStyle = {
  background: "var(--bg-elevated)", borderRadius: "20px", width: "700px",
  padding: "30px", border: "1px solid var(--border)", boxShadow: "0 20px 40px rgba(0,0,0,0.4)"
};

const inputStyle = {
  width: "100%", background: "var(--bg-base)", border: "1px solid var(--border-strong)",
  borderRadius: "10px", padding: "14px", color: "var(--text-primary)", marginBottom: "15px",
  outline: "none", fontSize: "14px"
};

const closeModalBtnStyle = { background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "20px" };
const cancelBtnStyle = { background: "transparent", color: "var(--text-muted)", border: "none", cursor: "pointer", fontWeight: 600 };
const sendBtnStyle = { background: "var(--accent)", color: "white", padding: "12px 32px", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: 700 };