import React, { useState, useEffect, useCallback } from "react";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";

// Seiten-Imports
import MailPage from "./pages/MailPage";
import CalendarPage from "./pages/CalendarPage";
import ContactsPage from "./pages/ContactsPage";
import TasksPage from "./pages/TasksPage";
import AccountPage from "./pages/AccountPage";
import SettingsPage from "./pages/SettingsPage";

import "./styles/global.css";

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activePage, setActivePage] = useState("mail");
  const [user, setUser] = useState(null);

  // --- SESSION TIMEOUT LOGIK (5 Min Inaktivität) ---
  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
    console.log("Sitzung beendet.");
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    let timeout;
    const resetTimer = () => {
      clearTimeout(timeout);
      // 5 Minuten = 300.000ms
      timeout = setTimeout(() => {
        // Hier könnte man noch den 30-Sekunden-Countdown einbauen
        handleLogout();
      }, 300000);
    };

    // Events für Nutzerinteraktion
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keypress", resetTimer);

    resetTimer(); // Initialer Start

    return () => {
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keypress", resetTimer);
      clearTimeout(timeout);
    };
  }, [isAuthenticated, handleLogout]);

  // --- LOGIN LOGIK ---
  const handleLogin = async (credentials) => {
    try {
      // Hier rufen wir später window.api.login(credentials) auf
      setUser({
        name: "Peter",
        username: "news24regional@gmail.com",
        role: "Admin"
      });
      setIsAuthenticated(true);
    } catch (e) {
      console.error("Login fehlgeschlagen:", e);
    }
  };

  // --- SEITEN-RENDERER ---
  const renderPage = () => {
    switch (activePage) {
      case "mail":      return <MailPage />;
      case "calendar":  return <CalendarPage />;
      case "contacts":  return <ContactsPage />;
      case "tasks":     return <TasksPage />;
      case "accounts":  return <AccountPage />;
      case "settings":  return <SettingsPage onLogout={handleLogout} />;
      default:          return <MailPage />;
    }
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
      <Layout
          user={user}
          activePage={activePage}
          setActivePage={setActivePage}
          onLogout={handleLogout}
      >
        {/* Das Layout erhält hier die gerenderte Seite als Children */}
        {renderPage()}
      </Layout>
  );
}

export default function App() {
  return <AppContent />;
}