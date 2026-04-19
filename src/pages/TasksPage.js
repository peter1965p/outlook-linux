import React, { useState, useEffect, useCallback } from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";
import { getTaskLists, getTasks, createTask, updateTask } from "../utils/graphApi";

export default function TasksPage() {
  const { instance, accounts } = useMsal();
  const [lists, setLists] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activeList, setActiveList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");

  const getToken = useCallback(async () => {
    const res = await instance.acquireTokenSilent({ ...loginRequest, account: accounts[0] });
    return res.accessToken;
  }, [instance, accounts]);

  useEffect(() => {
    getToken().then(t => getTaskLists(t)).then(data => {
      setLists(data);
      if (data.length > 0) setActiveList(data[0]);
    }).finally(() => setLoading(false));
  }, [getToken]);

  useEffect(() => {
    if (!activeList) return;
    getToken().then(t => getTasks(t, activeList.id)).then(setTasks);
  }, [activeList, getToken]);

  const handleCreate = async () => {
    if (!newTitle.trim() || !activeList) return;
    const token = await getToken();
    const task = await createTask(token, activeList.id, newTitle.trim());
    setTasks(prev => [...prev, task]);
    setNewTitle("");
  };

  const handleToggle = async (task) => {
    const token = await getToken();
    const newStatus = task.status === "completed" ? "notStarted" : "completed";
    await updateTask(token, activeList.id, task.id, { status: newStatus });
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
  };

  const pending = tasks.filter(t => t.status !== "completed");
  const done = tasks.filter(t => t.status === "completed");

  return (
    <div style={{ height: "100%", display: "flex", overflow: "hidden" }}>
      {/* Lists sidebar */}
      <div style={{
        width: 200, background: "var(--bg-surface)", borderRight: "1px solid var(--border)",
        padding: "12px 8px", flexShrink: 0,
      }}>
        <p style={{ fontSize: 11, color: "var(--text-muted)", padding: "4px 10px 8px", textTransform: "uppercase", letterSpacing: 1 }}>
          Listen
        </p>
        {lists.map(list => (
          <button key={list.id} onClick={() => setActiveList(list)} style={{
            width: "100%", textAlign: "left", padding: "8px 10px", borderRadius: 6,
            marginBottom: 2, border: "none",
            background: activeList?.id === list.id ? "var(--bg-active)" : "transparent",
            color: activeList?.id === list.id ? "var(--accent)" : "var(--text-secondary)",
            cursor: "pointer", fontSize: 13, fontWeight: activeList?.id === list.id ? 500 : 400,
          }}>
            📋 {list.displayName}
          </button>
        ))}
      </div>

      {/* Tasks */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{
          padding: "14px 24px", borderBottom: "1px solid var(--border)",
          background: "var(--bg-surface)", display: "flex", alignItems: "center", gap: 12,
        }}>
          <h2 style={{ fontSize: 16, fontWeight: 600 }}>
            {activeList?.displayName || "Aufgaben"}
          </h2>
          <span style={{ fontSize: 12, background: "var(--accent-soft)", color: "var(--accent)", padding: "2px 8px", borderRadius: 20 }}>
            {pending.length} offen
          </span>
        </div>

        <div style={{ flex: 1, overflow: "auto", padding: 24 }}>
          {loading ? <p style={{ color: "var(--text-muted)" }}>Laden…</p> : (
            <>
              {/* Add task */}
              <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                <input
                  placeholder="+ Neue Aufgabe hinzufügen…"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleCreate()}
                  style={{
                    flex: 1, background: "var(--bg-elevated)", border: "1px solid var(--border-strong)",
                    borderRadius: 8, padding: "10px 14px", color: "var(--text-primary)", fontSize: 14,
                    outline: "none",
                  }}
                />
                <button onClick={handleCreate} style={{
                  background: "var(--accent)", color: "white", border: "none",
                  borderRadius: 8, padding: "0 18px", cursor: "pointer", fontWeight: 500,
                }}>
                  +
                </button>
              </div>

              {/* Pending tasks */}
              {pending.length === 0 && done.length === 0 && (
                <p style={{ color: "var(--text-muted)" }}>Keine Aufgaben. Prima! 🎉</p>
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {pending.map(task => (
                  <TaskRow key={task.id} task={task} onToggle={handleToggle} />
                ))}
              </div>

              {/* Done */}
              {done.length > 0 && (
                <>
                  <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "20px 0 8px", textTransform: "uppercase", letterSpacing: 1 }}>
                    Erledigt ({done.length})
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, opacity: 0.5 }}>
                    {done.map(task => (
                      <TaskRow key={task.id} task={task} onToggle={handleToggle} />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function TaskRow({ task, onToggle }) {
  const done = task.status === "completed";
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      background: "var(--bg-elevated)", border: "1px solid var(--border)",
      borderRadius: 8, padding: "10px 14px",
      transition: "border-color 0.15s",
    }}
      onMouseOver={e => e.currentTarget.style.borderColor = "var(--accent)"}
      onMouseOut={e => e.currentTarget.style.borderColor = "var(--border)"}
    >
      <button
        onClick={() => onToggle(task)}
        style={{
          width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
          border: `2px solid ${done ? "#34c759" : "var(--text-muted)"}`,
          background: done ? "#34c759" : "transparent",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          color: "white", fontSize: 11, fontWeight: 700,
        }}
      >
        {done ? "✓" : ""}
      </button>
      <span style={{
        fontSize: 14, flex: 1,
        textDecoration: done ? "line-through" : "none",
        color: done ? "var(--text-muted)" : "var(--text-primary)",
      }}>
        {task.title}
      </span>
      {task.dueDateTime && (
        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
          📅 {new Date(task.dueDateTime.dateTime).toLocaleDateString("de-DE")}
        </span>
      )}
    </div>
  );
}
