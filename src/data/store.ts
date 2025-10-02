// src/store.ts
import { getAuthToken } from "@/contexts/AuthContext";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";

// ---- Interfaces ----
export interface Class {
  id: string;
  subject: string;
  category: string;
  description: string;
  numberOfClasses: number;
  professorId?: string;
  professorName?: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  role: "teacher" | "admin";
}

export interface User {
  id: string;
  name: string;
  lastName: string;
  email: string;
  role: "student" | "teacher" | "admin";
}

// ---- Helpers ----
async function apiFetch(path: string, options: RequestInit = {}) {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `API error ${res.status}`);
  }
  return res.json();
}

// ---- USERS ----
export async function getUsers(role?: string, page = 1, limit = 50): Promise<User[]> {
  const query = new URLSearchParams();
  if (role) query.append("role", role);
  query.append("page", String(page));
  query.append("limit", String(limit));

  const data = await apiFetch(`/users?${query.toString()}`);
  return data.data.users;
}

export async function addUser(user: {
  name: string;
  lastName: string;
  email: string;
  role: "student" | "teacher" | "admin";
  password?: string;
}) {
  const data = await apiFetch("/users", {
    method: "POST",
    body: JSON.stringify(user),
  });
  return data.data;
}

export async function updateUser(id: string, updates: Partial<User>) {
  const data = await apiFetch(`/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
  return data.data;
}

export async function deleteUser(id: string) {
  await apiFetch(`/users/${id}`, { method: "DELETE" });
  return true;
}

// ---- CLASSES (Subjects) ----
export async function getClasses(): Promise<Class[]> {
  const data = await apiFetch("/subjects");
  return data.data;
}

export async function addClass(subject: {
  subject: string;
  category: string;
  description: string;
  numberOfClasses: number;
  professorId?: string;
}) {
  const data = await apiFetch("/subjects", {
    method: "POST",
    body: JSON.stringify(subject),
  });
  return data.data;
}

export async function updateClass(id: string, updates: Partial<Class>) {
  const data = await apiFetch(`/subjects/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
  return data.data;
}

export async function getClassById(id: string): Promise<Class> {
  const data = await apiFetch(`/subjects/${id}`);
  return data.data;
}

// ---- TEACHERS ----
export async function getTeachers(): Promise<Teacher[]> {
  const users = await getUsers("teacher");
  return users.map((u) => ({
    id: u.id,
    name: `${u.name} ${u.lastName}`,
    email: u.email,
    role: "teacher" as const,
  }));
}
