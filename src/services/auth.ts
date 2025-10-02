
import { loginRequest, logoutRequest } from "@/lib/api";

export async function login(email: string, password: string) {
  const ok = await loginRequest(email, password);
  return ok;
}

export async function logout() {
  await logoutRequest();
}
