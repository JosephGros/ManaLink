"use client";
import { useState } from "react";
import Setup2FA from "../components/Setup2FA";
import LogoutButton from "../components/LogoutBtn";
import UpdateUserForm from "../components/UpdateUserForm";
import Navbar from "../components/Navbar";

const HomePage = () => {
  // This whole page is for testing until everything else is done and home page is being made.

  const [userId, setUserId] = useState("");

  const handleTestSetup = () => {
    setUserId("66e19f848f2abae307045686");
  };

  return (
    <>
      <div>
        <h1 className="text-textcolor">Welcome to the Home Page</h1>
        <LogoutButton />

        <div>
          <button
            onClick={handleTestSetup}
            className="bg-blue-500 text-white p-2 rounded-md mt-4"
          >
            Test 2FA Setup
          </button>
        </div>

        {userId && <Setup2FA userId={userId} />}

        <div>
          <button className="bg-btn text-textcolor p-2 rounded-md mt-4">
            <a href="/admin">Admin</a>
          </button>
          <button className="bg-btn text-textcolor p-2 rounded-md mt-4">
            <a href="/moderator">Moderator</a>
          </button>
        </div>

        <div>
          <button className="bg-btn text-textcolor p-2 rounded-md mt-4">
            <a href="/profile">Profile</a>
          </button>
        </div>

        <div>
          <UpdateUserForm />
        </div>
      </div>
    </>
  );
};

export default HomePage;
