import { useEffect, useState } from "react";
import InviteMessage from "./InviteMessage";
import getSocket from "@/lib/socket";

interface Invite {
  inviteId: string;
  playgroupName: string;
  inviteeId: string;
}

const InviteNotifications = () => {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const response = await fetch("/api/user-profile");
      const data = await response.json();
      setUserId(data.user._id);
    };

    fetchUserId();

    const socket = getSocket();

    const inviteSentListener = (data: Invite) => {
      if (data.inviteeId === userId) {
        setInvites((prev) => [...prev, data]);
      }
    };

    socket.on("invite_sent", inviteSentListener);

    return () => {
      socket.off("invite_sent", inviteSentListener);
    };
  }, [userId]);

  return (
    <div>
      {invites.map((invite, index) => (
        <InviteMessage
          key={index}
          inviteId={invite.inviteId}
          userId={userId || ""}
        />
      ))}
    </div>
  );
};

export default InviteNotifications;