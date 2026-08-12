import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export async function getBrowseItems(
    filter: string = "All"
) {
    const response = await axios.get(
        `${API}/browse-items/?filter=${filter}`
    );

    return response.data;
}