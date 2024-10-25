export const fetchGamesForPlaygroup = async (token: string, playgroupId: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://mana-link.se';
    const apiUrl = `${baseUrl}/api/games?playgroupId=${playgroupId}`;
  
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!response.ok) {
      throw new Error("Failed to fetch games for playgroup");
    }
  
    const data = await response.json();
    return data.games || [];
  };  