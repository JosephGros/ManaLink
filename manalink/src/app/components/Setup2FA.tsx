import Image from "next/image";
import { useState } from "react";
import eyeOpen from "../../../public/assets/eye.png";
import eyeClosed from "../../../public/assets/eye-crossed.png";
import copy from "../../../public/assets/Icons/IconColor/duplicate.png";

const Setup2FA = ({ userId }: { userId: string }) => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSecretVisible, setIsSecretVisible] = useState(false);
  const [copySuccess, setCopySuccess] = useState("");

  const setup2FA = async () => {
    try {
      const response = await fetch("/api/setup-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();
      if (response.ok) {
        setQrCode(data.qrCode);
        setSecret(data.secret);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to set up 2FA. Please try again.");
    }
  };

  const toggleSecretVisibility = () => {
    setIsSecretVisible(!isSecretVisible);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(secret);
      setCopySuccess("Copied!");
      setTimeout(() => setCopySuccess(""), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
      setCopySuccess("Failed to copy");
    }
  };

  return (
    <div>
      <button
        onClick={setup2FA}
        className="bg-btn text-nav font-bold p-1 rounded-md w-full h-14 text-center"
      >
        Set Up Two-Factor Authentication
      </button>

      {qrCode && (
        <div className="mt-4 flex flex-wrap justify-center items-center">
          <p>Scan this QR code with your Google authenticator app:</p>
          <div className="w-60 h-60 bg-nav rounded-md flex justify-center items-center my-4">
            <Image
              src={qrCode}
              width={200}
              height={200}
              alt="QR Code for 2FA"
            />
          </div>
          <p>Or enter this key manually:</p>
          <div className="flex items-center mb-4 relative w-64">
            <input
              type={isSecretVisible ? "text" : "password"}
              value={secret}
              readOnly
              className="p-2 rounded-md bg-input bg-opacity-20 focus:outline-none focus:ring focus:ring-lightaccent w-full"
            />
            <button
              type="button"
              onClick={toggleSecretVisibility}
              className="absolute right-12 top-1/2 transform -translate-y-1/2"
            >
              <Image
                src={isSecretVisible ? eyeClosed : eyeOpen}
                alt={isSecretVisible ? "Hide Secret" : "Show Secret"}
                width={24}
                height={24}
              />
            </button>
            <button
              type="button"
              onClick={copyToClipboard}
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              <Image src={copy} alt="Copy Secret" width={24} height={24} />
            </button>
          </div>
          {copySuccess && (
            <p className="text-textcolor text-sm">{copySuccess}</p>
          )}
          <p>Use this key in your Google Authenticator or other 2FA app.</p>
        </div>
      )}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default Setup2FA;
