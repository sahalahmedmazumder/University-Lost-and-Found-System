import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

interface AdminUser {
    user_id: string;
    name: string;
    email: string;
    role: string;
    flagged: boolean;
}

interface AdminItem {
    item_id: string;
    item_name: string;
    category: string;
    description: string;
    location: string;
    contact_name: string;
    contact_number?: string;
    contact_phone?: string;
    status: "Lost" | "Found";
    date_lost?: string;
    date_found?: string;
}

function getAuthHeaders() {
    const token = localStorage.getItem("access_token");

    return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };
}

/* =========================
   USERS
========================= */

export async function getAdminUsers(): Promise<AdminUser[]> {
    const response = await axios.get(
        `${API_URL}/admin/users`,
        {
            headers: getAuthHeaders(),
        }
    );

    return response.data?.data || [];
}

export async function getAdminUser(
    userId: string
): Promise<AdminUser> {
    const response = await axios.get(
        `${API_URL}/admin/users/${userId}`,
        {
            headers: getAuthHeaders(),
        }
    );

    return response.data?.data;
}

export async function flagAdminUser(
    userId: string,
    flagged: boolean
) {
    const response = await axios.put(
        `${API_URL}/admin/users/${userId}/flag`,
        null,
        {
            params: {
                flagged,
            },
            headers: getAuthHeaders(),
        }
    );

    return response.data;
}

export async function deleteAdminUser(
    userId: string
) {
    const response = await axios.delete(
        `${API_URL}/admin/users/${userId}`,
        {
            headers: getAuthHeaders(),
        }
    );

    return response.data;
}


/* =========================
   ITEMS
========================= */

export async function getAdminItems(): Promise<AdminItem[]> {
    const response = await axios.get(
        `${API_URL}/admin/items`,
        {
            headers: getAuthHeaders(),
        }
    );

    return response.data?.data || [];
}

export async function deleteAdminItem(
    itemId: string
) {
    const response = await axios.delete(
        `${API_URL}/admin/items/${itemId}`,
        {
            headers: getAuthHeaders(),
        }
    );

    return response.data;
}

export type {
    AdminItem, AdminUser
};

