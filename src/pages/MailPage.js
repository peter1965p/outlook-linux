import React, { useState, useEffect, useCallback } from "react";
import { format, isValid } from "date-fns";
import { de } from "date-fns/locale";
import { Inbox, Send, FileText, Trash2, Plus, MailOpen, Search } from 'lucide-react';
import SendMailModal from '../components/SendMailModal';

// Konfiguration der Ordner mit Lucide Icons
const FOLDERS = [
  { id: "INBOX",   label: "Posteingang", icon: <Inbox size={18} /> },
  { id: "SENT",    label: "Gesendet",    icon: <Send size={18} /> },
  { id: "DRAFTS",  label: "Entwürfe",    icon: <FileText size={18} /> },
  { id: "TRASH",   label: "Gelöscht",    icon: <Trash2 size={18} /> },
];

export default function MailPage() {
  const [mails, setMails] = useState([]);
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);
  const [folder, setFolder] = useState("INBOX");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Erkennt Absender und liefert das Firmenlogo (Clearbit API)
  const getSenderIcon = (sender) => {
    if (!sender) return null;
    const s = sender.toLowerCase();
    if (s.includes("linkedin")) return "https://logo.clearbit.com/linkedin.com";
    if (s.includes("temu"))     return "https://logo.clearbit.com/temu.com";
    if (s.includes("google"))   return "https://logo.clearbit.com/google.com";
    if (s.includes("github"))   return "https://logo.clearbit.com/github.com";
    if (s.includes("amazon"))   return "https://logo.clearbit.com/amazon.com";
    if (s.includes("facebook")) return "https://logo.clearbit.com/facebook.com";
    if (s.includes("apple"))    return "https://logo.clearbit.com/apple.com";
    if (s.includes("paypal"))   return "https://logo.clearbit.com/paypal.com";
    return null;
  };

  const safeFormat = (dateStr, formatStr, options = {}) => {
    const d = new Date(dateStr);
    return isValid(d) ? format(d, formatStr, options) : "Unbekannt";
  };

  const loadMails = useCallback(async () => {
    setLoading(true);
    try {
      if (window.api?.fetchEmails) {
        const data = await window.api.fetchEmails(folder);
        setMails(Array.isArray(data) ? data : []);
      } else {
        // Mock-Daten für die Entwicklung
        setMails([
          { id: "1", from: "LinkedIn", subject: "Bestätige deine E-Mail-Adresse", date: new Date().toISOString(), isRead: false, snippet: "Bitte klicke auf den Button unten, um..." },
          { id: "2", from: "Temu", subject: "Blitzangebot: Nur für kurze Zeit!", date: new Date().toISOString(), isRead: true, snippet: "Sichere dir bis zu 90% Rabatt auf Elektronik." }
        ]);
      }
    } catch (error) {
      console.error("Fehler:", error);
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
    setDetail({ subject: mail.subject, from: mail.from, date: mail.date, body: "<p>Inhalt wird geladen...</p>" });
    try {
      if (window.api?.getMailDetail) {
        const fullMail = await window.api.getMailDetail(mail.id);
        setDetail(prev => ({ ...prev, body: fullMail.body }));
        if (!mail.isRead && window.api.markAsRead) {
          await window.api.markAsRead(mail.id);
          setMails(prev => prev.map(m => m.id === mail.id ? { ...m, isRead: true } : m));
        }
      }
    } catch (error) {
      console.error("Fehler beim Laden der Mail-Details:", error);
    }
  };

  return (
      <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "var(--bg-main)", color: "var(--text-primary)" }}>

        {/* --- SIDEBAR (Navigation) --- */}
        <div style={sidebarStyle}>
          <div style={sidebarHeaderStyle}>OUTLOOK LINUX</div>
          <div style={{ flex: 1 }}>
            {FOLDERS.map(f => (
                <button key={f.id} onClick={() => setFolder(f.id)} style={{
                  ...folderBtnStyle,
                  background: folder === f.id ? "var(--bg-active)" : "transparent",
                  color: folder === f.id ? "var(--accent)" : "var(--text-secondary)",
                }}>
                  {f.icon}
                  <span style={{ marginLeft: "12px", fontWeight: folder === f.id ? 600 : 400 }}>{f.label}</span>
                </button>
            ))}
          </div>

          <div style={{ paddingTop: 12, borderTop: "1px solid var(--border)" }}>
            <button onClick={() => setShowModal(true)} style={composeBtnStyle}>
              <Plus size={18} style={{ marginRight: "8px" }} /> Neue Mail
            </button>
          </div>
        </div>

        {/* --- MAIL LISTE (Mitte) --- */}
        <div style={listContainerStyle}>
          <div style={listHeaderStyle}>
            <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>
              {FOLDERS.find(f => f.id === folder)?.label}
            </h2>
          </div>

          {loading ? (
              <div style={emptyStateStyle}>Lade Postfach...</div>
          ) : mails.length === 0 ? (
              <div style={emptyStateStyle}>Keine Nachrichten.</div>
          ) : mails.map(mail => (
              <div key={mail.id} onClick={() => openMail(mail)} style={{
                ...mailCardStyle,
                background: selected === mail.id ? "var(--bg-active)" : !mail.isRead ? "rgba(59, 130, 246, 0.08)" : "transparent",
                borderLeft: !mail.isRead ? "3px solid var(--accent)" : "3px solid transparent",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                  <div style={smallAvatarStyle}>
                    {getSenderIcon(mail.from) ? (
                        <img src={getSenderIcon(mail.from)} style={imgStyle} alt="" />
                    ) : (
                        <span style={{ fontSize: "10px", fontWeight: "bold" }}>{mail.from[0].toUpperCase()}</span>
                    )}
                  </div>
                  <span style={{ fontSize: "13px", fontWeight: mail.isRead ? 500 : 800, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {mail.from.split('<')[0].trim()}
              </span>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                {safeFormat(mail.date, "dd.MM.")}
              </span>
                </div>
                <div style={{ fontSize: "14px", fontWeight: mail.isRead ? 400 : 700, marginBottom: 4, color: "var(--text-primary)" }}>
                  {mail.subject}
                </div>
                <div style={snippetStyle}>{mail.snippet}</div>
              </div>
          ))}
        </div>

        {/* --- MAIL READER (Rechts) --- */}
        <div style={{ flex: 1, overflowY: "auto", background: "var(--bg-main)" }}>
          {detail ? (
              <div style={{ maxWidth: "850px", margin: "0 auto", padding: "40px" }}>
                <h1 style={{ fontSize: "28px", fontWeight: 800, marginBottom: "30px", lineHeight: 1.2 }}>
                  {detail.subject}
                </h1>

                <div style={readerHeaderInfoStyle}>
                  <div style={largeAvatarStyle}>
                    {getSenderIcon(detail.from) ? (
                        <img src={getSenderIcon(detail.from)} style={imgStyle} alt="" />
                    ) : (
                        <span style={{ fontSize: "22px", color: "white", fontWeight: 800 }}>{detail.from ? detail.from[0].toUpperCase() : "?"}</span>
                    )}
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
                <Search size={48} style={{ marginBottom: "20px", color: "var(--border)" }} />
                <div style={{ fontSize: "18px", fontWeight: 600 }}>Postfach durchsuchen</div>
                <p style={{ color: "var(--text-muted)" }}>Wähle eine Mail aus, um sie zu lesen.</p>
              </div>
          )}
        </div>

        {/* Das Rich-Text Modal für neue Mails */}
        <SendMailModal isOpen={showModal} onClose={() => setShowModal(false)} />

      </div>
  );
}

// --- STYLES (Optimiert für dunkles UI) ---
const sidebarStyle = { width: 220, background: "var(--bg-surface)", borderRight: "1px solid var(--border)", padding: "16px 12px", flexShrink: 0, display: "flex", flexDirection: "column" };
const sidebarHeaderStyle = { padding: "0 12px 24px 12px", fontWeight: 800, fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1.5px" };
const folderBtnStyle = { width: "100%", display: "flex", alignItems: "center", padding: "10px 12px", borderRadius: "10px", marginBottom: "4px", border: "none", cursor: "pointer", fontSize: "14px", transition: "all 0.2s" };
const composeBtnStyle = { width: "100%", padding: "12px", borderRadius: "10px", background: "var(--accent)", color: "white", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)" };
const listContainerStyle = { width: 380, borderRight: "1px solid var(--border)", overflowY: "auto", flexShrink: 0, background: "var(--bg-list)" };
const listHeaderStyle = { padding: "20px 16px", borderBottom: "1px solid var(--border)", position: "sticky", top: 0, background: "var(--bg-list)", zIndex: 10 };
const mailCardStyle = { padding: "16px", borderBottom: "1px solid var(--border)", cursor: "pointer", transition: "background 0.2s" };
const snippetStyle = { fontSize: "12px", color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" };
const htmlContainerStyle = { lineHeight: "1.6", fontSize: "16px", background: "#ffffff", color: "#1a1a1a", padding: "35px", borderRadius: "16px", minHeight: "400px", boxShadow: "0 4px 20px rgba(0,0,0,0.2)" };
const readerHeaderInfoStyle = { display: "flex", alignItems: "center", gap: 15, marginBottom: "40px", padding: "20px", background: "var(--bg-surface)", borderRadius: "16px", border: "1px solid var(--border)" };
const smallAvatarStyle = { width: 30, height: 30, borderRadius: "50%", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", flexShrink: 0, overflow: "hidden" };
const largeAvatarStyle = { width: 56, height: 56, borderRadius: "50%", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", flexShrink: 0, overflow: "hidden", border: "2px solid var(--border)" };
const imgStyle = { width: "100%", height: "100%", objectFit: "cover" };
const emptyStateStyle = { padding: 40, textAlign: "center", color: "var(--text-muted)" };
const readerEmptyStateStyle = { height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" };