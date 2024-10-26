"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CustomLoader from "./CustomLoading";

const LogoutButton = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/logout", {
        method: "POST",
      });

      if (response.ok) {
        router.push("/login");
      } else {
        const data = await response.json();
        setError(data.error || "An error occurred while logging out");
      }
    } catch (error: any) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <p className="font-bold text-danger">{error}</p>}
      <button
        onClick={handleLogout}
        className="bg-btn text-nav rounded-md w-28 h-9 font-bold shadow-lg"
        disabled={loading}
      >
        {loading ? <CustomLoader /> : "Logout"}
      </button>
    </div>
  );
};

export default LogoutButton;
