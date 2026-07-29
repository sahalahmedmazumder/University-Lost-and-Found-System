import type { LostItem, LostItemRecord } from "../types/lostItem";

const API_URL = "http://localhost:8000/lost-items";

export async function createLostItem(item: LostItem) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
  if (!response.ok) throw new Error("Failed to report lost item.");
  return response.json();
}

export async function getLostItems(): Promise<LostItemRecord[]> {
  const response = await fetch(`${API_URL}/`);
  if (!response.ok) throw new Error("Failed to fetch lost items.");
  const result = await response.json();
  return result.data;
}

export async function updateLostItem(itemId: string, item: LostItem) {
  const response = await fetch(`${API_URL}/${itemId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
  if (!response.ok) throw new Error("Failed to update lost item.");
  return response.json();
}

export async function deleteLostItem(itemId: string) {
  const response = await fetch(`${API_URL}/${itemId}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Failed to delete lost item.");
  return response.json();
}
