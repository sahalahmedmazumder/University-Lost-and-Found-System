import type { LostItem } from "../types/lostItem";

const API_URL = "http://localhost:8000/lost-items";

export async function createLostItem(item: LostItem) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });

  if (!response.ok) {
    throw new Error("Failed to report lost item.");
  }

  return response.json();
}
