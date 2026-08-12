import axios from "axios";
import type { LostItem } from "../types/lostItem";

const API_URL = "http://localhost:8000";

function getAuthHeader() {
    const token = localStorage.getItem("token");

    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
}

export async function createLostItem(data: LostItem) {
    const response = await axios.post(
        `${API_URL}/lost-items/`,
        data,
        getAuthHeader()
    );

    return response.data;
}

export async function getLostItems() {
    const response = await axios.get(
        `${API_URL}/lost-items/`
    );

    return response.data.data;
}

export async function getMyLostItems() {
    const response = await axios.get(
        `${API_URL}/lost-items/my-items`,
        getAuthHeader()
    );

    return response.data.data;
}

export async function getLostItem(itemId: string) {
    const response = await axios.get(
        `${API_URL}/lost-items/${itemId}`
    );

    return response.data.data;
}

export async function updateLostItem(
    itemId: string,
    data: LostItem
) {
    const response = await axios.put(
        `${API_URL}/lost-items/${itemId}`,
        data,
        getAuthHeader()
    );

    return response.data;
}

export async function deleteLostItem(itemId: string) {
    const response = await axios.delete(
        `${API_URL}/lost-items/${itemId}`,
        getAuthHeader()
    );

    return response.data;
}