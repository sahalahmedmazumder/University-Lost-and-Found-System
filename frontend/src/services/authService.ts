import axios from "axios";

import type {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    User,
} from "../types/User";

const API_URL = "import.meta.env.VITE_API_URL";

/* =========================
   REGISTER
========================= */

export async function register(data: RegisterRequest) {
    const response = await axios.post(
        `${API_URL}/auth/register`,
        data
    );

    return response.data;
}

/* =========================
   LOGIN
========================= */

export async function login(
    data: LoginRequest
): Promise<LoginResponse> {
    const response = await axios.post<LoginResponse>(
        `${API_URL}/auth/login`,
        data
    );

    return response.data;
}

/* =========================
   TOKEN
========================= */

export function saveToken(token: string) {
    localStorage.setItem("access_token", token);

    // Keep this for compatibility with your existing app
    localStorage.setItem("token", token);
}

export function getToken(): string | null {
    return localStorage.getItem("access_token");
}

export function removeToken() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("token");
}

/* =========================
   USER
========================= */

export function saveUser(user: User) {
    localStorage.setItem(
        "user",
        JSON.stringify(user)
    );
}

export function getCurrentUser(): User | null {
    const user = localStorage.getItem("user");

    if (!user) {
        return null;
    }

    try {
        return JSON.parse(user);
    } catch {
        localStorage.removeItem("user");
        return null;
    }
}

/* =========================
   LOGOUT
========================= */

export function logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
}

/* =========================
   AUTH CHECK
========================= */

export function isLoggedIn() {
    return !!getToken();
}