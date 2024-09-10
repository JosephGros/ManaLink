import { useState } from 'react';

const Setup2FA = ({ userId }: { userId: string }) => {
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const setup2FA = async () => {
        try {
            const response = await fetch('/api/setup-2fa', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId })
            });

            const data = await response.json();
            if (response.ok) {
                setQrCode(data.qrCode);
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('Failed to set up 2FA. Please try again.');
        }
    };

    return (
        <div>
            <button onClick={setup2FA} className="bg-blue-500 text-white p-2 rounded-md">
                Set Up Two-Factor Authentication
            </button>
            {qrCode && (
                <div className="mt-4">
                    <p>Scan this QR code with your authenticator app:</p>
                    <img src={qrCode} alt="QR Code for 2FA" />
                </div>
            )}
            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
};

export default Setup2FA;