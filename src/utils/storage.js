// src/utils/storage.js
// Abstraction over localStorage. Replace implementations with axios calls to migrate to backend.

const LS = window.localStorage;

export function getItem(key, fallback = null) {
  try {
    return JSON.parse(LS.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

export function setItem(key, value) {
  LS.setItem(key, JSON.stringify(value));
}

// Users
export function getUsers() {
  return getItem("users", []);
}
export function saveUsers(users) {
  setItem("users", users);
}

// Forms, submissions, messages, meetings, mentors
export function getForms() {
  return getItem("forms", []);
}
export function saveForms(forms) {
  setItem("forms", forms);
}

export function getSubmissions() {
  return getItem("submissions", []);
}
export function saveSubmissions(subs) {
  setItem("submissions", subs);
}

// Messages between mentor & student
export function getMessages() {
  return getItem("messages", []);
}
export function saveMessages(messages) {
  setItem("messages", messages);
}

// Meetings logs
export function getMeetings() {
  return getItem("meetings", []);
}
export function saveMeetings(meetings) {
  setItem("meetings", meetings);
}

// Mentor assignments mapping: { studentEmail: mentorEmail }
export function getMentorMap() {
  return getItem("mentorMap", {});
}
export function saveMentorMap(map) {
  setItem("mentorMap", map);
}
