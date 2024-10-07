import React from "react";

interface Message {
  _id: string;
  content: string;
  senderId: string;
  metadata?: {
    inviteId?: string;
  };
}

const ChatMessage = ({
  message,
  currentUserId,
}: {
  message: Message;
  currentUserId: string;
}) => {
  const isInviteMessage = message.metadata?.inviteId;

  const handleAcceptInvite = async (inviteId: string) => {
    try {
      await fetch(`/api/invites/${inviteId}/respond-to-invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response: "accept", userId: currentUserId }),
      });
      alert("Invite accepted");
    } catch (error) {
      console.error("Failed to accept invite", error);
    }
  };

  const handleDeclineInvite = async (inviteId: string) => {
    try {
      await fetch(`/api/invites/${inviteId}/respond-to-invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response: "decline", userId: currentUserId }),
      });
      alert("Invite declined");
    } catch (error) {
      console.error("Failed to decline invite", error);
    }
  };

  return (
    <div
      className={`message ${
        message.senderId === currentUserId ? "sent" : "received"
      }`}
    >
      <p>{message.content}</p>

      {isInviteMessage && (
        <div className="invite-actions">
          <button
            onClick={() => handleAcceptInvite(message.metadata!.inviteId!)}
            className="bg-btn text-nav w-10 h-10"
          >
            Accept
          </button>
          <button
            onClick={() => handleDeclineInvite(message.metadata!.inviteId!)}
            className="bg-btn text-nav w-10 h-10"
          >
            Decline
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;