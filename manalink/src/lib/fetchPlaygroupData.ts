export async function fetchPlaygroupData(token: string, playgroupId: string) {
    if (!playgroupId) {
        throw new Error("Playgroup ID is required");
      }
    try {
        const response = await fetch(`${process.env.BASE_URL}/api/playgroups/${playgroupId}/details`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ playgroupId: playgroupId }),
        });

        if (!response.ok) {
            throw new Error("Failed to fetch playgroup data");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching playgroup data:", error);
        throw error;
    }
}