"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import CustomLoader from "./CustomLoading";

const RequestPassResetForm = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch("/api/request-password-reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Password reset link sent to your email!");
      } else {
        setError(data.error);
      }
    } catch (error: any) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="flex flex-col w-96 p-4 rounded-md bg-bg2 justify-center items-center">
        <h1 className="font-bold text-textcolor text-4xl pb-6">
          Password Reset
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="flex justify-center drop-shadow-md">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-56 h-10 bg-input bg-opacity-20 rounded-md placeholde:text-textcolor text-textcolor my-1.5 shadow-lg focus:outline-none focus:ring focus:ring-lightaccent p-2"
            />
          </div>
          <div className="flex flex-col items-center w-96 pt-6">
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

export default RequestPassResetForm;
