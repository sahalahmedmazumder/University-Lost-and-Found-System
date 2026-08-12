import {
    createContext,
    useContext,
    useState,
    type ReactNode,
} from "react";

import type {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    User,
} from "../types/User";

interface AuthContextType {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;

    login: (data: LoginRequest) => Promise<void>;
    register: (data: RegisterRequest) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<
    AuthContextType | undefined
>(undefined);

const API_URL = import.meta.env.VITE_API_URL;

export function AuthProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [user, setUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
            return null;
        }

        try {
            return JSON.parse(storedUser) as User;
        } catch {
            localStorage.removeItem("user");
            return null;
        }
    });

    const [accessToken, setAccessToken] =
        useState<string | null>(() => {
            return localStorage.getItem("access_token");
        });

    // LOGIN
    const login = async (data: LoginRequest) => {
        const response = await fetch(
            `${API_URL}/auth/login`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            }
        );

        if (!response.ok) {
            const errorData =
                await response.json().catch(() => null);

            throw new Error(
                errorData?.detail || "Login failed"
            );
        }

        const result: LoginResponse =
            await response.json();

        localStorage.setItem(
            "access_token",
            result.access_token
        );

        localStorage.setItem(
            "token",
            result.access_token
        );

        localStorage.setItem(
            "user",
            JSON.stringify(result.user)
        );

        setAccessToken(result.access_token);
        setUser(result.user);
    };

    // REGISTER
    const register = async (
        data: RegisterRequest
    ) => {
        const response = await fetch(
            `${API_URL}/auth/register`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            }
        );

        if (!response.ok) {
            const errorData =
                await response.json().catch(() => null);

            throw new Error(
                errorData?.detail ||
                    "Registration failed"
            );
        }
    };

    // LOGOUT
    const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setAccessToken(null);
        setUser(null);
    };

    const isAuthenticated =
        accessToken !== null && user !== null;

    return (
        <AuthContext.Provider
            value={{
                user,
                accessToken,
                isAuthenticated,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside an AuthProvider"
        );
    }

    return context;
}