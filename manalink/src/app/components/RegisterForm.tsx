"use client";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { CustomLoader } from "./CustomLoading";

const sanitizeInput = (str: string) => {
    return str.replace(/[^\x20-\x7EåäöÅÄÖ]/g, '');
}

const validateInput = (username: string, email: string, firstName: string, lastName: string, password: string, confirmPassword: string) => {

    username = sanitizeInput(username);
    email = sanitizeInput(email);
    firstName = sanitizeInput(firstName);
    lastName = sanitizeInput(lastName);

    if (!/^[a-zA-ZåäöÅÄÖ0-9]+$/.test(username)) {
        return { error: 'Username can only contain these characters (letters and numbers)' };
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
        return { error: "Invalid email format" };
    }

    if (!/^[a-zA-ZåäöÅÄÖ]+$/.test(firstName)) {
        return { error: 'Invalid charachters try again!' };
    }

    if (!/^[a-zA-ZåäöÅÄÖ]+$/.test(lastName)) {
        return { error: 'Invalid charachters try again!' };
    }

    if (!/(?=.*[A-Z])(?=.*\d)/.test(password)) {
        return { error: "Password must contain at least one uppercase letter and one number" };
    }

    if (password !== confirmPassword) {
        return { error: "Passwords do not match" };
    }

    return { error: null };
}


const RegisterForm = () => {
    
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setMessage(null);
        setError(null);
        setLoading(true);

        const validation = validateInput(username, email, firstName, lastName, password, confirmPassword);
        if (validation.error) {
            setError(validation.error);
            setLoading(false);
            return;
        }

        const payload = {
            username,
            email,
            firstName,
            lastName,
            password,
            confirmPassword
        }

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                setUsername('');
                setEmail('');
                setFirstName('');
                setLastName('');
                setPassword('');
                setConfirmPassword('');
                
                setTimeout(() => {
                    router.push("/login");
                }, 2000);

            } else {
                setError(data.error);
            }
        } catch (error: any) {
            setError(`${error} An unexpected error occurred. Please try again.`);
        } finally {
            setLoading(false);
        };
    };

    return (
        <>
        <div className="flex justify-center">
            <div className="flex flex-col w-96 p-4 rounded-md bg-bg2 justify-center items-center">
                <h1 className="font-bold italic text-textcolor text-4xl pb-6">Register</h1>

                <form onSubmit={handleSubmit}>
                    <div className="flex justify-center">
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required className="w-56 h-10 bg-input bg-opacity-20 rounded-md placeholde:text-textcolor text-textcolor my-1.5 drop-shadow-2xl focus:outline-none focus:ring focus:ring-lightaccent p-2" />
                    </div>
                    <div className="flex justify-center">
                        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required className="w-56 h-10 bg-input bg-opacity-20 rounded-md placeholde:text-textcolor text-textcolor my-1.5 focus:outline-none focus:ring focus:ring-lightaccent p-2" />
                    </div>
                    <div className="flex justify-center">
                        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" required className="w-56 h-10 bg-input bg-opacity-20 rounded-md placeholde:text-textcolor text-textcolor my-1.5 focus:outline-none focus:ring focus:ring-lightaccent p-2" />
                    </div>
                    <div className="flex justify-center">
                        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" required className="w-56 h-10 bg-input bg-opacity-20 rounded-md placeholde:text-textcolor text-textcolor my-1.5 focus:outline-none focus:ring focus:ring-lightaccent p-2" />
                    </div>
                    <div className="flex justify-center">
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required className="w-56 h-10 bg-input bg-opacity-20 rounded-md placeholde:text-textcolor text-textcolor my-1.5 focus:outline-none focus:ring focus:ring-lightaccent p-2" />
                    </div>
                    <div className="flex justify-center">
                        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm password" required className="w-56 h-10 bg-input bg-opacity-20 rounded-md placeholde:text-textcolor text-textcolor my-1.5 focus:outline-none focus:ring focus:ring-lightaccent p-2" />
                    </div>

                    <div className="flex flex-row justify-evenly w-96 pt-6">    
                        <button className="w-28 h-9 bg-light-btn rounded-md text-nav font-bold italic">
                            <a href="/login">Login</a>
                        </button>
                        <div className="w-16 h-9 content-center">
                            {loading ? 
                            <div className="flex justify-center">
                                <CustomLoader />
                            </div> : ""}
                        </div>
                        <button type="submit" className="w-28 h-9 bg-light-btn rounded-md text-nav font-bold italic">
                            Register
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

export default RegisterForm;