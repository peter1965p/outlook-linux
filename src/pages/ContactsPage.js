import React, { useState, useEffect } from "react";
// Azure & Graph API entfernt - Fakt !!!

export default function ContactsPage() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    // Simulation: Daten laden (Hier später dein DB-Abruf)
    useEffect(() => {
        const mockContacts = [
            {
                id: "1",
                displayName: "AETHER Support",
                emailAddresses: [{ address: "support@aether-os.local" }],
                mobilePhone: "+49 123 456789",
                jobTitle: "System Admin",
                companyName: "Company"
            },
            {
                id: "2",
                displayName: "Peter",
                emailAddresses: [{ address: "news24regional@gmail.com" }],
                mobilePhone: "",
                jobTitle: "Developer",
                companyName: "Private"
            }
        ];

        const timer = setTimeout(() => {
            setContacts(mockContacts);
            setLoading(false);
        }, 400);

        return () => clearTimeout(timer);
    }, []);

    const filtered = contacts.filter(c =>
        c.displayName?.toLowerCase().includes(search.toLowerCase()) ||
        c.emailAddresses?.[0]?.address?.toLowerCase().includes(search.toLowerCase())
    );

    const getInitials = (name) =>
        name?.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase() || "?";

    const bgColors = ["#2e86ff", "#34c759", "#ff9500", "#ff453a", "#bf5af2", "#ff2d55", "#5ac8fa"];

    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {/* Header */}
            <div style={{
                padding: "14px 24px", borderBottom: "1px solid var(--border)",
                background: "var(--bg-surface)",
            }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <h2 style={{ fontSize: 16, fontWeight: 600 }}>Kontakte ({contacts.length})</h2>
                </div>
                <input
                    placeholder="🔍  Suchen…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{
                        width: "100%", background: "var(--bg-elevated)", border: "1px solid var(--border-strong)",
                        borderRadius: 8, padding: "8px 14px", color: "var(--text-primary)", fontSize: 13,
                        outline: "none",
                    }}
                />
            </div>

            {/* Contacts grid */}
            <div style={{ flex: 1, overflow: "auto", padding: 24 }}>
                {loading ? (
                    <p style={{ color: "var(--text-muted)" }}>Laden…</p>
                ) : filtered.length === 0 ? (
                    <p style={{ color: "var(--text-muted)" }}>Keine Kontakte gefunden.</p>
                ) : (
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                        gap: 12,
                    }}>
                        {filtered.map((c, i) => (
                            <div key={c.id} style={{
                                background: "var(--bg-elevated)", border: "1px solid var(--border)",
                                borderRadius: 10, padding: 16, display: "flex", gap: 14, alignItems: "flex-start",
                                transition: "border-color 0.15s",
                            }}
                                 onMouseOver={e => e.currentTarget.style.borderColor = "var(--accent)"}
                                 onMouseOut={e => e.currentTarget.style.borderColor = "var(--border)"}
                            >
                                <div style={{
                                    width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
                                    background: bgColors[i % bgColors.length],
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: 16, fontWeight: 600, color: "white",
                                }}>
                                    {getInitials(c.displayName)}
                                </div>
                                <div style={{ overflow: "hidden" }}>
                                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                        {c.displayName}
                                    </div>
                                    {c.emailAddresses?.[0]?.address && (
                                        <div style={{ fontSize: 12, color: "var(--accent)", marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                            {c.emailAddresses[0].address}
                                        </div>
                                    )}
                                    {c.mobilePhone && (
                                        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{c.mobilePhone}</div>
                                    )}
                                    {c.jobTitle && (
                                        <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
                                            {c.jobTitle}{c.companyName ? ` · ${c.companyName}` : ""}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}