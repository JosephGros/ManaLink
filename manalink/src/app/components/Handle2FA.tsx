"use client";
import { useState, useEffect } from "react";
import Setup2FA from "./Setup2FA";

const Manage2FA = ({ twoFA, id }: { twoFA: boolean, id: string }) => {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIs2FAEnabled(twoFA);
    setUserId(id);
    setLoading(false);
  }, [twoFA]);

  const disable2FA = async () => {
    setMessage(null);
    setError(null);

    try {
      const response = await fetch("/api/disable-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();
      if (response.ok) {
        setIs2FAEnabled(false);
        setMessage("Two-Factor Authentication has been disabled.");
      } else {
        setError(data.error || "Failed to disable 2FA.");
      }
    } catch (error) {
      setError("An error occurred while disabling 2FA.");
    }
  };

  return (
    <div className="p-4 rounded-md bg-bg2 flex flex-col items-center">
      {loading ? (
        <p>Loading 2FA status...</p>
      ) : is2FAEnabled ? (
        <div className="text-center">
          <p className="text-textcolor">
            Two-Factor Authentication is currently enabled.
          </p>
          <button
            onClick={disable2FA}
            className="bg-red-500 text-white px-4 py-2 mt-4 rounded-md"
          >
            Disable Two-Factor Authentication
          </button>
        </div>
      ) : (
        <Setup2FA userId={userId} />
      )}
      {message && <p className="text-textcolor mt-4">{message}</p>}
      {error && <p className="text-danger mt-4">{error}</p>}
    </div>
  );
};

export default Manage2FA;