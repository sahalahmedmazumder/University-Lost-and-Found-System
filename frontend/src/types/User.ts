// src/types/User.ts

export interface User {
    user_id: string;
    name: string;
    email: string;
    role: string;
    flagged?: boolean;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface LoginResponse {
    access_token: string;
    token_type: string;
    user: User;
}