import { useState, useEffect } from 'react';

// Use a generic type 'T' to make the hook reusable for any data type
export function useApi<T>(url: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!url) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Use environment variable for the API base URL
        const fullUrl = `${import.meta.env.VITE_API_BASE_URL}${url}`;
        const res = await fetch(fullUrl, {
          headers: { Authorization: `Bearer demo` }, // In a real app, this token would come from auth context
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const jsonData = await res.json();
        setData(jsonData);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]); // Re-run effect if the URL changes

  return { data, loading, error };
}