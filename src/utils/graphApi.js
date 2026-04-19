import { Client } from "@microsoft/microsoft-graph-client";

// Erstellt einen Microsoft Graph Client mit dem aktuellen Access Token
export function getGraphClient(accessToken) {
  return Client.init({
    authProvider: (done) => {
      done(null, accessToken);
    },
  });
}

// ── E-MAILS ──────────────────────────────────────────────────
export async function getMails(accessToken, folder = "inbox", top = 50) {
  const client = getGraphClient(accessToken);
  const res = await client
    .api(`/me/mailFolders/${folder}/messages`)
    .top(top)
    .select("id,subject,from,receivedDateTime,isRead,bodyPreview,hasAttachments")
    .orderby("receivedDateTime DESC")
    .get();
  return res.value;
}

export async function getMailById(accessToken, id) {
  const client = getGraphClient(accessToken);
  return await client.api(`/me/messages/${id}`).get();
}

export async function sendMail(accessToken, { to, subject, body }) {
  const client = getGraphClient(accessToken);
  await client.api("/me/sendMail").post({
    message: {
      subject,
      body: { contentType: "HTML", content: body },
      toRecipients: [{ emailAddress: { address: to } }],
    },
  });
}

export async function deleteMail(accessToken, id) {
  const client = getGraphClient(accessToken);
  await client.api(`/me/messages/${id}`).delete();
}

export async function markMailRead(accessToken, id, isRead = true) {
  const client = getGraphClient(accessToken);
  await client.api(`/me/messages/${id}`).patch({ isRead });
}

// ── KALENDER ─────────────────────────────────────────────────
export async function getCalendarEvents(accessToken) {
  const client = getGraphClient(accessToken);
  const now = new Date().toISOString();
  const future = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  const res = await client
    .api("/me/calendarView")
    .query({ startDateTime: now, endDateTime: future })
    .top(50)
    .orderby("start/dateTime")
    .get();
  return res.value;
}

export async function createCalendarEvent(accessToken, event) {
  const client = getGraphClient(accessToken);
  return await client.api("/me/events").post(event);
}

// ── KONTAKTE ─────────────────────────────────────────────────
export async function getContacts(accessToken) {
  const client = getGraphClient(accessToken);
  const res = await client
    .api("/me/contacts")
    .top(100)
    .select("id,displayName,emailAddresses,mobilePhone,jobTitle,companyName")
    .orderby("displayName")
    .get();
  return res.value;
}

// ── AUFGABEN ─────────────────────────────────────────────────
export async function getTaskLists(accessToken) {
  const client = getGraphClient(accessToken);
  const res = await client.api("/me/todo/lists").get();
  return res.value;
}

export async function getTasks(accessToken, listId) {
  const client = getGraphClient(accessToken);
  const res = await client.api(`/me/todo/lists/${listId}/tasks`).get();
  return res.value;
}

export async function createTask(accessToken, listId, title) {
  const client = getGraphClient(accessToken);
  return await client
    .api(`/me/todo/lists/${listId}/tasks`)
    .post({ title, status: "notStarted" });
}

export async function updateTask(accessToken, listId, taskId, data) {
  const client = getGraphClient(accessToken);
  return await client
    .api(`/me/todo/lists/${listId}/tasks/${taskId}`)
    .patch(data);
}
