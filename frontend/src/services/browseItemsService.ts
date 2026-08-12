import axios from "axios";

const API = "http://127.0.0.1:8000";

export async function getBrowseItems(
    filter: string = "All"
) {
    const response = await axios.get(
        `${API}/browse-items/?filter=${filter}`
    );

    return response.data;
}