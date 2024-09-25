"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CustomLoader from "./CustomLoading";
import eyeOpen from "../../../public/assets/eye.png";
import eyeClosed from "../../../public/assets/eye-crossed.png";
import Image from "next/image";

const ResetPasswordForm = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Password reset successful! Redirecting to login...");
        setTimeout(() => {
          router.push("/login");
        });
      } else {
        setError(data.error);
      }
    } catch (error: any) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex justify-center">
      <div className="flex flex-col w-96 p-4 rounded-md bg-bg2 justify-center items-center">
        <h1 className="font-bold text-textcolor text-4xl pb-6">
          Reset Password
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="flex justify-center drop-shadow-md">
            <input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              required
              className="w-56 h-10 bg-input bg-opacity-20 rounded-md placeholde:text-textcolor text-textcolor my-1.5 shadow-lg focus:outline-none focus:ring focus:ring-lightaccent p-2"
            />
          </div>
          <div className="flex justify-center">
            <div className="relative w-56">
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
          <div className="flex flex-col items-center w-96 pt-4">
            <button
              type="submit"
              className="w-28 h-9 bg-light-btn rounded-md text-nav font-bold shadow-lg"
            >
              Submit
            </button>
            <div className="w-16 h-9 content-center">
              {loading ? (
                <div className="flex justify-center">
                  <CustomLoader />
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </form>
        <div className="mt-4">
          {message && <p style={{ color: "green" }}>{message}</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordForm;