export async function fetchUserData(token: string) {
  const baseUrl = process.env.BASE_URL || "https://mana-link.se";
  try {
    const response = await fetch(`${baseUrl}/api/user-profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}