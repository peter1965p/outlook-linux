// ============================================================
//  WICHTIG: Trage hier deine Azure App-Registrierungs-Daten ein
//  Anleitung: README.md → Schritt 1
// ============================================================

export const msalConfig = {
  auth: {
    clientId: "DEINE_CLIENT_ID_HIER",          // z.B. "a1b2c3d4-..."
    authority: "https://login.microsoftonline.com/common",
    redirectUri: "http://localhost:3000",
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
};

// Berechtigungen die wir von Microsoft anfordern
export const loginRequest = {
  scopes: [
    "User.Read",
    "Mail.ReadWrite",
    "Mail.Send",
    "Calendars.ReadWrite",
    "Contacts.ReadWrite",
    "Tasks.ReadWrite",
  ],
};

export const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
  graphMailEndpoint: "https://graph.microsoft.com/v1.0/me/messages",
  graphCalendarEndpoint: "https://graph.microsoft.com/v1.0/me/events",
  graphContactsEndpoint: "https://graph.microsoft.com/v1.0/me/contacts",
  graphTasksEndpoint: "https://graph.microsoft.com/v1.0/me/todo/lists",
};
