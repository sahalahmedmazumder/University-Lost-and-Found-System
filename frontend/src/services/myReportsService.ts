import api from "./api";

export async function getMyReports() {
    const [lostResponse, foundResponse] =
        await Promise.all([
            api.get("/lost-items/my-items"),
            api.get("/found-items/my-items"),
        ]);

    const lostItems = (lostResponse.data.data || []).map(
        (item: any) => ({
            ...item,
            status: "Lost",
        })
    );

    const foundItems = (foundResponse.data.data || []).map(
        (item: any) => ({
            ...item,
            status: "Found",
        })
    );

    return [...lostItems, ...foundItems];
}