import { useState, useEffect } from 'react';
import axios from 'axios';

const useAxios = (url) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async (targetUrl) => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(targetUrl || url);
            setData(response.data);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Terjadi kesalahan');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(url);
    }, [url]);

    return { data, loading, error, refetch: () => fetchData(url) };
};

export default useAxios;