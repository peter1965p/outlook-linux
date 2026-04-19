import React, { useState, useEffect, useCallback } from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";
import { getMails, getMailById, sendMail, deleteMail, markMailRead } from "../utils/graphApi";
import { format } from "date-fns";
import { de } from "date-fns/locale";

const FOLDERS = [
  { id: "inbox",       label: "Posteingang", icon: "📥" },
  { id: "sentitems",   label: "Gesendet",    icon: "📤" },
  { id: "drafts",      label: "Entwürfe",    icon: "📝" },
  { id: "deleteditems",label: "Gelöscht",    icon: "🗑" },
];

export default function MailPage() {
  const { instance, accounts } = useMsal();
  const [mails, setMails] = useState([]);
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);
  const [folder, setFolder] = useState("inbox");
  const [loading, setLoading] = useState(true);
  const [composing, setComposing] = useState(false);
  const [compose, setCompose] = useState({ to: "", subject: "", body: "" });

  const getToken = useCallback(async () => {
    const res = await instance.acquireTokenSilent({ ...loginRequest, account: accounts[0] });
    return res.accessToken;
  }, [instance, accounts]);

  useEffect(() => {
    setLoading(true);
    setSelected(null);
    setDetail(null);
    getToken().then(token => getMails(token, folder)).then(setMails).finally(() => setLoading(false));
  }, [folder, getToken]);

  const openMail = async (mail) => {
    setSelected(mail.id);
    const token = await getToken();
    if (!mail.isRead) {
      await markMailRead(token, mail.id);
      setMails(prev => prev.map(m => m.id === mail.id ? { ...m, isRead: true } : m));
    }
    const full = await getMailById(token, mail.id);
    setDetail(full);
  };

  const handleDelete = async (id) => {
    const token = await getToken();
    await deleteMail(token, id);
    setMails(prev => prev.filter(m => m.id !== id));
    if (selected === id) { setSelected(null); setDetail(null); }
  };

  const handleSend = async () => {
    const token = await getToken();
    await sendMail(token, compose);
    setComposing(false);
    setCompose({ to: "", subject: "", body: "" });
  };

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
      {/* Folder sidebar */}
      <div style={{
        width: 160, background: "var(--bg-surface)", borderRight: "1px solid var(--border)",
        padding: "12px 8px", flexShrink: 0,
      }}>
        {FOLDERS.map(f => (
          <button key={f.id} onClick={() => setFolder(f.id)} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 8,
            padding: "7px 10px", borderRadius: 6, marginBottom: 2, border: "none",
            background: folder === f.id ? "var(--bg-active)" : "transparent",
            color: folder === f.id ? "var(--accent)" : "var(--text-secondary)",
            cursor: "pointer", fontSize: 13, fontWeight: folder === f.id ? 500 : 400,
          }}>
            <span>{f.icon}</span> {f.label}
          </button>
        ))}
        <div style={{ borderTop: "1px solid var(--border)", marginTop: 12, paddingTop: 12 }}>
          <button onClick={() => setComposing(true)} style={{
            width: "100%", padding: "8px 10px", borderRadius: 6,
            background: "var(--accent)", color: "white", border: "none",
            cursor: "pointer", fontSize: 13, fontWeight: 500,
          }}>
            + Neue Mail
          </button>
        </div>
      </div>

      {/* Mail list */}
      <div style={{ width: 320, borderRight: "1px solid var(--border)", overflow: "auto", flexShrink: 0 }}>
        <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)" }}>
          <h2 style={{ fontSize: 15, fontWeight: 600 }}>
            {FOLDERS.find(f => f.id === folder)?.label}
          </h2>
        </div>
        {loading ? (
          <div style={{ padding: 20, color: "var(--text-muted)", textAlign: "center" }}>Laden…</div>
        ) : mails.length === 0 ? (
          <div style={{ padding: 20, color: "var(--text-muted)", textAlign: "center" }}>Keine Mails</div>
        ) : mails.map(mail => (
          <div
            key={mail.id}
            onClick={() => openMail(mail)}
            style={{
              padding: "12px 16px", borderBottom: "1px solid var(--border)",
              background: selected === mail.id ? "var(--bg-active)" : !mail.isRead ? "var(--bg-elevated)" : "transparent",
              cursor: "pointer", transition: "background 0.1s",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
              <span style={{ fontSize: 13, fontWeight: mail.isRead ? 400 : 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 180 }}>
                {mail.from?.emailAddress?.name || mail.from?.emailAddress?.address || "Unbekannt"}
              </span>
              <span style={{ fontSize: 11, color: "var(--text-muted)", flexShrink: 0 }}>
                {mail.receivedDateTime ? format(new Date(mail.receivedDateTime), "dd.MM", { locale: de }) : ""}
              </span>
            </div>
            <div style={{ fontSize: 13, fontWeight: mail.isRead ? 400 : 600, color: "var(--text-primary)", marginBottom: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {mail.subject || "(Kein Betreff)"}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {mail.bodyPreview}
            </div>
          </div>
        ))}
      </div>

      {/* Mail detail */}
      <div style={{ flex: 1, overflow: "auto", padding: 24 }}>
        {detail ? (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 600, maxWidth: "80%" }}>{detail.subject}</h2>
              <button onClick={() => handleDelete(detail.id)} title="Löschen"
                style={{ color: "var(--text-muted)", fontSize: 18, background: "none", border: "none", cursor: "pointer" }}>
                🗑
              </button>
            </div>
            <div style={{ marginBottom: 16, padding: "12px 16px", background: "var(--bg-elevated)", borderRadius: 8 }}>
              <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                Von: <strong style={{ color: "var(--text-primary)" }}>{detail.from?.emailAddress?.name}</strong> &lt;{detail.from?.emailAddress?.address}&gt;
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
                {detail.receivedDateTime && format(new Date(detail.receivedDateTime), "dd. MMMM yyyy, HH:mm 'Uhr'", { locale: de })}
              </div>
            </div>
            <div
              style={{ color: "var(--text-primary)", lineHeight: 1.7, fontSize: 14 }}
              dangerouslySetInnerHTML={{ __html: detail.body?.content }}
            />
          </>
        ) : (
          <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
            ← Wähle eine Mail aus
          </div>
        )}
      </div>

      {/* Compose modal */}
      {composing && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
          display: "flex", alignItems: "flex-end", justifyContent: "flex-end",
          padding: 20, zIndex: 100,
        }}>
          <div style={{
            background: "var(--bg-elevated)", border: "1px solid var(--border-strong)",
            borderRadius: 12, width: 520, boxShadow: "var(--shadow-lg)",
          }}>
            <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontWeight: 600 }}>Neue E-Mail</span>
              <button onClick={() => setComposing(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 18 }}>×</button>
            </div>
            <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
              {["An", "Betreff"].map((label, i) => (
                <input key={label} placeholder={label}
                  value={i === 0 ? compose.to : compose.subject}
                  onChange={e => setCompose(prev => ({ ...prev, [i === 0 ? "to" : "subject"]: e.target.value }))}
                  style={{
                    background: "var(--bg-surface)", border: "1px solid var(--border-strong)",
                    borderRadius: 6, padding: "8px 12px", color: "var(--text-primary)",
                    fontSize: 13, outline: "none", width: "100%",
                  }}
                />
              ))}
              <textarea placeholder="Nachricht…" rows={8}
                value={compose.body}
                onChange={e => setCompose(prev => ({ ...prev, body: e.target.value }))}
                style={{
                  background: "var(--bg-surface)", border: "1px solid var(--border-strong)",
                  borderRadius: 6, padding: "8px 12px", color: "var(--text-primary)",
                  fontSize: 13, outline: "none", resize: "vertical", width: "100%",
                }}
              />
              <button onClick={handleSend} style={{
                alignSelf: "flex-end", background: "var(--accent)", color: "white",
                border: "none", borderRadius: 6, padding: "8px 20px", cursor: "pointer", fontWeight: 500,
              }}>
                Senden ➤
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
