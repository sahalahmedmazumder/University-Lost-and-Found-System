import type {
  FoundItem,
  FoundItemRecord,
} from "../types/foundItem";
import api from "./api";

export async function createFoundItem(
  data: FoundItem
) {
  const response = await api.post(
    "/found-items/",
    data
  );

  return response.data.data;
}

export async function getFoundItems(): Promise<
  FoundItemRecord[]
> {
  const response = await api.get(
    "/found-items/"
  );

  return response.data.data;
}

export async function getMyFoundItems(): Promise<
  FoundItemRecord[]
> {
  const response = await api.get(
    "/found-items/my-items"
  );

  return response.data.data;
}

export async function getFoundItem(
  itemId: string
): Promise<FoundItemRecord> {
  const response = await api.get(
    `/found-items/${itemId}`
  );

  return response.data.data;
}

export async function updateFoundItem(
  itemId: string,
  data: FoundItem
) {
  const response = await api.put(
    `/found-items/${itemId}`,
    data
  );

  return response.data.data;
}

export async function deleteFoundItem(
  itemId: string
) {
  const response = await api.delete(
    `/found-items/${itemId}`
  );

  return response.data;
}