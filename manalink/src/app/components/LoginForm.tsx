"use client";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import CustomLoader from "./CustomLoading";
import eyeOpen from "../../../public/assets/eye.png";
import eyeClosed from "../../../public/assets/eye-crossed.png";
import Image from "next/image";

const getIpAddress = async () => {
  try {
    const response = await fetch("/api/get-ip");
    if (!response.ok) {
      throw new Error(`Failed to fetch IP: ${response.statusText}`);
    }
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error("Error fetching IP address:", error);
    return null;
  }
};

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [twoFactorCode, setTwoFactorCode] = useState(["", "", "", "", "", ""]);
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [userId, setUserId] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    setError(null);

    try {
      const ipAddress = await getIpAddress();
      if (!ipAddress) {
        throw new Error("Unable to retrieve IP address");
      }

      const payload = { email, password, ipAddress };

      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.twoFactorRequired) {
        setTwoFactorRequired(true);
        setUserId(data.userId);
      } else if (response.ok) {
        setMessage("Login successful!");
        router.push("/");
      } else {
        setError(data.error);
      }
    } catch (error: any) {
      setError(`${error} An unexpected error occurred. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleTwoFactorChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
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

  const handleTwoFactorKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
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
      ipAddress: await getIpAddress(),
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
        router.push("/");
      } else {
        setError(data.error);
      }
    } catch (error: any) {
      setError(`${error} An unexpected error occurred. Please try again.`);
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
        <div className="flex flex-col w-4/5 max-w-96 p-4 rounded-md bg-bg2 justify-center items-center">
          <h1 className="font-bold text-textcolor text-4xl pb-6">
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
                  className="w-56 h-10 bg-input bg-opacity-20 rounded-md placeholder:text-textcolor text-textcolor my-1.5 shadow-lg focus:outline-none focus:ring focus:ring-lightaccent p-2"
                />
              </div>
              <div className="flex justify-center">
                <div className="relative w-56">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    className="w-full h-10 bg-input bg-opacity-20 rounded-md placeholder:text-textcolor text-textcolor my-1.5 shadow-lg focus:outline-none focus:ring focus:ring-lightaccent p-2 pr-10"
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
                <button
                  type="button"
                  className="text-xs text-lightaccent hover:underline"
                  onClick={() => router.push("/request-pass-reset")}
                >
                  Forgot Password?
                </button>
              </div>
              <div className="flex flex-row justify-center w-96 pt-4">
                <button className="w-28 h-9 bg-light-btn rounded-md text-nav font-bold shadow-lg">
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
                  className="w-28 h-9 bg-light-btn rounded-md text-nav font-bold shadow-lg"
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
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
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
                  className="w-28 h-9 bg-light-btn rounded-md text-nav font-bold shadow-lg"
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
