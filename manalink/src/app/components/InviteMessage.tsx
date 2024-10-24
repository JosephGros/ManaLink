"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import getSocket from "@/lib/socket";

interface InviteMessageProps {
  inviteId: string;
  userId: string;
}

const InviteMessage: React.FC<InviteMessageProps> = ({
  inviteId,
  userId,
}) => {
  const [responseStatus, setResponseStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [playgroupName, setPlaygroupName] =useState("");
  const [playgroupId, setPlaygroupId] =useState("");

  useEffect(() => {
    const socket = getSocket();

    const inviteSentListener = (data: any) => {
      if (data.inviteId === inviteId) {
        setResponseStatus("pending");
      }
    };

    socket.on("invite_sent", inviteSentListener);

    return () => {
      socket.off("invite_sent", inviteSentListener);
    };
  }, [inviteId]);

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      try {
        const invite = await fetch(`/api/invites/${inviteId}/invite`);
        const inviteData = await invite.json();
        setPlaygroupId(inviteData.invite.playgroupId);
        const response = await fetch(`/api/playgroups/${playgroupId}/members`);
        const data = await response.json();
        setPlaygroupName(data.name);
      } catch (error) {
        console.error("Error fetching playgroup members:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [playgroupId]);

  const handleResponse = async (response: string) => {
    try {
      const result = await axios.post(
        `/api/invites/${inviteId}/respond-to-invite`,
        {
          response,
          userId,
        }
      );

      const socket = getSocket();
      socket.emit("invite_response", {
        inviteId,
        status: response,
      });

      if (result.data.message === "Invite already responded to") {
        setResponseStatus(result.data.status);
      } else {
        setResponseStatus(response);
      }
    } catch (error) {
      console.error("Error responding to invite:", error);
    }
  };

  return (
    <div className="text-textcolor">
      <p className="align-center">
        You have been invited to join the playgroup{" "}
        <strong>{playgroupName}</strong>.
      </p>

      {responseStatus ? (
        <p className="text-textcolor">
          You have {responseStatus === "accepted" ? "accepted" : "declined"}{" "}
          this invite.
        </p>
      ) : (
        <div className="w-full flex flex-row justify-evenly items-center mt-2">
          <button
            onClick={() => handleResponse("decline")}
            className="bg-btn font-bold text-danger2 p-3 rounded-lg shadow-lg h-10 w-24 flex justify-center items-center"
          >
            Decline
          </button>
          <button
            onClick={() => handleResponse("accept")}
            className="bg-btn font-bold text-nav p-3 rounded-lg shadow-lg h-10 w-24 flex justify-center items-center"
          >
            Accept
          </button>
        </div>
      )}
    </div>
  );
};

export default InviteMessage;