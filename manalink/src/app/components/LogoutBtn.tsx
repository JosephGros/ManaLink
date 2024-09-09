"use client";
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const LogoutButton = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogout = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/logout', {
                method: 'POST',
            });

            if (response.ok) {
                router.push('/login');
            } else {
                const data = await response.json();
                setError(data.error || 'An error occurred while logging out');
            }
        } catch (error: any) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button 
                onClick={handleLogout} 
                className="bg-red-500 text-white py-2 px-4 rounded-md"
                disabled={loading}
            >
                {loading ? 'Logging out...' : 'Logout'}
            </button>
        </div>
    );
};

export default LogoutButton;