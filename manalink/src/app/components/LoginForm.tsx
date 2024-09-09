"use client";
import { useRouter } from 'next/navigation';
import { useState } from "react";
import { CustomLoader } from "./CustomLoading";


const LoginForm = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setLoading(true);
        setError(null);

        const payload = {
            email,
            password
        };

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                setError('');

                setTimeout(() => {
                    router.push('/home');
                }, 2000);
            } else {
                setError(data.error);
            }
        } catch (error:any) {
            setError(`${error} An unexpected error occurred. Please try again.`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        <div className="flex justify-center">
            <div className="flex flex-col w-96 p-4 rounded-md bg-bg2 justify-center items-center">
                <h1 className="font-bold italic text-textcolor text-4xl pb-6">Login</h1>

                <form onSubmit={handleSubmit}>
                    <div className="flex justify-center drop-shadow-md">
                        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required className="w-56 h-10 bg-input bg-opacity-20 rounded-md placeholde:text-textcolor text-textcolor my-1.5 shadow-lg focus:outline-none focus:ring focus:ring-lightaccent p-2" />
                    </div>
                    <div className="flex justify-center">
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required className="w-56 h-10 bg-input bg-opacity-20 rounded-md placeholde:text-textcolor text-textcolor my-1.5 shadow-lg focus:outline-none focus:ring focus:ring-lightaccent p-2" />
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
                            ) : ""}
                        </div>
                        <button type="submit" className="w-28 h-9 bg-light-btn rounded-md text-nav font-bold italic shadow-lg">
                            Login
                        </button>
                    </div>
                </form>

                <div className="mt-4">
                    {message && <p style={{ color: 'green' }}>{message}</p>}
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </div>
            </div>
        </div>
        </>
    )
}

export default LoginForm;