// Cliente HTTP para el Admin API con manejo de tokens y refresco automático

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://34.10.68.32:3000/api/v1";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface FetchOptions {
  method?: HttpMethod;
  body?: any;
  auth?: boolean;
  headers?: Record<string, string>;
  query?: Record<string, string | number | boolean | undefined>;
}

function buildQuery(query?: FetchOptions["query"]) {
  if (!query) return "";
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null) params.append(k, String(v));
  });
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

async function http<T = any>(path: string, opts: FetchOptions = {}): Promise<T> {
  const token = localStorage.getItem("accessToken");
  const url = `${BACKEND_URL}${path}${buildQuery(opts.query)}`;

  // 🔍 Log completo de lo que se envía
  console.log("🌐 [API REQUEST]", {
    url,
    method: opts.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(opts.auth && token ? { Authorization: `Bearer ${token}` } : {}),
      ...(opts.headers || {}),
    },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });

  const res = await fetch(url, {
    method: opts.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(opts.auth && token ? { Authorization: `Bearer ${token}` } : {}),
      ...(opts.headers || {}),
    },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });

  // Intentar refrescar token si caducó
  if (res.status === 401 && opts.auth) {
    const ok = await tryRefreshToken();
    if (ok) {
      const retryRes = await fetch(url, {
        method: opts.method || "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          ...(opts.headers || {}),
        },
        body: opts.body ? JSON.stringify(opts.body) : undefined,
      });
      if (!retryRes.ok) throw await toApiError(retryRes);
      return retryRes.json();
    }
  }

  if (!res.ok) {
    const error = await toApiError(res);
    console.error("❌ [API ERROR] Detalle completo del error:", error);
    throw error;
  }

  return res.json();
}

async function toApiError(res: Response) {
  let message = `HTTP ${res.status} ${res.statusText}`;
  let body: any = null;
  try {
    body = await res.json();
    if (body?.message) message = body.message;
  } catch {}
  return {
    status: res.status,
    statusText: res.statusText,
    url: res.url,
    body,
    message,
  };
}

// ====== LOGIN ======
export async function loginRequest(email: string, password: string) {
  const res = await http<any>("/auth/email/login", {
    method: "POST",
    body: { email, password },
  });

  const access = res?.accessToken;
  const refresh = res?.refreshToken;

  if (!access || !refresh) {
    throw new Error("Invalid login response: missing tokens");
  }

  localStorage.setItem("accessToken", access);
  localStorage.setItem("refreshToken", refresh);

  return res;
}

// ====== REFRESH ======
export async function tryRefreshToken() {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return false;
  try {
    const res = await http<any>("/auth/refresh", {
      method: "POST",
      body: { refreshToken },
    });

    const access = res?.accessToken || res?.access?.token;
    if (access) {
      localStorage.setItem("accessToken", access);
      return true;
    }
    return false;
  } catch {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    return false;
  }
}

// ====== LOGOUT ======
export async function logoutRequest() {
  const refreshToken = localStorage.getItem("refreshToken");
  try {
    await http("/auth/logout", { method: "POST", body: { refreshToken } });
  } catch {}
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}

// ====== API Genérico ======
export const api = {
  get: <T = any>(path: string, query?: FetchOptions["query"]) =>
    http<T>(path, { method: "GET", auth: true, query }),
  post: <T = any>(path: string, body?: any) =>
    http<T>(path, { method: "POST", auth: true, body }),
  put: <T = any>(path: string, body?: any) =>
    http<T>(path, { method: "PUT", auth: true, body }),
  del: <T = any>(path: string) =>
    http<T>(path, { method: "DELETE", auth: true }),
};
