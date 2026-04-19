import React, { useState } from "react";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider, useIsAuthenticated, useMsal } from "@azure/msal-react";
import { msalConfig, loginRequest } from "./authConfig";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import "./styles/global.css";

const msalInstance = new PublicClientApplication(msalConfig);

function AppContent() {
  const isAuthenticated = useIsAuthenticated();
  const { instance, accounts } = useMsal();
  const [activePage, setActivePage] = useState("mail");

  const handleLogin = async () => {
    try {
      await instance.loginPopup(loginRequest);
    } catch (e) {
      console.error("Login fehlgeschlagen:", e);
    }
  };

  const handleLogout = () => {
    instance.logoutPopup();
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const user = accounts[0];

  return (
    <Layout
      user={user}
      activePage={activePage}
      setActivePage={setActivePage}
      onLogout={handleLogout}
    />
  );
}

export default function App() {
  return (
    <MsalProvider instance={msalInstance}>
      <AppContent />
    </MsalProvider>
  );
}
