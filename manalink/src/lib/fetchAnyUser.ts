export async function fetchAnyUser(userId: string) {
    try {
      const response = await fetch(`${process.env.BASE_URL}/api/user-details`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId: userId }),
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