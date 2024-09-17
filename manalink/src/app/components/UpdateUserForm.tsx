"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CustomLoader } from "./CustomLoading";
import eyeOpen from "../../../public/assets/eye.png";
import eyeClosed from "../../../public/assets/eye-crossed.png";
import Image from "next/image";

const UpdateUserForm = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await fetch("/api/user-info");
        const data = await response.json();

        if (response.ok && data.userId) {
          setUserId(data.userId);
          console.log("User ID:", data.userId);
        } else {
          setError("Failed to retrieve user ID");
        }
      } catch (err) {
        setError("An error occurred while fetching user ID");
      }
    };

    fetchUserId();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    setError(null);

    const payload = {
      userId,
      currentPassword,
      newUsername: newUsername || undefined,
      newEmail: newEmail || undefined,
      newPassword: newPassword || undefined,
      twoFactorCode,
    };

    try {
      const response = await fetch("/api/update-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Profile updated successfully!");
        router.push("/profile");
      } else {
        setError(data.error);
      }
    } catch (error: any) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className="flex justify-center">
        <div className="flex flex-col w-96 p-4 rounded-md bg-bg2 justify-center items-center">
          <h1 className="font-bold italic text-textcolor text-4xl pb-6">
            Update Profile
          </h1>
          <div>{token ? `Token: ${token}` : "No token found"}</div>
          <form onSubmit={handleUpdate}>
            <div className="flex justify-center">
              <div className="relative w-56">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="w-full h-10 bg-input bg-opacity-20 rounded-md placeholde:text-textcolor text-textcolor my-1.5 shadow-lg focus:outline-none focus:ring focus:ring-lightaccent p-2 pr-10"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                >
                  <Image
                    src={showPassword ? eyeClosed : eyeOpen}
                    alt={showPassword ? "Hide Password" : "Show Password"}
                    width={24}
                    height={24}
                  />
                </button>
              </div>
            </div>
            <div className="flex justify-center">
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="New Username (optional)"
                className="w-56 h-10 bg-input bg-opacity-20 rounded-md placeholde:text-textcolor text-textcolor my-1.5 shadow-lg focus:outline-none focus:ring focus:ring-lightaccent p-2"
              />
            </div>

            <div className="flex justify-center">
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="New Email (optional)"
                className="w-56 h-10 bg-input bg-opacity-20 rounded-md placeholde:text-textcolor text-textcolor my-1.5 shadow-lg focus:outline-none focus:ring focus:ring-lightaccent p-2"
              />
            </div>

            <div className="flex justify-center">
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password (optional)"
                className="w-56 h-10 bg-input bg-opacity-20 rounded-md placeholde:text-textcolor text-textcolor my-1.5 shadow-lg focus:outline-none focus:ring focus:ring-lightaccent p-2"
              />
            </div>

            <div className="flex justify-center">
              <input
                type="text"
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value)}
                placeholder="2FA Code"
                required
                className="w-56 h-10 bg-input bg-opacity-20 rounded-md placeholde:text-textcolor text-textcolor my-1.5 shadow-lg focus:outline-none focus:ring focus:ring-lightaccent p-2"
              />
            </div>

            <div className="flex flex-row justify-evenly w-96 pt-4">
              <div className="w-16 h-9 content-center">
                {loading ? (
                  <div className="flex justify-center">
                    <CustomLoader />
                  </div>
                ) : (
                  ""
                )}
              </div>
              <button
                type="submit"
                className="w-28 h-9 bg-light-btn rounded-md text-nav font-bold italic shadow-lg"
              >
                Update Profile
              </button>
            </div>
          </form>

          <div className="mt-4">
            {message && <p style={{ color: "green" }}>{message}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateUserForm;
