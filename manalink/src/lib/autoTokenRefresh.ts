"use client";
// lib/autoTokenRefresh.ts
import { useEffect } from 'react';

const REFRESH_INTERVAL = 15 * 60 * 1000; // 15 minutes

const useTokenAutoRefresh = () => {
  const refreshToken = async () => {
    try {
      const response = await fetch('/api/refresh-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Ensure cookies are included
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      if (data.token) {
        console.log('Token refreshed successfully');
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      refreshToken();
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return null;
};

export default useTokenAutoRefresh;
