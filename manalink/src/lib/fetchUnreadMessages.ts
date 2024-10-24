export const fetchUnreadMessages = async (userId: string) => {
    const res = await fetch(`/api/messages/unread?userId=${userId}`);
    if (!res.ok) {
      throw new Error("Failed to fetch unread messages");
    }
    const data = await res.json();
    return data;
  };
  