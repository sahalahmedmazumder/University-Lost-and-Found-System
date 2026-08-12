import type { LostItem } from "../types/lostItem";
import api from "./api";

export async function createLostItem(data: LostItem) {
    const response = await api.post("/lost-items/", data);

    return response.data;
}

export async function getLostItems() {
    const response = await api.get("/lost-items/");

    return response.data.data;
}

export async function getMyLostItems() {
    const response = await api.get("/lost-items/my-items");

    return response.data.data;
}

export async function getLostItem(itemId: string) {
    const response = await api.get(`/lost-items/${itemId}`);

    return response.data.data;
}

export async function updateLostItem(
    itemId: string,
    data: LostItem
) {
    const response = await api.put(
        `/lost-items/${itemId}`,
        data
    );

    return response.data;
}

export async function deleteLostItem(itemId: string) {
    const response = await api.delete(`/lost-items/${itemId}`);

    return response.data;
}