"use client";
import { useState } from "react";
import Setup2FA from "../components/Setup2FA";
import LogoutButton from "../components/LogoutBtn";

const HomePage = () => {

    // This whole page is for testing until everything else is done and home page is being made.

    const [userId, setUserId] = useState(''); 

    const handleTestSetup = () => {
        setUserId('');
    };

    return (
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
        </div>
    );
};

export default HomePage;
