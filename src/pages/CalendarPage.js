import React, { useState, useEffect, useCallback } from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";
import { getCalendarEvents, createCalendarEvent } from "../utils/graphApi";
import { format } from "date-fns";
import { de } from "date-fns/locale";

export default function CalendarPage() {
  const { instance, accounts } = useMsal();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newEvent, setNewEvent] = useState({ subject: "", start: "", end: "", location: "" });

  const getToken = useCallback(async () => {
    const res = await instance.acquireTokenSilent({ ...loginRequest, account: accounts[0] });
    return res.accessToken;
  }, [instance, accounts]);

  useEffect(() => {
    getToken().then(t => getCalendarEvents(t)).then(setEvents).finally(() => setLoading(false));
  }, [getToken]);

  const handleCreate = async () => {
    const token = await getToken();
    const event = {
      subject: newEvent.subject,
      start: { dateTime: newEvent.start, timeZone: "Europe/Berlin" },
      end: { dateTime: newEvent.end, timeZone: "Europe/Berlin" },
      location: { displayName: newEvent.location },
    };
    const created = await createCalendarEvent(token, event);
    setEvents(prev => [...prev, created]);
    setShowForm(false);
    setNewEvent({ subject: "", start: "", end: "", location: "" });
  };

  // Farben für verschiedene Events
  const colors = ["#2e86ff", "#34c759", "#ff9500", "#ff453a", "#bf5af2", "#ff2d55"];

  return (
    <div style={{ height: "100%", overflow: "auto" }}>
      {/* Header */}
      <div style={{
        padding: "14px 24px", borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "var(--bg-surface)",
      }}>
        <h2 style={{ fontSize: 16, fontWeight: 600 }}>Kalender – Nächste 30 Tage</h2>
        <button onClick={() => setShowForm(true)} style={{
          background: "var(--accent)", color: "white", border: "none",
          borderRadius: 6, padding: "7px 14px", cursor: "pointer", fontSize: 13, fontWeight: 500,
        }}>+ Neuer Termin</button>
      </div>

      {/* Events list */}
      <div style={{ padding: 24 }}>
        {loading ? (
          <p style={{ color: "var(--text-muted)" }}>Laden…</p>
        ) : events.length === 0 ? (
          <p style={{ color: "var(--text-muted)" }}>Keine Termine in den nächsten 30 Tagen.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {events.map((ev, i) => (
              <div key={ev.id} style={{
                background: "var(--bg-elevated)", border: "1px solid var(--border)",
                borderRadius: 10, padding: "14px 18px",
                borderLeft: `3px solid ${colors[i % colors.length]}`,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600 }}>{ev.subject}</h3>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    {ev.start?.dateTime && format(new Date(ev.start.dateTime), "EEE, dd. MMM", { locale: de })}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 16 }}>
                  <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                    🕐 {ev.start?.dateTime && format(new Date(ev.start.dateTime), "HH:mm", { locale: de })}
                    {" – "}
                    {ev.end?.dateTime && format(new Date(ev.end.dateTime), "HH:mm", { locale: de })}
                  </span>
                  {ev.location?.displayName && (
                    <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                      📍 {ev.location.displayName}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New event modal */}
      {showForm && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100,
        }}>
          <div style={{
            background: "var(--bg-elevated)", border: "1px solid var(--border-strong)",
            borderRadius: 12, width: 440, boxShadow: "var(--shadow-lg)",
          }}>
            <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontWeight: 600 }}>Neuer Termin</span>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 18 }}>×</button>
            </div>
            <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { placeholder: "Titel", key: "subject", type: "text" },
                { placeholder: "Start (z.B. 2024-03-25T10:00:00)", key: "start", type: "datetime-local" },
                { placeholder: "Ende", key: "end", type: "datetime-local" },
                { placeholder: "Ort (optional)", key: "location", type: "text" },
              ].map(field => (
                <input key={field.key} type={field.type} placeholder={field.placeholder}
                  value={newEvent[field.key]}
                  onChange={e => setNewEvent(prev => ({ ...prev, [field.key]: e.target.value }))}
                  style={{
                    background: "var(--bg-surface)", border: "1px solid var(--border-strong)",
                    borderRadius: 6, padding: "8px 12px", color: "var(--text-primary)",
                    fontSize: 13, outline: "none", width: "100%", colorScheme: "dark",
                  }}
                />
              ))}
              <button onClick={handleCreate} style={{
                background: "var(--accent)", color: "white", border: "none",
                borderRadius: 6, padding: "9px", cursor: "pointer", fontWeight: 500,
              }}>
                Termin erstellen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
