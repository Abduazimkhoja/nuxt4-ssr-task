import { defineStore } from "pinia";

interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "manager" | "user";
}

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const accessToken = ref<string | null>(null);

  const isLoggedIn = computed(() => !!user.value);
  const role = computed(() => user.value?.role);

  async function login(data: LoginData) {
    const result = await $fetch<{ accessToken: string; user: User }>(
      "/api/auth/login",
      { method: "POST", body: data }
    );
    user.value = result.user;
    accessToken.value = result.accessToken;
  }

  async function register(data: RegisterData) {
    const result = await $fetch<{ accessToken: string; user: User }>(
      "/api/auth/register",
      { method: "POST", body: data }
    );
    user.value = result.user;
    accessToken.value = result.accessToken;
  }

  async function fetchMe() {
    try {
      const headers: Record<string, string> = {};
      if (accessToken.value) {
        headers["Authorization"] = `Bearer ${accessToken.value}`;
      }
      const data = await $fetch<{ user: User }>("/api/auth/me", { headers });
      user.value = data.user;
    } catch {
      try {
        const refreshed = await $fetch<{ accessToken: string }>(
          "/api/auth/refresh",
          { method: "POST", body: { refreshToken: "" } }
        );
        accessToken.value = refreshed.accessToken;
        const data = await $fetch<{ user: User }>("/api/auth/me", {
          headers: { Authorization: `Bearer ${refreshed.accessToken}` },
        });
        user.value = data.user;
      } catch {
        user.value = null;
        accessToken.value = null;
      }
    }
  }

  function logout() {
    user.value = null;
    accessToken.value = null;
    navigateTo("/auth");
  }

  return { user, accessToken, isLoggedIn, role, login, register, fetchMe, logout };
});
