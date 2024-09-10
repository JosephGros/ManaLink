"use client";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { CustomLoader } from "./CustomLoading";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [twoFactorCode, setTwoFactorCode] = useState(["", "", "", "", "", ""]);
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [userId, setUserId] = useState("");
  const router = useRouter();

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    setError(null);

    const payload = {
      email,
      password,
    };

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.twoFactorEnabled) {
        setTwoFactorRequired(true);
        setUserId(data.userId);
      } else if (response.ok) {
        setMessage("Login successful!");
        router.push("/home");
      } else {
        setError(data.error);
      }
    } catch (error: any) {
      setError(`${error} An unexpected error occurred. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleTwoFactorChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (value.match(/^\d{1}$/)) {
      const newCode = [...twoFactorCode];
      newCode[index] = value;
      setTwoFactorCode(newCode);

      if (index < 5 && value) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleTwoFactorKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !twoFactorCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleTwoFactorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const fullCode = twoFactorCode.join("");

    const payload = {
      userId,
      token: fullCode,
    };

    try {
      const response = await fetch("/api/verify-2fa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("2FA verification successful!");
        router.push("/home");
      } else {
        setError(data.error);
      }
    } catch (error: any) {
      setError(`${error} An unexpected error occurred. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-center">
        <div className="flex flex-col w-96 p-4 rounded-md bg-bg2 justify-center items-center">
          <h1 className="font-bold italic text-textcolor text-4xl pb-6">
            Login
          </h1>

          {!twoFactorRequired ? (
            <form onSubmit={handleSubmit}>
              <div className="flex justify-center drop-shadow-md">
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                  className="w-56 h-10 bg-input bg-opacity-20 rounded-md placeholde:text-textcolor text-textcolor my-1.5 shadow-lg focus:outline-none focus:ring focus:ring-lightaccent p-2"
                />
              </div>
              <div className="flex justify-center">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="w-56 h-10 bg-input bg-opacity-20 rounded-md placeholde:text-textcolor text-textcolor my-1.5 shadow-lg focus:outline-none focus:ring focus:ring-lightaccent p-2"
                />
              </div>

              <div className="flex flex-row justify-evenly w-96 pt-6">
                <button className="w-28 h-9 bg-light-btn rounded-md text-nav font-bold italic shadow-lg">
                  <a href="/register">Register</a>
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
                <button
                  type="submit"
                  className="w-28 h-9 bg-light-btn rounded-md text-nav font-bold italic shadow-lg"
                >
                  Login
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleTwoFactorSubmit}>
              <div className="flex justify-center space-x-2">
                {twoFactorCode.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleTwoFactorChange(e, index)}
                    onKeyDown={(e) => handleTwoFactorKeyDown(e, index)}
                    className="w-10 h-12 text-center text-2xl bg-input bg-opacity-20 rounded-md text-textcolor shadow-lg focus:outline-none focus:ring focus:ring-lightaccent p-2"
                    required
                  />
                ))}
              </div>

              <div className="flex flex-row justify-center w-96 pt-6">
                <button
                    type="submit"
                    className="w-28 h-9 bg-light-btn rounded-md text-nav font-bold italic shadow-lg"
                    >
                    Verify 2FA
                </button>
              </div>
              <div className="flex flex-row justify-center w-96 pt-6">
                <div className="w-16 h-9 self-end">
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
          )}

          <div className="mt-4">
            {message && <p style={{ color: "green" }}>{message}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
