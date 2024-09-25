"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import CustomLoader from "./CustomLoading";
import eyeOpen from "../../../public/assets/eye.png";
import eyeClosed from "../../../public/assets/eye-crossed.png";
import Image from "next/image";

const sanitizeInput = (str: string): string => {
  return str
    .trim()
    .replace(/[^\p{L}\p{N}\s@._-]/gu, "")
    .normalize("NFC");
};

const validateInput = (
  username: string,
  email: string,
  firstName: string,
  lastName: string,
  password: string,
  confirmPassword: string
) => {
  username = sanitizeInput(username);
  email = sanitizeInput(email);
  firstName = sanitizeInput(firstName);
  lastName = sanitizeInput(lastName);

  if (username.length < 3) {
    return { error: "Username must be at least 3 characters long" };
  }

  if (!/^[\p{L}\p{N}._-]+$/u.test(username)) {
    return {
      error:
        "Username can only contain letters, numbers, periods, hyphens, and underscores.",
    };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Invalid email format" };
  }

  if (!/^[\p{L}]+$/u.test(firstName)) {
    return { error: "Invalid characters in first name" };
  }

  if (!/^[\p{L}]+$/u.test(lastName)) {
    return { error: "Invalid characters in last name" };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters long" };
  }

  if (!/(?=.*[A-Z])(?=.*\d)/.test(password)) {
    return {
      error:
        "Password must contain at least one uppercase letter and one number",
    };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  return {
    error: null,
    username,
    email,
    firstName,
    lastName,
    password,
    confirmPassword,
  };
};

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setMessage(null);
    setError(null);
    setLoading(true);

    const validation = validateInput(
      username,
      email,
      firstName,
      lastName,
      password,
      confirmPassword
    );
    if (validation.error) {
      setError(validation.error);
      setLoading(false);
      return;
    }

    console.log("Validated : ", validation);

    const payload = {
      username,
      email,
      firstName,
      lastName,
      password,
      confirmPassword,
    };

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setUsername("");
        setEmail("");
        setFirstName("");
        setLastName("");
        setPassword("");
        setConfirmPassword("");

        setTimeout(() => {
          router.push("/login");
        });
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
            Register
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="flex justify-center">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
                className="w-56 h-10 bg-input bg-opacity-20 rounded-md placeholde:text-textcolor text-textcolor my-1.5 shadow-lg focus:outline-none focus:ring focus:ring-lightaccent p-2"
              />
            </div>
            <div className="flex justify-center">
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
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
                required
                className="w-56 h-10 bg-input bg-opacity-20 rounded-md placeholde:text-textcolor text-textcolor my-1.5 shadow-lg focus:outline-none focus:ring focus:ring-lightaccent p-2"
              />
            </div>
            <div className="flex justify-center">
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
                required
                className="w-56 h-10 bg-input bg-opacity-20 rounded-md placeholde:text-textcolor text-textcolor my-1.5 shadow-lg focus:outline-none focus:ring focus:ring-lightaccent p-2"
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
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                required
                className="w-56 h-10 bg-input bg-opacity-20 rounded-md placeholde:text-textcolor text-textcolor my-1.5 shadow-lg focus:outline-none focus:ring focus:ring-lightaccent p-2"
              />
            </div>

            <div className="flex flex-row justify-evenly w-full max-w-96 pt-6">
              <button className="w-28 h-9 bg-light-btn rounded-md text-nav font-bold shadow-lg">
                <a href="/login">Login</a>
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
                Register
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

export default RegisterForm;
