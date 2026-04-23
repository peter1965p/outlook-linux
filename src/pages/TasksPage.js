import React, { useState, useEffect } from "react";

export default function TasksPage() {
  const [lists, setLists] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activeList, setActiveList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");

  // Listen laden (Autohaus-Kategorien oder private Listen)
  useEffect(() => {
    const loadLists = async () => {
      try {
        const data = window.api
            ? await window.api.getTaskLists()
            : [{ id: "default", displayName: "Meine Aufgaben" }, { id: "work", displayName: "Autohaus Projekt" }];

        setLists(data);
        if (data.length > 0) setActiveList(data[0]);
      } catch (e) {
        console.error("Listen-Fehler:", e);
      } finally {
        setLoading(false);
      }
    };
    loadLists();
  }, []);

  // Aufgaben der aktiven Liste laden
  useEffect(() => {
    if (!activeList) return;
    const loadTasks = async () => {
      try {
        const data = window.api
            ? await window.api.getTasks(activeList.id)
            : [
              { id: "1", title: "AETHER OS Architektur finalisieren", status: "notStarted" },
              { id: "2", title: "CachyOS Kernel-Check", status: "completed" }
            ];
        setTasks(data);
      } catch (e) {
        console.error("Task-Fehler:", e);
      }
    };
    loadTasks();
  }, [activeList]);

  const handleCreate = async () => {
    if (!newTitle.trim() || !activeList) return;

    const newTask = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTitle.trim(),
      status: "notStarted",
      listId: activeList.id
    };

    if (window.api) await window.api.createTask(activeList.id, newTask.title);

    setTasks(prev => [...prev, newTask]);
    setNewTitle("");
  };

  const handleToggle = async (task) => {
    const newStatus = task.status === "completed" ? "notStarted" : "completed";

    if (window.api) await window.api.updateTask(activeList.id, task.id, { status: newStatus });

    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
  };

  const pending = tasks.filter(t => t.status !== "completed");
  const done = tasks.filter(t => t.status === "completed");

  return (
      <div style={{ height: "100%", display: "flex", overflow: "hidden", background: "var(--bg-main)" }}>
        {/* Sidebar für Listen */}
        <div style={{
          width: 220, background: "var(--bg-surface)", borderRight: "1px solid var(--border)",
          padding: "16px 12px", flexShrink: 0,
        }}>
          <p style={{ fontSize: 11, color: "var(--text-muted)", padding: "0 10px 12px", textTransform: "uppercase", letterSpacing: 1.2, fontWeight: 700 }}>
            Listen
          </p>
          {lists.map(list => (
              <button key={list.id} onClick={() => setActiveList(list)} style={{
                width: "100%", textAlign: "left", padding: "10px 12px", borderRadius: 8,
                marginBottom: 4, border: "none",
                background: activeList?.id === list.id ? "var(--bg-active)" : "transparent",
                color: activeList?.id === list.id ? "var(--accent)" : "var(--text-secondary)",
                cursor: "pointer", fontSize: 13, fontWeight: activeList?.id === list.id ? 600 : 400,
              }}>
                📋 {list.displayName}
              </button>
          ))}
        </div>

        {/* Aufgaben-Bereich */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{
            padding: "18px 28px", borderBottom: "1px solid var(--border)",
            background: "var(--bg-surface)", display: "flex", alignItems: "center", gap: 14,
          }}>
            <h2 style={{ fontSize: 18, fontWeight: 700 }}>
              {activeList?.displayName || "Aufgaben"}
            </h2>
            <span style={{ fontSize: 12, background: "var(--accent-soft)", color: "var(--accent)", padding: "3px 10px", borderRadius: 20, fontWeight: 600 }}>
            {pending.length} offen
          </span>
          </div>

          <div style={{ flex: 1, overflow: "auto", padding: "28px" }}>
            {loading ? <p style={{ color: "var(--text-muted)" }}>Lade Aufgaben...</p> : (
                <div style={{ maxWidth: 800 }}>
                  {/* Input */}
                  <div style={{ display: "flex", gap: 10, marginBottom: 28 }}>
                    <input
                        placeholder="+ Neue Aufgabe hinzufügen..."
                        value={newTitle}
                        onChange={e => setNewTitle(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && handleCreate()}
                        style={{
                          flex: 1, background: "var(--bg-elevated)", border: "1px solid var(--border-strong)",
                          borderRadius: 10, padding: "12px 16px", color: "var(--text-primary)", fontSize: 15,
                          outline: "none", transition: "border-color 0.2s"
                        }}
                    />
                    <button onClick={handleCreate} style={{
                      background: "var(--accent)", color: "white", border: "none",
                      borderRadius: 10, padding: "0 22px", cursor: "pointer", fontWeight: 700, fontSize: 18
                    }}>+</button>
                  </div>

                  {/* Liste der Aufgaben */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {pending.map(task => (
                        <TaskRow key={task.id} task={task} onToggle={handleToggle} />
                    ))}
                  </div>

                  {done.length > 0 && (
                      <>
                        <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "32px 0 12px", textTransform: "uppercase", letterSpacing: 1.2, fontWeight: 700 }}>
                          Erledigt ({done.length})
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8, opacity: 0.6 }}>
                          {done.map(task => (
                              <TaskRow key={task.id} task={task} onToggle={handleToggle} />
                          ))}
                        </div>
                      </>
                  )}
                </div>
            )}
          </div>
        </div>
      </div>
  );
}

function TaskRow({ task, onToggle }) {
  const isDone = task.status === "completed";
  return (
      <div style={{
        display: "flex", alignItems: "center", gap: 14,
        background: "var(--bg-elevated)", border: "1px solid var(--border)",
        borderRadius: 10, padding: "12px 18px", transition: "all 0.2s",
        cursor: "pointer"
      }}
           onClick={() => onToggle(task)}
           onMouseOver={e => e.currentTarget.style.borderColor = "var(--accent)"}
           onMouseOut={e => e.currentTarget.style.borderColor = "var(--border)"}
      >
        <div style={{
          width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
          border: `2px solid ${isDone ? "var(--accent)" : "var(--text-muted)"}`,
          background: isDone ? "var(--accent)" : "transparent",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "white", fontSize: 12, fontWeight: 800,
        }}
        >
          {isDone ? "✓" : ""}
        </div>
        <span style={{
          fontSize: 14, flex: 1,
          textDecoration: isDone ? "line-through" : "none",
          color: isDone ? "var(--text-muted)" : "var(--text-primary)",
          fontWeight: isDone ? 400 : 500
        }}>
        {task.title}
      </span>
      </div>
  );
}