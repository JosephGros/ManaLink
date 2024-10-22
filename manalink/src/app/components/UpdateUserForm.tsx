"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CustomLoader from "./CustomLoading";
import eyeOpen from "../../../public/assets/eye.png";
import eyeClosed from "../../../public/assets/eye-crossed.png";
import Image from "next/image";
import LogoutButton from "./LogoutBtn";
import Manage2FA from "./Handle2FA";

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
  const [showPassword, setShowPassword] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordRepeat, setConfirmPasswordRepeat] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/user-profile");
        const data = await response.json();
        const user = data.user;
        setUserId(user._id);
        setIs2FAEnabled(user.twoFactorEnabled);
      } catch (error) {
        console.error("Failed to load user", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
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

  const handleDelete = async () => {
    if (confirmPassword !== confirmPasswordRepeat) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/delete-user", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, password: confirmPassword }),
      });

      if (response.ok) {
        setMessage("Account deleted successfully.");
        router.push("/");
      } else {
        const data = await response.json();
        setError(data.error || "Failed to delete account.");
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handle2FAButtonClick = () => {
    setShow2FAModal(true);
  };

  return (
    <>
      <div className="flex justify-center">
        <div className="flex flex-col max-w-96 rounded-md justify-center items-center">
          <h1 className="font-bold text-textcolor text-3xl pb-6">
            Update Profile
          </h1>
          <form onSubmit={handleUpdate}>
            <div className="flex justify-center">
              <div className="relative w-56">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="w-full h-10 bg-input bg-opacity-20 rounded-md text-sm text-textcolor my-1.5 shadow-lg focus:outline-none focus:ring focus:ring-lightaccent p-2 pr-10"
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
                className="w-56 h-10 bg-input bg-opacity-20 rounded-md text-sm text-textcolor my-1.5 shadow-lg focus:outline-none focus:ring focus:ring-lightaccent p-2"
              />
            </div>
            <div className="flex justify-center">
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="New Email (optional)"
                className="w-56 h-10 bg-input bg-opacity-20 rounded-md text-sm text-textcolor my-1.5 shadow-lg focus:outline-none focus:ring focus:ring-lightaccent p-2"
              />
            </div>
            <div className="flex justify-center">
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password (optional)"
                className="w-56 h-10 bg-input bg-opacity-20 rounded-md text-sm text-textcolor my-1.5 shadow-lg focus:outline-none focus:ring focus:ring-lightaccent p-2"
              />
            </div>
            <div className="flex justify-center">
              <input
                type="text"
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value)}
                placeholder="2FA Code"
                required
                className="w-56 h-10 bg-input bg-opacity-20 rounded-md text-sm placeholder: text-textcolor my-1.5 shadow-lg focus:outline-none focus:ring focus:ring-lightaccent p-2"
              />
            </div>
            <div className="flex justify-center mt-4">
              <button
                type="button"
                onClick={handle2FAButtonClick}
                className="bg-btn text-nav rounded-md p-1 font-bold text-sm text-center"
              >
                {is2FAEnabled
                  ? "Manage Two-Factor Authentication"
                  : "Enable Two-Factor Authentication"}
              </button>
            </div>
            <div className="max-w-96 items-center content-center">
              {loading ? (
                <div className="flex justify-center">
                  <CustomLoader />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 justify-center items-center max-w-96 pt-4">
                  <div className="flex justify-center">
                    <LogoutButton />
                  </div>
                  <div className="flex justify-center">
                    <button
                      type="submit"
                      className="w-28 h-9 bg-btn rounded-md text-nav font-bold shadow-lg"
                    >
                      Update
                    </button>
                  </div>
                  <div className="flex col-span-2 justify-center">
                    <button
                      type="button"
                      onClick={() => setShowDeleteModal(true)}
                      className="w-40 h-9 bg-btn rounded-md text-danger2 font-extrabold shadow-lg"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              )}
            </div>
          </form>

          <div className="mt-4">
            {message && <p style={{ color: "green" }}>{message}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>
        </div>
      </div>

      {show2FAModal && (
        <div
          onClick={() => setShow2FAModal(false)}
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-11/12 max-w-96 bg-bg2 p-6 rounded-md shadow-lg text-textcolor"
          >
            <Manage2FA twoFA={is2FAEnabled} id={userId} />
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShow2FAModal(false)}
                className="bg-btn text-danger2 font-bold px-4 py-2 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div
          onClick={() => setShowDeleteModal(false)}
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-11/12 max-w-96 bg-bg2 p-6 rounded-md shadow-lg text-textcolor"
          >
            <h2 className="text-xl font-bold mb-4">Confirm Account Deletion</h2>
            <p>Please enter your password twice to confirm deletion:</p>
            <div>
              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="w-full h-10 bg-input bg-opacity-20 rounded-md placeholder:text-textcolor my-1.5 shadow-lg focus:outline-none focus:ring focus:ring-lightaccent p-2"
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
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPasswordRepeat}
                onChange={(e) => setConfirmPasswordRepeat(e.target.value)}
                placeholder="Repeat Password"
                className="w-full h-10 bg-input bg-opacity-20 rounded-md placeholder:text-textcolor my-1.5 shadow-lg focus:outline-none focus:ring focus:ring-lightaccent p-2"
              />
            </div>
            <div className="flex justify-end space-x-4 mt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-btn text-nav rounded px-4 py-2 font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-btn text-danger2 rounded px-4 py-2 font-bold"
              >
                Confirm Deletion
              </button>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateUserForm;